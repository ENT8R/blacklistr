/* globals before, describe, it */

import { expect } from 'chai';
import * as fs from 'fs';

import * as parser from '../js/parser.mjs';

async function getQuest(name, version) {
  return await fetch(`https://raw.githubusercontent.com/streetcomplete/StreetComplete/${version}/app/src/main/java/de/westnordost/streetcomplete/quests/${name}`).then(response => response.text());
}

describe('parser', () => {
  describe('#parse()', () => {
    let input, parsed;

    before(() => {
      input = fs.readFileSync('./test/results/housenumber.txt', 'utf-8');
      parsed = parser.parse(input);
    });

    it('should return the expected input', () => {
      const expected = fs.readFileSync('./test/results/housenumber.json', 'utf-8');
      expect(parser.parse(input)).to.deep.equal(JSON.parse(expected));
    });

    it('should return the parsed input as an object', () => {
      expect(parsed).to.be.an('object');
    });

    it('should return the parsed input with the correct amount of countries', () => {
      expect(parsed.countries.length).to.equal(5);
    });

    it('should return the parsed input in the right order', () => {
      expect(parsed.countries).to.deep.equal(['NL', 'DK', 'NO', 'CZ', 'IT']);
    });

    it('should return the parsed input with the correct amount of comments', () => {
      expect(Object.keys(parsed.comments).length).to.equal(5);
    });

    it('should return the right comment of a specific country', () => {
      expect(parsed.comments.NL).to.equal('https://forum.openstreetmap.org/viewtopic.php?id=60356');
    });
  });

  describe('#stringify()', () => {
    const input = fs.readFileSync('./test/results/housenumber.txt', 'utf-8');
    const result = parser.stringify(parser.parse(input));

    it('should return the expected input', () => {
      expect(result).to.deep.equal(input);
    });
  });

  describe('#streetcomplete()', () => {
    describe('#streetcomplete(java, v9.0)', () => {
      let quest;
      before(async () => {
        quest = await getQuest('housenumber/AddHousenumber.java', 'v9.0'); // StreetComplete 9.0 was the last version with quests written in Java
      });

      it('should return the expected input when parsing a Java file', () => {
        const expected = fs.readFileSync('./test/results/streetcomplete/housenumber/java.txt', 'utf-8');
        expect(parser.streetcomplete(quest, true)).to.deep.equal(expected);
      });
    });

    describe('#streetcomplete(kotlin, v17.0)', () => {
      let quest;
      before(async () => {
        quest = await getQuest('housenumber/AddHousenumber.kt', 'v17.0'); // StreetComplete 17.0 (February 2020) is used for all Kotlin files
      });

      it('should return the expected input when parsing a Kotlin file', () => {
        const expected = fs.readFileSync('./test/results/streetcomplete/housenumber/kotlin-v17.txt', 'utf-8');
        expect(parser.streetcomplete(quest, false)).to.deep.equal(expected);
      });
    });

    describe('#streetcomplete(kotlin, v50.0)', () => {
      let quest;
      before(async () => {
        quest = await getQuest('address/AddHousenumber.kt', 'v50.0');
      });

      it('should return the expected input when parsing a Kotlin file', () => {
        const expected = fs.readFileSync('./test/results/streetcomplete/housenumber/kotlin-v50.txt', 'utf-8');
        expect(parser.streetcomplete(quest, false)).to.deep.equal(expected);
      });
    });
  });
});
