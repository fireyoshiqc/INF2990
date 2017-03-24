import { StopwatchService } from './stopwatch.service';
import { expect } from 'chai';

describe('StopwatchService', () => {

    let stopwatchService : StopwatchService = new StopwatchService();

    describe('Default constructor ', () => {
        it('should construct the StopwatchService.', done => {
            expect(stopwatchService).to.exist;
            expect(stopwatchService).to.be.an.instanceof(StopwatchService);
            done();
        });
    });

    describe('isTurnOver ', () => {
        it('should return false at the beginning of the stopwatch.', done => {
            expect(stopwatchService.isTurnOver()).to.be.false;
            done();
        });
    });
});
