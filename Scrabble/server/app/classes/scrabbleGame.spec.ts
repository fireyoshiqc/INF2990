/**
 * scrabbleGame.spec.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/15
 */

import { ScrabbleGame } from './scrabbleGame';
import { TileType } from './boardTile';

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
});
