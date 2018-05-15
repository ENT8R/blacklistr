/* globals describe */
/* globals it */

const fs = require('fs');

const { expect } = require('chai');

const Countries = require('../js/countries.js');

describe('Countries', () => {
  describe('#parse()', () => {
    const input = fs.readFileSync('./assets/test1.js', 'utf-8');

    it('should return the expected input', () => {
      const expected = fs.readFileSync('./test/assets/results/1.json', 'utf-8');
      const result = Countries.parse(input);
      expect(JSON.stringify(result)).to.deep.equal(expected);
    });

    parseTests(input);
  });

  describe('#parseJava()', () => {
    const input = fs.readFileSync('./test/assets/1.java', 'utf-8');

    it('should return the expected input', () => {
      const result = Countries.parseJava(input);
      const expected = fs.readFileSync('./test/assets/results/2.json', 'utf-8');
      expect(result).to.deep.equal(expected);
    });

    parseTests(Countries.parseJava(input));
  });

  describe('#stringify()', () => {
    const input = fs.readFileSync('./assets/test1.js', 'utf-8');
    const result = Countries.stringify(Countries.parse(input));

    it('should return the expected input', () => {
      expect(result).to.deep.equal(input);
    });
  });
});

// Helper functions
function parseTests(input) {
  const result = Countries.parse(input);

  it('should return the parsed input as an object', () => {
    expect(result).to.be.an('object');
  });
  it('should return the parsed input with the correct amount of countries', () => {
    expect(result.countries.length).to.equal(4);
  });
  it('should return the parsed input with the correct amount of comments', () => {
    expect(Object.keys(result.comments).length).to.equal(4);
  });
  it('should return the parsed input in the right order', () => {
    expect(result.countries).to.deep.equal(['NL', 'DK', 'NO', 'CZ']);
  });
  it('should return the right comment of a specific country', () => {
    expect(result.comments.NL).to.equal('https://forum.openstreetmap.org/viewtopic.php?id=60356');
  });
}
