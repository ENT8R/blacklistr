/* globals describe */
/* globals it */

const fs = require('fs');

const { expect } = require('chai');

const Countries = require('../js/countries.js');

describe('Countries', () => {
  describe('#parse()', () => {
    const input = fs.readFileSync('./test/assets/housenumber.json', 'utf-8');

    it('should return the expected input', () => {
      const expected = fs.readFileSync('./test/assets/results/housenumber.json', 'utf-8');
      const result = Countries.parse(input);
      expect(JSON.stringify(result)).to.deep.equal(expected);
    });

    housenumber(input, true);
  });

  describe('#streetcomplete()', () => {
    describe('#streetcomplete(java, true)', () => {
      const java = fs.readFileSync('./test/assets/streetcomplete/java/housenumber.java', 'utf-8');

      it('should return the expected input when parsing a Java file', () => {
        const result = Countries.streetcomplete(java, true);
        const expected = fs.readFileSync('./test/assets/results/streetcomplete/java/housenumber.json', 'utf-8');
        expect(result).to.deep.equal(expected);
      });

      housenumber(Countries.streetcomplete(java, true), true);
    });

    describe('#streetcomplete(kotlin, false)', () => {
      const kotlin = fs.readFileSync('./test/assets/streetcomplete/kotlin/housenumber.kt', 'utf-8');
      
      it('should return the expected input when parsing a Kotlin file', () => {
        const result = Countries.streetcomplete(kotlin, false);
        const expected = fs.readFileSync('./test/assets/results/streetcomplete/kotlin/housenumber.json', 'utf-8');
        expect(result).to.deep.equal(expected);
      });

      housenumber(Countries.streetcomplete(kotlin, false), false);
    });
  });

  describe('#stringify()', () => {
    const input = fs.readFileSync('./test/assets/housenumber.json', 'utf-8');
    const result = Countries.stringify(Countries.parse(input));

    it('should return the expected input', () => {
      expect(result).to.deep.equal(input);
    });
  });
});

// Helper functions
function housenumber(input, comments) {
  const result = Countries.parse(input);

  it('should return the parsed input as an object', () => {
    expect(result).to.be.an('object');
  });
  it('should return the parsed input with the correct amount of countries', () => {
    expect(result.countries.length).to.equal(5);
  });
  it('should return the parsed input in the right order', () => {
    expect(result.countries).to.deep.equal(['NL', 'DK', 'NO', 'CZ', 'IT']);
  });

  if (comments) {
    it('should return the parsed input with the correct amount of comments', () => {
      expect(Object.keys(result.comments).length).to.equal(5);
    });
    it('should return the right comment of a specific country', () => {
      expect(result.comments.NL).to.equal('https://forum.openstreetmap.org/viewtopic.php?id=60356');
    });
  }
}
