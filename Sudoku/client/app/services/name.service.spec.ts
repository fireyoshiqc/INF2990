/**
 * name.service.spec.ts - Tests for name service (only the constructor)
 *
 * @authors Félix Boulet
 * @date 2017/03/06
 */

import { NameService } from './name.service';
import { expect } from 'chai';

describe('NameService', () => {

    let nameService: NameService;

    describe('constructor()', () => {

        it('should construct a NameService from an HTTP object', done => {
            nameService = new NameService(null);
            expect(nameService).to.exist;
            expect(nameService).to.be.an.instanceof(NameService);
            done();
        });

    });
});
