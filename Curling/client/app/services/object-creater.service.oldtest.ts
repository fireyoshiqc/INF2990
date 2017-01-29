import {ObjectCreaterService} from './object-creater.service'
import { assert, expect} from 'chai'
describe('ObjectCreaterService', function () {
    let service: ObjectCreaterService;

    beforeEach(() => {
        chai.config.includeStack = true;
    })

    beforeEach(() =>{
        service = new ObjectCreaterService();
    });

    it('should return a valid Object3D', done =>{
        service.createTeapot()
                .then(obj =>{
                    expect(obj).to.not.be.undefined.and.to.be.a('Object3D');
                })
                .catch(x => {
                    assert.fail(x);
                })
                .then(x => {
                    done();
                })
    });

    it('should return the first teapot with a number 0', done =>{
        service.createTeapot()
                .then(obj =>{
                    const regex = new RegExp(/^[a-zA-z]*(\d+)$/,"gi");
                    if (obj.name.search(regex) === -1){
                        done('Regex failed to obtain a match');
                    }
                    // Calling several time regex.exec(str) will advance
                    // the match group : we lose our match in this case.
                    // This is the perfect example of what is wrong with
                    // some JavaScript methods.
                    let match = regex.exec(obj.name);
                    let i = parseInt(match[1],10);
                    expect(i).to.be.a('number').and.to.equal(0);
                })
                .catch(x => {
                    done(x);
                })
                .then(x => {
                    done();
                })
    });

    it('should return a teapot with a scale of 1', done =>{
        service.createTeapot()
                .then(obj =>{
                    let expectedVector = new THREE.Vector3(1,1,1);
                    expect(obj.scale.clone()).to.deep.equal(expectedVector);
                    done();
                })
                .catch(x => {
                    done(x);
                })
    });

    it('should return a teapot with all user attributes', done =>{
        service.createTeapot()
                .then(obj =>{
                    let nVec = new THREE.Vector3(0,0,0);
                    expect(obj.userData).to.have.property('vie');
                    expect(obj.userData.vie as THREE.Vector3).to.deep.equal(nVec);

                    done();
                })
                .catch(x => {
                    done(x);
                });
    });

});

describe('A failure', () => {
    it('should always fail', done => {
        let x = expect(true).to.be.false;
        done();
    });

    // Comment the catch clause to see an ugly stacktrace :)
    it('should print an ugly stacktrace if we do not handle exceptions', done => {
        Promise.reject('Failed for unknown reasons.').then(x => {
            expect('Something that will never occur');
            done();
        })
        .catch(x => {
        
        });
    });
})