import { PhysicsManager } from './physicsManager.service';
import { CurlingStone, Team } from '../entities/curlingStone';

import { expect } from 'chai';

describe('PhysicsManager', () => {

    let testPhysicsManager = PhysicsManager.getInstance();
    testPhysicsManager.init();

    // TODO: Fix this
    // describe('Default constructor ', () => {
    //     it('should construct the PhysicsManager.', done => {
    //         testPhysicsManager = new PhysicsManager(testCurlingStones);
    //         expect(testPhysicsManager).to.exist;
    //         expect(testPhysicsManager).to.be.an.instanceof(PhysicsManager);
    //         done();
    //     });
    // });

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

            testPhysicsManager.getStones().push(stone1);
            testPhysicsManager.getStones().push(stone2);

            // Tests 60 frames at 60 FPS, so 1 second.
            for (let i = 0; i < 60; i++) {
                testPhysicsManager.update(1 / 60);
            }

            // A COLLISION SHOULD HAVE HAPPENED

            expect(testPhysicsManager.getStones()[0].getVelocity().z).to.be.below(0);
            expect(testPhysicsManager.getStones()[1].getVelocity().z).to.be.above(0);
            done();
        });
    });

    // describe('getOutOfBoundsStones()', () => {
    //     it('should detect when a stone has partially passed the left boundary.', done => {
    //         testPhysicsManager.clearStones();
    //         testPhysicsManager.setStonesForOutOfBoundsTests();
    //         testPhysicsManager.getStones()[0].setHasBeenShot();

    //         expect(testPhysicsManager.getOutOfBoundsStones().length).to.be.equal(1);
    //         expect(testPhysicsManager.getOutOfBoundsStones()[0]).to.be.instanceOf(CurlingStone);
    //         done();
    //     });

    //     it('should detect when a stone has partially passed the right boundary.', done => {
    //         testPhysicsManager.getStones().splice(0, 1);
    //         testPhysicsManager.getStones()[0].setHasBeenShot();

    //         expect(testPhysicsManager.getOutOfBoundsStones().length).to.be.equal(1);
    //         expect(testPhysicsManager.getOutOfBoundsStones()[0]).to.be.instanceOf(CurlingStone);
    //         done();
    //     });

    //     it('should detect when a stone has completely passed the backline.', done => {
    //         testPhysicsManager.getStones().splice(0, 1);
    //         testPhysicsManager.getStones()[0].setHasBeenShot();

    //         expect(testPhysicsManager.getOutOfBoundsStones().length).to.be.equal(1);
    //         expect(testPhysicsManager.getOutOfBoundsStones()[0]).to.be.instanceOf(CurlingStone);
    //         done();
    //     });

    //     it('should detect when a stone has stopped before the gameline.', done => {
    //         testPhysicsManager.getStones().splice(0, 1);
    //         testPhysicsManager.getStones()[0].setHasBeenShot();

    //         expect(testPhysicsManager.getOutOfBoundsStones().length).to.be.equal(1);
    //         expect(testPhysicsManager.getOutOfBoundsStones()[0]).to.be.instanceOf(CurlingStone);
    //         done();
    //     });
    // });

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

    describe('getStones()', () => {
        it('should return the array of curling stones.', done => {
            let stones = testPhysicsManager.getStones();
            expect(stones.length).to.be.greaterThan(0);
            for (let stone of stones) {
                expect(stone).to.be.an.instanceof(CurlingStone);
            }
            done();
        });
    });

    describe('clearStones()', () => {
        it('should empty the array of curling stones.', done => {
            testPhysicsManager.clearStones();
            expect(testPhysicsManager.getStones().length).to.eql(0);
            done();
        });
    });

    // describe('addSweptSpot()', () => {
    //     it('should add a single, standard swept spot to the spot array.', done => {
    //         testPhysicsManager.addSweptSpot(new THREE.Vector3(0, 0, 0), 0);
    //         let sweptSpots = testPhysicsManager.getSweptSpots();
    //         expect(sweptSpots.length).to.eql(1);
    //         expect(sweptSpots[0].id).to.eql(0);
    //         expect(sweptSpots[0].position).to.eql(new THREE.Vector3(0, 0, 0));
    //         done();
    //     });
    // });

    // describe('cleanSweptSpots()', () => {
    //     it('should empty the array of swept spots.', done => {
    //         testPhysicsManager.cleanSweptSpots();
    //         expect(testPhysicsManager.getSweptSpots().length).to.eql(0);
    //         done();
    //     });
    // });

    describe('sortStonesByDistance()', () => {
        it('should sort the array of stones by distance to the game rings.', done => {
            testPhysicsManager.clearStones();
            let position1 = new THREE.Vector3(0, 0, 0);
            let position2 = new THREE.Vector3(0, 0, -1);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(null, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(null, velocity, position2));
            testPhysicsManager.sortStonesByDistance();

            // The closest stone (the second one) should now be the first in the array
            expect(testPhysicsManager.getStones()[0].position.z).to.eql(-1);
            expect(testPhysicsManager.getStones()[1].position.z).to.eql(0);
            done();
        });
    });
});
