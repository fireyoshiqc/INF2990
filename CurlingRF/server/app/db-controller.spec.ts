import {DbController} from './db-controller';

import { expect} from 'chai';

describe('A Database Controller ', () => {
    it('should be created with an ID', done => {
        let expectedId = 42;
        let dbC = new DbController(expectedId);
        expect(dbC.getId()).to.equal(expectedId);
        done();
    });
});
