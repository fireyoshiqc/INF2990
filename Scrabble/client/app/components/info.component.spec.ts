/**
 * info.component.spec.ts
 *
 * @authors Pierre To
 * @date 2017/02/21
 */

import { InfoComponent } from './info.component';

import { expect } from 'chai';

describe('InfoComponent', () => {
    let comp = new InfoComponent();

    it('should create component', done => {
        expect(comp).to.exist;
        expect(comp).to.be.an.instanceOf(InfoComponent);

        expect(comp.getTurnInfo().minutes).to.be.equal(0);
        expect(comp.getTurnInfo().seconds).to.be.equal(0);
        expect(comp.getTurnInfo().activePlayerName).to.be.equal("");
        expect(comp.getTurnInfo().players).to.exist;
        done();
    });
});

describe('updateInfo()', () => {
    it('should update the timer and the active player', done => {
        let testInfoComp = new InfoComponent();
        let testTurnInfo = {
            minutes: 2,
            seconds: 50,
            activePlayerName: "Erica",
            players: [{name: "Yawen", score: 29, rackLettersCount: 1},
                      {name: "Erica", score: 24, rackLettersCount: 3}]};

        testInfoComp.updateTurnInfo(testTurnInfo);

        expect(testInfoComp.getTurnInfo().minutes).to.be.equal(2);
        expect(testInfoComp.getTurnInfo().seconds).to.be.equal(50);
        expect(testInfoComp.getTurnInfo().activePlayerName).to.be.equal("Erica");
        expect(testInfoComp.getTurnInfo().players[0].name).to.be.equal("Yawen");
        expect(testInfoComp.getTurnInfo().players[0].score).to.be.equal(29);
        expect(testInfoComp.getTurnInfo().players[0].rackLettersCount).to.be.equal(1);
        done();
    });
});
