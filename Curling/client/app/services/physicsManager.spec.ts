import { PhysicsManager } from './physicsManager';
import { CurlingStone } from '../entities/curlingStone';

import { expect } from 'chai';

describe('PhysicsManager', () => {

    let testPhysicsManager : PhysicsManager;
    testPhysicsManager = new PhysicsManager();

    describe('Default constructor ', () => {
        it('should construct the PhysicsManager.', done => {
            testPhysicsManager = new PhysicsManager();
            expect(testPhysicsManager).to.not.be.undefined;
            expect(testPhysicsManager).to.be.an.instanceof(PhysicsManager);
            done();
        });
    });

    describe('addStone() and getSones() ', () => {
         it('should contains five instances of CurlingStone.', done => {
            for (let i = 0; i < 5; i++) {
                testPhysicsManager.addStone(new CurlingStone());
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

    // describe('update() ', () => {
    //     it ('should modify the direction of colliding curling stones.', done => {
    //         console.log(6);
    //         // Collision between 2 stones: stone1 goes down and stone2 goes up on z-axis
    //         let initialDirectionStone1 = new THREE.Vector3(0, 0, 1);
    //         let initialDirectionStone2 = new THREE.Vector3(0, 0, -1);
    //         let stone1 = new CurlingStone(initialDirectionStone1.clone(),
    //                                       new THREE.Vector3(0, 0, 0));
    //         let stone2 = new CurlingStone(initialDirectionStone2.clone(),
    //                                       new THREE.Vector3(0, 0, 0.1));

    //         //testPhysicsManager = new PhysicsManager();
    //         testPhysicsManager.addStone(stone1);
    //         testPhysicsManager.addStone(stone2);

    //         //let clock = new THREE.Clock;

    //         //for (let i = 0; i < 50; i++) {

    //             testPhysicsManager.update(1);
    //             console.log("5");
    //         //}
    //         //expect(clock.getDelta()).to.equal(0);
    //         expect(stone1.direction.x).to.not.equal(initialDirectionStone1.x);
    //         //expect(stone1.direction).to.not.equal(initialDirectionStone2);
    //         done();
    //     });
    // });
});
