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

    describe('isWordCorrectlyOverlapping and placeWord', () => {
        it('should verify if the word is correctly overlapping the other words on the board.', done => {
            let c1 = new CommandPlaceWord("a", 1, "v", "Bac"); // B is a JOKER
            expect(scrabbleGame.isWordCorrectlyOverlapping(c1)).to.be.true;
            let l1 = scrabbleGame.findLettersToRemove(c1);
            expect(l1).to.eql(["JOKER", 'a', 'c']);
            scrabbleGame.placeWord(c1);
            // Verify board
            expect(scrabbleGame.getBoard()[0][0].getLetter().getCharacter()).to.be.equal("B");
            expect(scrabbleGame.getBoard()[0][0].getLetter().isJokerUsedAsLetter()).to.be.true;
            expect(scrabbleGame.getBoard()[1][0].getLetter().getCharacter()).to.be.equal("A");
            expect(scrabbleGame.getBoard()[1][0].getLetter().isJokerUsedAsLetter()).to.be.false;
            expect(scrabbleGame.getBoard()[2][0].getLetter().getCharacter()).to.be.equal("C");
            expect(scrabbleGame.getBoard()[2][0].getLetter().isJokerUsedAsLetter()).to.be.false;

            let c2 = new CommandPlaceWord("c", 1, "h", "chat");
            expect(scrabbleGame.isWordCorrectlyOverlapping(c2)).to.be.true;
            let l2 = scrabbleGame.findLettersToRemove(c2);
            expect(l2).to.eql(['h', 'a', 't']);
            scrabbleGame.placeWord(c2);

            let c3 = new CommandPlaceWord("c", 4, "v", "tennis");
            expect(scrabbleGame.isWordCorrectlyOverlapping(c3)).to.be.true;
            let l3 = scrabbleGame.findLettersToRemove(c3);
            expect(l3).to.eql(['e', 'n', 'n', 'i', 's']);
            scrabbleGame.placeWord(c3);

            let c4 = new CommandPlaceWord("a", 1, "h", "tomate");
            expect(scrabbleGame.isWordCorrectlyOverlapping(c4)).to.be.false;

            let c5 = new CommandPlaceWord("c", 1, "h", "chatte");
            expect(scrabbleGame.isWordCorrectlyOverlapping(c5)).to.be.true;
            let l5 = scrabbleGame.findLettersToRemove(c5);
            expect(l5).to.eql(['t', 'e']);
            scrabbleGame.placeWord(c5);

            expect(scrabbleGame.isWordCorrectlyOverlapping(c1)).to.be.false;
            expect(scrabbleGame.isWordCorrectlyOverlapping(c2)).to.be.false;
            expect(scrabbleGame.isWordCorrectlyOverlapping(c3)).to.be.false;
            expect(scrabbleGame.isWordCorrectlyOverlapping(c5)).to.be.false;

            done();
        });
    });

    describe('copyBoard', () => {
        it('should make a deep copy of the board.', done => {
            let copyBoard = scrabbleGame.copyBoard(scrabbleGame.getBoard());

            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 15; j++) {
                    expect(copyBoard[i][j].getTileType()).to.be.equal(scrabbleGame.getBoard()[i][j].getTileType());
                    expect(copyBoard[i][j].getLetter()).to.be.equal(scrabbleGame.getBoard()[i][j].getLetter());
                    expect(copyBoard[i][j].isEmpty()).to.be.equal(scrabbleGame.getBoard()[i][j].isEmpty());
                    expect(copyBoard[i][j].isBonusActive()).to.be.equal(scrabbleGame.getBoard()[i][j].isBonusActive());
                }
            }

            done();
        });

        it('should make a deep copy of the board.', done => {
            let copyBoard = scrabbleGame.copyBoard(scrabbleGame.getBoard());
            let c1 = new CommandPlaceWord("o", 1, "h", "sac");
            scrabbleGame.placeWord(c1);

            expect(scrabbleGame.getBoard()[14][0].getLetter().getCharacter()).to.be.equal("S");
            expect(scrabbleGame.getBoard()[14][0].getLetter().isJokerUsedAsLetter()).to.be.false;
            expect(scrabbleGame.getBoard()[14][1].getLetter().getCharacter()).to.be.equal("A");
            expect(scrabbleGame.getBoard()[14][1].getLetter().isJokerUsedAsLetter()).to.be.false;
            expect(scrabbleGame.getBoard()[14][2].getLetter().getCharacter()).to.be.equal("C");

            expect(copyBoard[14][0].getTileType()).to.be.equal(scrabbleGame.getBoard()[14][0].getTileType());
            expect(copyBoard[14][0].getLetter()).to.not.be.equal(scrabbleGame.getBoard()[14][0].getLetter());
            expect(copyBoard[14][0].isEmpty()).to.not.be.equal(scrabbleGame.getBoard()[14][0].isEmpty());
            expect(copyBoard[14][0].isBonusActive()).to.be.equal(scrabbleGame.getBoard()[14][0].isBonusActive());

            expect(copyBoard[14][1].getTileType()).to.be.equal(scrabbleGame.getBoard()[14][1].getTileType());
            expect(copyBoard[14][1].getLetter()).to.not.be.equal(scrabbleGame.getBoard()[14][1].getLetter());
            expect(copyBoard[14][1].isEmpty()).to.not.be.equal(scrabbleGame.getBoard()[14][1].isEmpty());
            expect(copyBoard[14][1].isBonusActive()).to.be.equal(scrabbleGame.getBoard()[14][1].isBonusActive());

            expect(copyBoard[14][2].getTileType()).to.be.equal(scrabbleGame.getBoard()[14][2].getTileType());
            expect(copyBoard[14][2].getLetter()).to.not.be.equal(scrabbleGame.getBoard()[14][2].getLetter());
            expect(copyBoard[14][2].isEmpty()).to.not.be.equal(scrabbleGame.getBoard()[14][2].isEmpty());
            expect(copyBoard[14][2].isBonusActive()).to.be.equal(scrabbleGame.getBoard()[14][2].isBonusActive());

            done();
        });
    });

});
