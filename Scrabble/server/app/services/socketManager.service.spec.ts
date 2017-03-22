/**
 * socketManager.service.spec.ts
 *
 * @authors Pierre To et Mikael Ferland
 * @date 2017/03/22
 */

import { SocketManager } from './socketManager.service';
import * as http from 'http';

import { expect } from 'chai';

describe('SocketManager', () => {
    let http: http.Server;
    let socketManager = new SocketManager(http);

    describe('Default constructor ', () => {
        it('should construct a socketManager object.', done => {
            expect(socketManager).to.not.be.undefined;
            expect(socketManager).to.be.an.instanceOf(SocketManager);
            done();
        });
    });
});
