/**
 * database.service.spec.ts - Tests for the database service
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

import { DatabaseService } from './database.service';
import { expect } from 'chai';

describe("DatabaseService", () => {

    let testDatabase: DatabaseService;

    describe('constructor()', () => {

        it('should construct a database service without connecting it', done => {
            testDatabase = new DatabaseService();
            expect(testDatabase).to.exist;
            expect(testDatabase).to.be.an.instanceof(DatabaseService);
            done();
        });

    });
});
