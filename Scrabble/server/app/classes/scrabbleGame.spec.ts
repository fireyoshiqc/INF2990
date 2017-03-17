/**
 * scrabbleGame.spec.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { ScrabbleGame } from './scrabbleGame';
import { TileType } from './boardTile';
import { CommandPlaceWord } from './commandPlaceWord';

import { expect } from 'chai';

describe('ScrabbleGame', () => {

    let scrabbleGame = new ScrabbleGame();

    describe('Default constructor', () => {
        it('should construct a ScrabbleGame object.', done => {
            expect(scrabbleGame).to.not.be.undefined;
            expect(scrabbleGame).to.be.an.instanceOf(ScrabbleGame);
            done();
        });

        it('should load the scrabble board data in JSON file.', done => {
            expect(scrabbleGame.getBoard()[0][0].getTileType()).to.be.equal(<TileType>"TripleWord");
            expect(scrabbleGame.getBoard()[0][1].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][2].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][3].getTileType()).to.be.equal(<TileType>"DoubleLetter");
            expect(scrabbleGame.getBoard()[0][4].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][5].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][6].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][7].getTileType()).to.be.equal(<TileType>"TripleWord");
            expect(scrabbleGame.getBoard()[0][8].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][9].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][10].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][11].getTileType()).to.be.equal(<TileType>"DoubleLetter");
            expect(scrabbleGame.getBoard()[0][12].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][13].getTileType()).to.be.equal(<TileType>"Basic");
            expect(scrabbleGame.getBoard()[0][14].getTileType()).to.be.equal(<TileType>"TripleWord");
            done();
        });
    });

    describe('isWordInBounds', () => {
        it('should determine if a word to place fits in the board.', done => {
            let c1 = new CommandPlaceWord("a", 13, "h", "TEST");
            let c2 = new CommandPlaceWord("n", 1, "v", "TEST");
            let c3 = new CommandPlaceWord("a", 1, "h", "TRIDIMENSIONNEL");
            let c4 = new CommandPlaceWord("a", 1, "v", "TRIDIMENSIONNEL");

            expect(scrabbleGame.isWordInBounds(c1)).to.be.false;
            expect(scrabbleGame.isWordInBounds(c2)).to.be.false;
            expect(scrabbleGame.isWordInBounds(c3)).to.be.true;
            expect(scrabbleGame.isWordInBounds(c4)).to.be.true;
            done();
        });
    });

    describe('isWordCorrectlyOverlapping', () => {
        it('should verify if the word is correctly overlapping the other words on the board.', done => {
            let c1 = new CommandPlaceWord("a", 1, "v", "BAC");
            expect(scrabbleGame.isWordCorrectlyOverlapping(c1)).to.be.true;
            scrabbleGame.placeWord(c1);

            let c2 = new CommandPlaceWord("c", 1, "h", "CHAT");
            expect(scrabbleGame.isWordCorrectlyOverlapping(c2)).to.be.true;
            scrabbleGame.placeWord(c2);

            let c3 = new CommandPlaceWord("c", 4, "v", "TENNIS");
            expect(scrabbleGame.isWordCorrectlyOverlapping(c3)).to.be.true;
            scrabbleGame.placeWord(c3);

            let c4 = new CommandPlaceWord("a", 1, "h", "TOMATE");
            expect(scrabbleGame.isWordCorrectlyOverlapping(c4)).to.be.false;

            let c5 = new CommandPlaceWord("c", 1, "h", "CHATTE");
            expect(scrabbleGame.isWordCorrectlyOverlapping(c5)).to.be.true;
            scrabbleGame.placeWord(c5);

            expect(scrabbleGame.isWordCorrectlyOverlapping(c1)).to.be.false;
            expect(scrabbleGame.isWordCorrectlyOverlapping(c2)).to.be.false;
            expect(scrabbleGame.isWordCorrectlyOverlapping(c3)).to.be.false;
            expect(scrabbleGame.isWordCorrectlyOverlapping(c5)).to.be.false;

            done();
        });
    });
});
