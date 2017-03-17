/**
 * gameMaster.service.spec.ts
 *
 * @authors Mikael Ferland, Pierre To
 * @date 2017/03/11
 */

import { GameMaster } from './gameMaster.service';
import { Player } from '../classes/player';

import { expect } from 'chai';

describe('GameMaster', () => {
    let players = [new Player("player1", "1", 1), new Player("player2", "2", 1)];
    let gameMaster = new GameMaster(players);

    describe('Default constructor', () => {
        it('should construct a GameMaster object.', done => {
            expect(gameMaster).to.not.be.undefined;
            expect(gameMaster).to.be.an.instanceOf(GameMaster);
            expect(gameMaster.getPlayers()[0].getName()).to.be.equal("player1");
            expect(gameMaster.getPlayers()[1].getName()).to.be.equal("player2");
            done();
        });
    });
});
