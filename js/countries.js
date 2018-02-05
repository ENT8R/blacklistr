window.Countries = {
  //Parse a given input string
  parse: function(input) {
    let parsed = {
      countries: [],
      comments: {},
      mode: ''
    };

    if (!input) return parsed;
    const lines = input.split('\n');
    if (!lines) return parsed;

    for (let i = 0; i < lines.length; i++) {
      //Filter out lines with comments
      if (lines[i].startsWith('#') || lines[i] == '' || lines[i] == '\n') continue;

      //Set the mode if not set yet
      if (!parsed.mode) {
        if (lines[i].startsWith(queryTypes.allExcept)) parsed.mode = modes.blacklist;
        if (lines[i].startsWith(queryTypes.only)) parsed.mode = modes.whitelist;
        continue;
      }

      const data = lines[i].split('#', 2);
      const countries = this.normalizeArray(data[0].split(','));
      const comments = data[1];

      for (let i = 0; i < countries.length; i++) {
        parsed.countries.push(this.normalize(countries[i]));
      }

      if (comments) {
        parsed.comments[countries[countries.length - 1]] = comments.replace(' ', '');
      }
    }

    return parsed;
  },
  //Parses a java file (used by StreetComplete)
  parseJava: function(input) {
    const allAfterMethod = input.split('getEnabledForCountries()')[1];
    const allInsideMethod = allAfterMethod.split('}')[0];
    const allValues = allInsideMethod.split('{');
    const mode = allValues[1];
    const countries = this.normalizeJavaCountries(allValues[2].split('\n'));

    let finalString = '';

    if (mode.includes('noneExcept')) finalString += queryTypes.only;
    else finalString += queryTypes.allExcept;
    finalString += '\n';

    for (let i = 0; i < countries.length; i++) {
      if (countries[i] == "") continue;
      finalString += countries[i];
      if (countries[i]) finalString += '\n';
    }
    return finalString;
  },
  //Stringify a given input object
  stringify: function(input) {
    let finalString = '';

    if (input.mode == modes.blacklist) finalString += queryTypes.allExcept + '\n';
    if (input.mode == modes.whitelist) finalString += queryTypes.only + '\n';

    for (let i = 0; i < input.countries.length; i++) {
      finalString += input.countries[i] + ',';
      if (input.comments[input.countries[i]]) finalString += ' # ' + input.comments[input.countries[i]] + '\n';
    }

    return finalString;
  },
  normalize: function(value) {
    return value.replace(/ /g, '').replace(/"/g, '').replace(/\t/g, '');
  },
  normalizeArray: function(array) {
    let tempArray = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i] == '' || array[i].length < 2) continue;
      tempArray.push(this.normalize(array[i]));
    }
    return tempArray;
  },
  normalizeJavaCountries: function(array) {
    let tempArray = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i] == '') continue;
      tempArray.push(array[i].replace(/\/\//, ' #').replace(/\t/g, '').replace(/"/g, ''));
    }
    return tempArray;
  }
}
