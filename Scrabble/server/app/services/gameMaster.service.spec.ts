/**
 * gameMaster.service.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

import { GameMaster } from './gameMaster.service';

import { expect } from 'chai';

describe('GameMaster', () => {

    let gameMaster = new GameMaster();

    describe('Default constructor', () => {
        it('should construct a GameMaster object.', done => {
            expect(gameMaster).to.not.be.undefined;
            expect(gameMaster).to.be.an.instanceOf(GameMaster);
            done();
        });
    });
});
