import { PhysicsManager } from './physicsManager';
import { CurlingStone, Team } from '../entities/curlingStone';

import { expect } from 'chai';

describe('PhysicsManager', () => {

    let testPhysicsManager: PhysicsManager;
    testPhysicsManager = new PhysicsManager();

    describe('Default constructor ', () => {
        it('should construct the PhysicsManager.', done => {
            testPhysicsManager = new PhysicsManager();
            expect(testPhysicsManager).to.not.be.undefined;
            expect(testPhysicsManager).to.be.an.instanceof(PhysicsManager);
            done();
        });
    });

    describe('addStone() and getStones() ', () => {
        it('should contains five instances of CurlingStone.', done => {
            for (let i = 0; i < 5; i++) {
                testPhysicsManager.addStone(new CurlingStone(Team.AI));
            }
            let testCurlingStones = testPhysicsManager.getStones();

            expect(testCurlingStones).to.not.be.empty;
            expect(testCurlingStones).to.have.lengthOf(5);
            testCurlingStones.forEach(testInstance => {
                expect(testInstance).to.be.an.instanceof(CurlingStone);
            });
            done();
        });
    });

    describe('update()', () => {
        it('should update the curling stone position according to its speed.', done => {
            testPhysicsManager.clearStones();
            testPhysicsManager.addStone(new CurlingStone(Team.AI, new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, 0)));

            //Tests 60 frames at 60 FPS, so 1 second.
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
            testPhysicsManager.addStone(stone1);
            testPhysicsManager.addStone(stone2);

            //Tests 60 frames at 60 FPS, so 1 second.
            for (let i = 0; i < 60; i++) {
                testPhysicsManager.update(1 / 60);
            }

            //A COLLISION SHOULD HAVE HAPPENED

            expect(testPhysicsManager.getStones()[0].velocity.z).to.be.below(0);
            expect(testPhysicsManager.getStones()[1].velocity.z).to.be.above(0);
            done();
        });
    });
});
