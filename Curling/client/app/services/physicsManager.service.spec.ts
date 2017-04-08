/**
 * physicsManager.service.ts Tests the physics manager.
 *
 * @authors Félix Boulet, Erica Bugden
 * @modified Félix Boulet, Mikaël Ferland
 * @date 2017/04/01
 */

import { PhysicsManager } from './physicsManager.service';
import { CurlingStone, Team } from '../entities/curlingStone';

import { expect } from 'chai';

describe('PhysicsManager', () => {

    let testPhysicsManager = PhysicsManager.getInstance();

    describe('init()', () => {
        it('should initialize the PhysicsManager singleton.', done => {
            testPhysicsManager.init();
            expect(testPhysicsManager).to.exist;
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

    describe('sortStonesByDistance()', () => {
        it('should sort the array of stones by distance to the game rings.', done => {
            testPhysicsManager.clearStones();
            let position1 = new THREE.Vector3(0, 0, 0);
            let position2 = new THREE.Vector3(0, 0, 1);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(null, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(null, velocity, position2));

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance(new THREE.Vector3(0, 0, 1));

            // The closest stone (the second one) should now be the first in the array
            expect(testPhysicsManager.getStones()[0].position.z).to.eql(1);
            expect(testPhysicsManager.getStones()[1].position.z).to.eql(0);
            done();
        });
    });

    describe('getClosestPlayerStoneInHouse()', () => {
        it('should return the closest player stone.', done => {
            testPhysicsManager.clearStones();
            let position1 = new THREE.Vector3(0, 0, 40.37);
            let position2 = new THREE.Vector3(0, 0, 39.97);
            let position3 = new THREE.Vector3(0, 0, 39.37);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position3));
            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position2));

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance();

            let closestPlayerStone = testPhysicsManager.getClosestPlayerStoneInHouse();

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone.position.z).to.eql(position2.z);
            expect(closestPlayerStone.getTeam()).to.eql(Team.Player);
            done();
        });

        it('should return the closest player stone.', done => {
            testPhysicsManager.clearStones();
            let position1 = new THREE.Vector3(0, 0, 40.37);
            let position2 = new THREE.Vector3(0, 0, 39.97);
            let position3 = new THREE.Vector3(0, 0, 39.37);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position3));
            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position2));

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance(new THREE.Vector3(0, 0, 0));

            let closestPlayerStone = testPhysicsManager.getClosestPlayerStoneInHouse();

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone.position.z).to.eql(position1.z);
            expect(closestPlayerStone.getTeam()).to.eql(Team.Player);
            done();
        });

        it('should return undefined because there are no player stone in house.', done => {
            testPhysicsManager.clearStones();
            let position1 = new THREE.Vector3(0, 0, 40.37);
            let position2 = new THREE.Vector3(0, 0, 39.97);
            let position3 = new THREE.Vector3(0, 0, 19.37);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position2));
            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position3));

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance(new THREE.Vector3(0, 0, 0));

            let closestPlayerStone = testPhysicsManager.getClosestPlayerStoneInHouse();

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone).to.undefined;
            done();
        });

        it('should return undefined because there are no stone in house.', done => {
            testPhysicsManager.clearStones();
            let position1 = new THREE.Vector3(0, 0, 21.37);
            let position2 = new THREE.Vector3(0, 0, 9.97);
            let position3 = new THREE.Vector3(0, 0, 19.37);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position2));
            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position3));

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance(new THREE.Vector3(0, 0, 0));

            let closestPlayerStone = testPhysicsManager.getClosestPlayerStoneInHouse();

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone).to.undefined;
            done();
        });

        it('should return undefined because there are no stone in game.', done => {
            testPhysicsManager.clearStones();

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance(new THREE.Vector3(0, 0, 0));

            let closestPlayerStone = testPhysicsManager.getClosestPlayerStoneInHouse();

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone).to.undefined;
            done();
        });
    });
});
