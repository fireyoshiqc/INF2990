import { Rink } from './rink';
import { expect } from 'chai';

describe('Rink', () => {

    describe('Default constructor ', () => {
        it('should construct a Rink object with string table passed in parameter.', done => {
            let path = "../assets/textures/sb_iceflow/iceflow_";
            let suffix = ".jpg";
            let imagesTable: Array<string> = [path + "lf" + suffix, path + "rt" +
                suffix, path + "up" + suffix, path + "dn" + suffix, path + "ft" + suffix, path + "bk"];
            let testRink = new Rink(imagesTable);
            expect(testRink).to.not.be.undefined;
            expect(testRink).to.be.an.instanceof(Rink);
            expect(testRink).to.be.an.instanceof(THREE.Group);
            done();
        });
    });
});
