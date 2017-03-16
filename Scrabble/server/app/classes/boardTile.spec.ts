/**
 * boardTile.spec.ts
 *
 * @authors Yawen Hou et Pierre To
 * @date 2017/03/15
 */

import { BoardTile } from './boardTile';
import { Letter } from './letter';

import { expect } from 'chai';

describe('BoardTile', () => {

    let boardTile = new BoardTile("Basic");

    describe('Default constructor', () => {
        it('should construct a BoardTile object.', done => {
            expect(boardTile).to.not.be.undefined;
            expect(boardTile).to.be.an.instanceOf(BoardTile);
            expect(boardTile.getTileType()).to.be.equal("Basic");
            expect(boardTile.getIsEmpty()).to.be.true;
            done();
        });
    });

    describe('putLetter()', () => {
        it('should put a Letter on a BoardTile object.', done => {
            let letter = new Letter("A");
            boardTile.putLetter(letter);

            expect(boardTile.getLetter()).to.equal(letter);
            done();
        });
    });
});
