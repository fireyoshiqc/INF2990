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

     describe('isWordOverlappingCentralTile', () => {
        it('should verify if the word is correctly overlapping the central tile.', done => {
            let c1 = new CommandPlaceWord("a", 1, "v", "Bac"); // B is a JOKER
            expect(scrabbleGame.isWordOverlappingCentralTile(c1)).to.be.false;

            let c2 = new CommandPlaceWord("h", 1, "h", "abcdefghijklmno");
            expect(scrabbleGame.isWordOverlappingCentralTile(c2)).to.be.true;

            let c3 = new CommandPlaceWord("a", 8, "v", "abcdefghijklmno");
            expect(scrabbleGame.isWordOverlappingCentralTile(c3)).to.be.true;

            let c4 = new CommandPlaceWord("a", 1, "h", "abcdefgh");
            expect(scrabbleGame.isWordOverlappingCentralTile(c4)).to.be.false;

            let c5 = new CommandPlaceWord("a", 1, "v", "abcdefgh");
            expect(scrabbleGame.isWordOverlappingCentralTile(c5)).to.be.false;

            let c6 = new CommandPlaceWord("h", 8, "v", "a");
            expect(scrabbleGame.isWordOverlappingCentralTile(c6)).to.be.true;

            let c7 = new CommandPlaceWord("h", 8, "h", "a");
            expect(scrabbleGame.isWordOverlappingCentralTile(c7)).to.be.true;

            let c8 = new CommandPlaceWord("h", 1, "h", "abcdefgh");
            expect(scrabbleGame.isWordOverlappingCentralTile(c8)).to.be.true;

            let c9 = new CommandPlaceWord("h", 8, "h", "abcdefgh");
            expect(scrabbleGame.isWordOverlappingCentralTile(c9)).to.be.true;

            let c10 = new CommandPlaceWord("a", 8, "v", "abcdefgh");
            expect(scrabbleGame.isWordOverlappingCentralTile(c10)).to.be.true;

            let c11 = new CommandPlaceWord("h", 8, "v", "abcdefgh");
            expect(scrabbleGame.isWordOverlappingCentralTile(c11)).to.be.true;

            done();
        });
    });

    describe('isWordAdjacentToAnother', () => {
        it('should verify if a letter in the word is adjacent to another letter on the board.', done => {
            let game = new ScrabbleGame();

            let c1 = new CommandPlaceWord("a", 1, "h", "Bac");
            game.placeWord(c1);

            let c2 = new CommandPlaceWord("a", 5, "h", "abc");
            expect(game.isWordAdjacentToAnother(c2)).to.be.false;

            let c3 = new CommandPlaceWord("c", 1, "h", "abc");
            expect(game.isWordAdjacentToAnother(c3)).to.be.false;

            let c4 = new CommandPlaceWord("a", 1, "h", "bacs");
            expect(game.isWordAdjacentToAnother(c4)).to.be.true;

            let c5 = new CommandPlaceWord("a", 4, "v", "abc");
            expect(game.isWordAdjacentToAnother(c5)).to.be.true;

            let c6 = new CommandPlaceWord("h", 8, "h", "a");
            game.placeWord(c6);

            let c7 = new CommandPlaceWord("g", 7, "v", "d");
            expect(game.isWordAdjacentToAnother(c7)).to.be.false;

            let c8 = new CommandPlaceWord("g", 9, "h", "d");
            expect(game.isWordAdjacentToAnother(c8)).to.be.false;

            let c9 = new CommandPlaceWord("i", 7, "h", "d");
            expect(game.isWordAdjacentToAnother(c9)).to.be.false;

            let c10 = new CommandPlaceWord("i", 9, "v", "d");
            expect(game.isWordAdjacentToAnother(c10)).to.be.false;

            let c11 = new CommandPlaceWord("h", 8, "h", "c");
            expect(game.isWordAdjacentToAnother(c11)).to.be.false;

            let c12 = new CommandPlaceWord("g", 8, "v", "b");
            expect(game.isWordAdjacentToAnother(c12)).to.be.true;

            let c13 = new CommandPlaceWord("i", 8, "h", "b");
            expect(game.isWordAdjacentToAnother(c13)).to.be.true;

            let c14 = new CommandPlaceWord("h", 7, "h", "b");
            expect(game.isWordAdjacentToAnother(c14)).to.be.true;

            let c15 = new CommandPlaceWord("h", 9, "v", "b");
            expect(game.isWordAdjacentToAnother(c15)).to.be.true;

            done();
        });
    });

    describe('areAllHorizontalWordsValid', () => {
        it('should verify if every horizontal word is valid.', done => {
            let game = new ScrabbleGame();

            let c1 = new CommandPlaceWord("a", 1, "h", "Bac");
            expect(game.areAllHorizontalWordsValid(c1)).to.be.true;
            game.placeWord(c1);
            expect(game.areAllHorizontalWordsValid(c1)).to.be.true;

            let c2 = new CommandPlaceWord("a", 1, "h", "Bacz");
            expect(game.areAllHorizontalWordsValid(c2)).to.be.false;

            let c3 = new CommandPlaceWord("a", 1, "h", "Bacs");
            expect(game.areAllHorizontalWordsValid(c3)).to.be.true;

            let c4 = new CommandPlaceWord("a", 13, "h", "Bac");
            expect(game.areAllHorizontalWordsValid(c4)).to.be.true;

            let c5 = new CommandPlaceWord("o", 1, "h", "Bac");
            expect(game.areAllHorizontalWordsValid(c5)).to.be.true;

            let c6 = new CommandPlaceWord("o", 13, "h", "Bac");
            expect(game.areAllHorizontalWordsValid(c6)).to.be.true;

            let c7 = new CommandPlaceWord("a", 12, "h", "con");
            expect(game.areAllHorizontalWordsValid(c7)).to.be.true;
            game.placeWord(c7);

            let c8 = new CommandPlaceWord("a", 15, "v", "sons");
            expect(game.areAllHorizontalWordsValid(c8)).to.be.true;

            let c9 = new CommandPlaceWord("o", 12, "h", "con");
            expect(game.areAllHorizontalWordsValid(c9)).to.be.true;
            game.placeWord(c9);

            let c10 = new CommandPlaceWord("l", 15, "v", "sons");
            expect(game.areAllHorizontalWordsValid(c10)).to.be.true;

            done();
        });
    });

    describe('areAllVerticalWordsValid', () => {
        it('should verify if every vertical word is valid.', done => {
            let game = new ScrabbleGame();

            let c1 = new CommandPlaceWord("a", 1, "v", "Bac");
            expect(game.areAllVerticalWordsValid(c1)).to.be.true;
            game.placeWord(c1);
            expect(game.areAllVerticalWordsValid(c1)).to.be.true;

            let c2 = new CommandPlaceWord("a", 1, "v", "Bacz");
            expect(game.areAllVerticalWordsValid(c2)).to.be.false;

            let c3 = new CommandPlaceWord("a", 1, "v", "bacs");
            expect(game.areAllVerticalWordsValid(c3)).to.be.true;

            let c4 = new CommandPlaceWord("a", 14, "v", "Bac");
            expect(game.areAllVerticalWordsValid(c4)).to.be.true;

            let c5 = new CommandPlaceWord("m", 1, "v", "Bac");
            expect(game.areAllVerticalWordsValid(c5)).to.be.true;

            let c6 = new CommandPlaceWord("m", 14, "v", "bac");
            expect(game.areAllVerticalWordsValid(c6)).to.be.true;

            let c7 = new CommandPlaceWord("a", 14, "v", "con");
            expect(game.areAllVerticalWordsValid(c7)).to.be.true;
            game.placeWord(c7);

            let c8 = new CommandPlaceWord("d", 11, "h", "sons");
            expect(game.areAllVerticalWordsValid(c8)).to.be.true;

            let c9 = new CommandPlaceWord("n", 14, "v", "on");
            expect(game.areAllVerticalWordsValid(c9)).to.be.true;
            game.placeWord(c9);

            let c10 = new CommandPlaceWord("m", 12, "h", "cons");
            expect(game.areAllVerticalWordsValid(c10)).to.be.true;

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
