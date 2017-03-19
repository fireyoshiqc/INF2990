/**
 * logger.service.spec.ts - Tests for the logging service (server-side dashboard)
 *
 * @authors Félix Boulet, Erica Bugden
 * @date 2017/03/18
 */

import { LoggerService } from './logger.service';
import { expect } from 'chai';

describe("LoggerService", () => {

    let testLoggerService: LoggerService;

    describe('constructor()', () => {

        it('should construct a logger service with an empty linked list of logs', done => {
            testLoggerService = new LoggerService();
            expect(testLoggerService).to.exist;
            expect(testLoggerService).to.be.an.instanceof(LoggerService);
            done();
        });

    });

    describe('getMaxLogSize()', () => {
        it('should return the maximum size of the logging linked list', done => {
            expect(testLoggerService.getMaxLogSize()).to.be.greaterThan(0);
            done();
        });
    });

    describe('logEvent()', () => {

        it('should take an event type and a description and add a formatted string to the linked list', done => {
            testLoggerService.logEvent("TEST", "This is a unit test.");
            expect(testLoggerService.getLog().length).to.be.greaterThan(0);
            done();
        });
        it('should remove the oldest event from the linked list when the maximum size is reached', done => {

            for (let i = 0; i < 100; i++) {
                testLoggerService.logEvent("TEST", "This is unit test " + i);
            }

            expect(testLoggerService.getLog().length).to.eql(testLoggerService.getMaxLogSize());
            // See previous test for logEvent().
            expect(testLoggerService.getLog()[0]).to.have.string('0').and.not.have.string('a');
            done();
        });
    });

    describe('getLog()', () => {

        it('should return an array made with the linked list', done => {
            expect(testLoggerService.getLog()).to.exist;
            expect(testLoggerService.getLog().length).to.be.greaterThan(0);
            done();
        });
    });

});
