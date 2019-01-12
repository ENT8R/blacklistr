const queryTypes = {
  allExcept: 'all except',
  only: 'only'
};

const modes = {
  blacklist: 'blacklist',
  whitelist: 'whitelist'
};

// parses a given input string
function parse(input) {
  const parsed = {
    countries: [],
    comments: {},
    mode: ''
  };

  if (!input) {
    return parsed;
  }
  const lines = input.split('\n');
  if (!lines) {
    return parsed;
  }

  for (let i = 0; i < lines.length; i++) {
    // filter out lines that start with comments or which don't contain any content
    if (lines[i].startsWith('//') || lines[i] === '' || lines[i] === '\n') {
      continue;
    }

    // set the mode if it is not set yet
    if (!parsed.mode) {
      if (lines[i].startsWith(queryTypes.allExcept)) {
        parsed.mode = modes.blacklist;
      } else if (lines[i].startsWith(queryTypes.only)) {
        parsed.mode = modes.whitelist;
      }
      continue;
    }

    const data = lines[i].split(/\/\/ (.+)?/, 2);
    const countries = normalizeArray(data[0].split(','));
    const comments = data[1];

    for (let i = 0; i < countries.length; i++) {
      parsed.countries.push(normalize(countries[i]).replace(/"/g, ''));
    }

    if (comments) {
      parsed.comments[countries[countries.length - 1]] = comments.replace(' ', '');
    }
  }

  return parsed;
}

// parses a file used by StreetComplete
function streetcomplete(input, java) {
  let mode;

  if (input.includes('Countries.noneExcept')) {
    mode = 'Countries.noneExcept';
  } else if (input.includes('Countries.allExcept')) {
    mode = 'Countries.allExcept';
  } else {
    throw new TypeError('This file is not valid because it contains no black- or whitelist!');
  }

  let regex;
  if (java) {
    regex = new RegExp(/Countries\.(?:noneExcept|allExcept)\([\s\S]*?\{([\s\S]*?)?\}\)/);
  } else {
    regex = new RegExp(/Countries\.(?:noneExcept|allExcept)\(([\s\S]*?)\)/);
    // comments have to be removed because they might contain a closing bracket
    input = input.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
  }

  const countries = normalizeInputCountries(regex.exec(input)[1].trim().split('\n'));

  let r = mode.includes('noneExcept') ? queryTypes.only : queryTypes.allExcept;
  r += '\n';

  for (let i = 0; i < countries.length; i++) {
    if (countries[i] === '') {
      continue;
    }
    r += countries[i];
    r += '\n';
  }
  return r;
}

// stringify a given input object
function stringify(input) {
  let finalString = '';

  if (input.mode === modes.blacklist) {
    finalString += `${queryTypes.allExcept}\n`;
  } else if (input.mode === modes.whitelist) {
    finalString += `${queryTypes.only}\n`;
  }

  for (let i = 0; i < input.countries.length; i++) {
    const country = `${input.countries[i]}`;
    const comment = input.comments[`${country}`];
    finalString += `"${country}"`;
    if (i !== input.countries.length - 1) {
      finalString += ',';
    }
    if (comment) {
      finalString += ` // ${comment}\n`;
    }
  }

  return finalString;
}

function normalize(value) {
  return value.replace(/ /g, '').replace(/\t/g, '').replace(/"/g, '');
}

function normalizeArray(array) {
  const tempArray = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] === '' || array[i].length < 2 || !array[i].match('[a-zA-Z]+')) {
      continue;
    }
    tempArray.push(normalize(array[i]));
  }
  return tempArray;
}

function normalizeInputCountries(a) {
  const r = [];
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '') {
      continue;
    }
    r.push(a[i].replace(/\/\//, '//').replace(/\t/g, '').trim());
  }
  return r;
}

exports.modes = modes;
exports.parse = parse;
exports.streetcomplete = streetcomplete;
exports.stringify = stringify;
