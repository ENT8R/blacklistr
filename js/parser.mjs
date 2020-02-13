const QUERY_TYPE = {
  ALL_EXCEPT: 'all except',
  ONLY: 'only'
};

const KEYWORDS = {
  ALL_EXCEPT: [
    QUERY_TYPE.ALL_EXCEPT,
    'hide',
    'except',
    'not',
    'disable',
    'blacklist'
  ],
  ONLY: [
    QUERY_TYPE.ONLY,
    'show',
    'just',
    'in',
    'enable',
    'whitelist'
  ]
};

export const MODE = {
  BLACKLIST: 'blacklist',
  WHITELIST: 'whitelist',
  NONE: 'none'
};

// Parses a given input string
export function parse(string) {
  const parsed = {
    countries: [],
    comments: {},
    mode: null
  };

  if (!string) {
    return parsed;
  }
  const lines = string.split('\n');
  if (!lines) {
    return parsed;
  }

  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].trim();

    // Filter out lines that start with comments or don't contain any content
    if (lines[i].startsWith('//') || lines[i] === '' || lines[i] === '\n') {
      continue;
    }

    // Detect the display mode by searching for keywords in the first line
    if (!parsed.mode) {
      if (new RegExp(`^(${KEYWORDS.ALL_EXCEPT.join('|')})`).test(lines[i].toLowerCase())) {
        parsed.mode = MODE.BLACKLIST;
        continue;
      } else if (new RegExp(`^(${KEYWORDS.ONLY.join('|')})`).test(lines[i].toLowerCase())) {
        parsed.mode = MODE.WHITELIST;
        continue;
      } else {
        parsed.mode = MODE.NONE;
      }
    }

    const [ data, comments ] = lines[i].split(/\/\/(.+)?/, 2);
    const countries = normalize(data.split(','));
    parsed.countries.push(...countries);

    if (comments) {
      parsed.comments[countries[countries.length - 1]] = comments.replace(' ', '');
    }
  }

  return parsed;
}

// Stringify a given input object
export function stringify(input) {
  let string = '';

  if (input.mode === MODE.BLACKLIST) {
    string += `${QUERY_TYPE.ALL_EXCEPT}\n`;
  } else if (input.mode === MODE.WHITELIST) {
    string += `${QUERY_TYPE.ONLY}\n`;
  }

  input.countries.forEach((country, index) => {
    string += country;
    if (index !== input.countries.length - 1) {
      string += ',';
    }
    const comment = input.comments[country];
    if (comment) {
      string += ` // ${comment}\n`;
    }
  });

  return string;
}

function normalize(value) {
  if (typeof value === 'string') {
    // Remove all unnecessary tabs, quotation marks and slashes
    return value.replace(/(\t|")/g, '').replace(/\/\//g, '//').trim();
  } else if (Array.isArray(value)) {
    const array = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i] === '' || value[i].length < 2 || !value[i].match('[a-zA-Z]+')) {
        continue;
      }
      array.push(normalize(value[i]));
    }
    return array;
  }
}

// Parses a file used by StreetComplete (i.e. extracts the used information from Java or Kotlin source code)
// TODO: this is not related to the parsing of the editor content itself and should be moved to another class/file
export function streetcomplete(input, java) {
  let mode;
  if (input.match(/(Countries\.noneExcept|NoCountriesExcept)/)) {
    mode = MODE.WHITELIST;
  } else if (input.match(/(Countries\.allExcept|AllCountriesExcept)/)) {
    mode = MODE.BLACKLIST;
  } else {
    throw new TypeError('This file is not valid because it contains no black- or whitelist!');
  }

  let regex;
  if (java) {
    regex = new RegExp(/Countries\.(?:noneExcept|allExcept)\([\s\S]*?\{([\s\S]*?)?\}\)/);
  } else {
    // Comments in Kotlin source code have to be removed because they might contain a closing bracket
    input = input.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
    regex = new RegExp(/(?:Countries\.(?:noneExcept|allExcept)|NoCountriesExcept|AllCountriesExcept)\(([\s\S]*?)\)/);
  }

  const lines = regex.exec(input)[1].split('\n');
  const countries = normalize(lines);

  let text = mode === MODE.WHITELIST ? QUERY_TYPE.ONLY : QUERY_TYPE.ALL_EXCEPT;
  text += '\n';
  text += countries.join('\n');
  return text;
}
