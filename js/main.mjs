import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

import * as Map from './map.mjs';
import * as Parser from './parser.mjs';
import * as Settings from './settings.mjs';

let COUNTRY_CODES = [];

const editor = new EditorView({
  extensions: [
    basicSetup,
    EditorView.lineWrapping,
    oneDark,
    javascript(),
    EditorView.updateListener.of(v => {
      if (v.docChanged) {
        const content = editor.state.doc.toString();
        Settings.set('content', content);
        update();
      }
    })
  ],
  parent: document.getElementById('codemirror-container')
});

document.getElementById('map').addEventListener('change-boundaries', () => {
  boundaries().then(() => update());
});

document.body.addEventListener('toggle-side', () => {
  toggle();
});

function boundaries() {
  const name = Settings.get('boundaries');
  return import(
    /* webpackChunkName: "boundaries/[request]" */
    `../assets/boundaries/${name}.geojson`
  ).then(module => Map.add(module.default));
}

function codes() {
  return import(
    /* webpackChunkName: "codes" */
    '../assets/codes.json'
  ).then(module => COUNTRY_CODES = module.default);
}

function update() {
  const input = Parser.parse(editor.state.doc.toString());
  input.toString();
  Map.update(input);
  text(input);
}

function text(input) {
  let text = '';
  if (input.mode === Parser.MODE.BLACKLIST) {
    text += 'Blacklisted in ';
  } else if (input.mode === Parser.MODE.WHITELIST) {
    text += 'Whitelisted in ';
  }

  input.countries.forEach(country => {
    text += COUNTRY_CODES[country.toUpperCase()] || country;
    // Append a comma except for the last known entry
    if (input.countries.indexOf(country) !== input.countries.length - 1) {
      text += ', ';
    }
  });

  document.getElementById('country-list').innerHTML = text;
}

function setValueOfEditor(value) {
  editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: value
    }
  });
}

(async function() {
  Map.setup(code => {
    const input = Parser.parse(editor.state.doc.toString());
    const index = input.countries.indexOf(code);
    if (index > -1) {
      input.countries.splice(index, 1);
    } else {
      input.countries.push(code);
    }
    setValueOfEditor(Parser.stringify(input));
  });

  Settings.setup();
  await boundaries();
  await codes();

  const url = new URL(window.location.href);
  const data = url.searchParams.get('data');
  const file = url.searchParams.get('file');
  const streetcomplete = url.searchParams.get('streetcomplete');

  if (data) {
    setValueOfEditor(data);
  } else if (file) {
    setValueOfEditor(await fetch(file).then(response => response.text()));
  } else if (streetcomplete) {
    let url = streetcomplete;
    if (!isUrl(streetcomplete)) {
      const QUEST_DIRECTORY = 'https://raw.githubusercontent.com/streetcomplete/StreetComplete/master/app/src/main/java/de/westnordost/streetcomplete/quests/';
      url = QUEST_DIRECTORY + streetcomplete;
    }

    const content = await fetch(url).then(response => response.text());

    const ext = url.split('.').pop();
    if (ext === 'java') {
      setValueOfEditor(Parser.streetcomplete(content, true));
    } else if (ext === 'kt') {
      setValueOfEditor(Parser.streetcomplete(content, false));
    }
  } else {
    setValueOfEditor(Settings.get('content'));
  }
})();

function isUrl(url) {
  return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url); // eslint-disable-line no-useless-escape
}

function toggle() {
  const isSmall = document.getElementById('map').className.includes('s8');
  if (isSmall) {
    document.getElementById('map').classList.remove('s8');
    document.getElementById('map').classList.add('s12');
    Map.hideControl();
  } else {
    document.getElementById('map').classList.remove('s12');
    document.getElementById('map').classList.add('s8');
    Map.showControl();
  }
  Map.resize();
}
