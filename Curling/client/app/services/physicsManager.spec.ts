import { PhysicsManager } from './physicsManager';
import { CurlingStone, Team } from '../entities/curlingStone';

import { expect } from 'chai';

describe('PhysicsManager', () => {

    let testCurlingStones = new Array<CurlingStone>();
    let testPhysicsManager = new PhysicsManager(testCurlingStones);

    describe('Default constructor ', () => {
        it('should construct the PhysicsManager.', done => {
            testPhysicsManager = new PhysicsManager(testCurlingStones);
            expect(testPhysicsManager).to.not.be.undefined;
            expect(testPhysicsManager).to.be.an.instanceof(PhysicsManager);
            done();
        });
    });

    describe('update()', () => {
        it('should update the curling stone position according to its speed.', done => {
            testPhysicsManager.clearStones();
            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, 0)));

            // Tests 60 frames at 60 FPS, so 1 second.
            for (let i = 0; i < 60; i++) {
                testPhysicsManager.update(1 / 60);
            }

            expect(testPhysicsManager.getStones()[0].position.z).to.not.equal(1);
            done();
        });

        it('should update the direction of a curling stone after a collision.', done => {
            testPhysicsManager.clearStones();

            // Collision between 2 stones: stone1 goes down and stone2 goes up on z-axis
            let stone1 = new CurlingStone(Team.AI, new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0));
            let stone2 = new CurlingStone(Team.AI, new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 1));

            //testPhysicsManager = new PhysicsManager();
            testPhysicsManager.getStones().push(stone1);
            testPhysicsManager.getStones().push(stone2);

            //Tests 60 frames at 60 FPS, so 1 second.
            for (let i = 0; i < 60; i++) {
                testPhysicsManager.update(1 / 60);
            }

            //A COLLISION SHOULD HAVE HAPPENED

            expect(testPhysicsManager.getStones()[0].getVelocity().z).to.be.below(0);
            expect(testPhysicsManager.getStones()[1].getVelocity().z).to.be.above(0);
            done();
        });
    });

    describe('getOutOfBoundsStones()', () => {
        it('should detect when a stone has partially passed the left boundary.', done => {
            testPhysicsManager.setStonesForOutOfBoundsTests();
            testPhysicsManager.getStones()[0].setHasBeenShot();

            expect(testPhysicsManager.getOutOfBoundsStones().length).to.be.equal(1);
            expect(testPhysicsManager.getOutOfBoundsStones()[0]).to.be.instanceOf(CurlingStone);
            done();
        });

        it('should detect when a stone has partially passed the right boundary.', done => {
            testPhysicsManager.getStones().splice(0, 1);
            testPhysicsManager.getStones()[0].setHasBeenShot();

            expect(testPhysicsManager.getOutOfBoundsStones().length).to.be.equal(1);
            expect(testPhysicsManager.getOutOfBoundsStones()[0]).to.be.instanceOf(CurlingStone);
            done();
        });

        it('should detect when a stone has completely passed the backline.', done => {
            testPhysicsManager.getStones().splice(0, 1);
            testPhysicsManager.getStones()[0].setHasBeenShot();

            expect(testPhysicsManager.getOutOfBoundsStones().length).to.be.equal(1);
            expect(testPhysicsManager.getOutOfBoundsStones()[0]).to.be.instanceOf(CurlingStone);
            done();
        });

        it('should detect when a stone has stopped before the gameline.', done => {
            testPhysicsManager.getStones().splice(0, 1);
            testPhysicsManager.getStones()[0].setHasBeenShot();

            expect(testPhysicsManager.getOutOfBoundsStones().length).to.be.equal(1);
            expect(testPhysicsManager.getOutOfBoundsStones()[0]).to.be.instanceOf(CurlingStone);
            done();
        });
    });

    describe('allStonesHaveStopped()', () => {
        it('should return true when all stones have stopped moving.', done => {
            testPhysicsManager.clearStones();

            let position = new THREE.Vector3(0, 0, 0);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(null, velocity, position));
            testPhysicsManager.getStones().push(new CurlingStone(null, velocity, position));

            expect(testPhysicsManager.allStonesHaveStopped()).to.be.true;
            done();
        });

        it('should return false when some stones stones are still moving.', done => {
            testPhysicsManager.getStones()[1].getVelocity().add(new THREE.Vector3(0, 0, -100));  // Give one stone speed

            expect(testPhysicsManager.allStonesHaveStopped()).to.be.false;
            done();
        });
    });
});
