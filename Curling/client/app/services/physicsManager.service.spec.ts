/**
 * physicsManager.service.ts Tests the physics manager.
 *
 * @authors Félix Boulet, Erica Bugden
 * @modified Félix Boulet, Mikaël Ferland
 * @date 2017/04/01
 */

import { PhysicsManager } from './physicsManager.service';
import { CurlingStone, Team, SpinOrientation } from '../entities/curlingStone';

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
            let dummyCurlingStones: CurlingStone[] = [];
            testPhysicsManager.init(dummyCurlingStones);
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
            let dummyCurlingStones: CurlingStone[] = [];
            testPhysicsManager.init(dummyCurlingStones);

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
            let dummyCurlingStones: CurlingStone[] = [];
            testPhysicsManager.init(dummyCurlingStones);

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

    describe('sortStonesByDistance()', () => {
        it('should sort the array of stones by distance to the game rings.', done => {
            let dummyCurlingStones: CurlingStone[] = [];
            testPhysicsManager.init(dummyCurlingStones);

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

    describe('getVelocityToPosition()', () => {
        it('should get the initial velocity of a stone to get to the center of the rings.', done => {
            let finalPosition = new THREE.Vector3(0, 0, 40.37);
            let finalVelocityZ = 0;

            // Clockwise spin
            let spin = SpinOrientation.CLOCKWISE;
            let initialVelocity = testPhysicsManager.getVelocityToPosition(finalPosition, finalVelocityZ, spin);

            let min = new THREE.Vector3(0.26, 0, 4.36);
            let max = new THREE.Vector3(0.27, 0, 4.37);

            expect(initialVelocity.x).to.be.at.least(min.x).and.at.most(max.x);
            expect(initialVelocity.y).to.be.at.least(min.y).and.at.most(max.y);
            expect(initialVelocity.z).to.be.at.least(min.z).and.at.most(max.z);

            // Counter-clockwise spin
            spin = SpinOrientation.COUNTER_CLOCKWISE;
            initialVelocity = testPhysicsManager.getVelocityToPosition(finalPosition, finalVelocityZ, spin);

            min = new THREE.Vector3(-0.27, 0, 4.36);
            max = new THREE.Vector3(-0.26, 0, 4.37);

            expect(initialVelocity.x).to.be.at.least(min.x).and.at.most(max.x);
            expect(initialVelocity.y).to.be.at.least(min.y).and.at.most(max.y);
            expect(initialVelocity.z).to.be.at.least(min.z).and.at.most(max.z);
            done();
        });

        it('should get the initial velocity of a stone to get to a position with a certain Z velocity.', done => {
            let finalPosition = new THREE.Vector3(-1, 0, 39.37);
            let finalVelocityZ = 1;

            // Clockwise spin when final x position is negative
            let spin = SpinOrientation.CLOCKWISE;
            let initialVelocity = testPhysicsManager.getVelocityToPosition(finalPosition, finalVelocityZ, spin);

            let min = new THREE.Vector3(0.12, 0, 4.41);
            let max = new THREE.Vector3(0.13, 0, 4.42);

            expect(initialVelocity.x).to.be.at.least(min.x).and.at.most(max.x);
            expect(initialVelocity.y).to.be.at.least(min.y).and.at.most(max.y);
            expect(initialVelocity.z).to.be.at.least(min.z).and.at.most(max.z);
            done();
        });

        it('should get the initial velocity of a stone to get to a position with a certain Z velocity.', done => {
            let finalPosition = new THREE.Vector3(1.8, 0, 40.37);
            let finalVelocityZ = 2;

            // Counter-clockwise spin when final x position is positive
            let spin = SpinOrientation.COUNTER_CLOCKWISE;
            let initialVelocity = testPhysicsManager.getVelocityToPosition(finalPosition, finalVelocityZ, spin);

            let min = new THREE.Vector3(-0.03, 0, 4.79);
            let max = new THREE.Vector3(-0.02, 0, 4.80);

            expect(initialVelocity.x).to.be.at.least(min.x).and.at.most(max.x);
            expect(initialVelocity.y).to.be.at.least(min.y).and.at.most(max.y);
            expect(initialVelocity.z).to.be.at.least(min.z).and.at.most(max.z);
            done();
        });
    });

    describe('getClosestTeamStoneInHouse()', () => {
        it('should return the closest player/ai stone.', done => {
            let dummyCurlingStones: CurlingStone[] = [];
            testPhysicsManager.init(dummyCurlingStones);

            let position1 = new THREE.Vector3(0, 0, 40.37);
            let position2 = new THREE.Vector3(0, 0, 39.97);
            let position3 = new THREE.Vector3(0, 0, 39.37);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position3));
            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position2));

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance();

            let closestPlayerStone = testPhysicsManager.getClosestTeamStoneInHouse(Team.Player);

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone.position.z).to.eql(position2.z);
            expect(closestPlayerStone.getTeam()).to.eql(Team.Player);
            done();
        });

        it('should return the closest player stone.', done => {
            let dummyCurlingStones: CurlingStone[] = [];
            testPhysicsManager.init(dummyCurlingStones);

            let position1 = new THREE.Vector3(0, 0, 40.37);
            let position2 = new THREE.Vector3(0, 0, 39.97);
            let position3 = new THREE.Vector3(0, 0, 39.37);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position3));
            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position2));

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance(new THREE.Vector3(0, 0, 0));

            let closestPlayerStone = testPhysicsManager.getClosestTeamStoneInHouse(Team.Player);

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone.position.z).to.eql(position1.z);
            expect(closestPlayerStone.getTeam()).to.eql(Team.Player);
            done();
        });

        it('should return undefined because there are no player stone in house.', done => {
            let dummyCurlingStones: CurlingStone[] = [];
            testPhysicsManager.init(dummyCurlingStones);

            let position1 = new THREE.Vector3(0, 0, 40.37);
            let position2 = new THREE.Vector3(0, 0, 39.97);
            let position3 = new THREE.Vector3(0, 0, 19.37);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position2));
            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position3));

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance(new THREE.Vector3(0, 0, 0));

            let closestPlayerStone = testPhysicsManager.getClosestTeamStoneInHouse(Team.Player);

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone).to.undefined;
            done();
        });

        it('should return undefined because there are no stone in house.', done => {
            let dummyCurlingStones: CurlingStone[] = [];
            testPhysicsManager.init(dummyCurlingStones);

            let position1 = new THREE.Vector3(0, 0, 21.37);
            let position2 = new THREE.Vector3(0, 0, 9.97);
            let position3 = new THREE.Vector3(0, 0, 19.37);
            let velocity = new THREE.Vector3(0, 0, 0);

            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position1));
            testPhysicsManager.getStones().push(new CurlingStone(Team.AI, velocity, position2));
            testPhysicsManager.getStones().push(new CurlingStone(Team.Player, velocity, position3));

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance(new THREE.Vector3(0, 0, 0));

            let closestPlayerStone = testPhysicsManager.getClosestTeamStoneInHouse(Team.Player);

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone).to.undefined;
            done();
        });

        it('should return undefined because there are no stone in game.', done => {
            let dummyCurlingStones: CurlingStone[] = [];
            testPhysicsManager.init(dummyCurlingStones);

            // Sort stones relative to a center that is closer to the second stone.
            testPhysicsManager.sortStonesByDistance(new THREE.Vector3(0, 0, 0));

            let closestPlayerStone = testPhysicsManager.getClosestTeamStoneInHouse(Team.Player);

            // The closest stone (the second one) should now be the first in the array
            expect(closestPlayerStone).to.undefined;
            done();
        });
    });
});
