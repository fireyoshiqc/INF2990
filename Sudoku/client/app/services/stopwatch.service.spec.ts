import { StopwatchService } from './stopwatch.service';
import { expect } from 'chai';

describe('StopwatchService', () => {

    let stopwatchService : StopwatchService = new StopwatchService();

    describe('Default constructor ', () => {
        it('should construct the StopwatchService.', done => {
            expect(stopwatchService).to.not.be.undefined;
            expect(stopwatchService).to.be.an.instanceof(StopwatchService);
            done();
        });
    });

    describe('toggleVisibility() ', () => {
        it('should hide a visible timer.', done => {
            stopwatchService.toggleVisibility();
            expect(stopwatchService.isVisible()).to.be.false;
            done();
        });
        it('should reveal a hidden timer.', done => {
            stopwatchService.toggleVisibility();
            expect(stopwatchService.isVisible()).to.be.true;
            done();
        });
    });
});
