/**
 * stopwatch.service.ts - Calculates the time of sudoku game
 *
 * @authors Vincent Chassé, Mikaël Ferland
 * @date 2017/02/05
 */

import { Injectable } from '@angular/core';

@Injectable()
export class StopwatchService {
    private minutes = 0;
    private seconds = 0;
    private totalSeconds = 0;
    private stopwatch: any;
    private stopwatchIsVisible = true;

    public getMinutes(): number { return this.minutes; }
    public getSeconds(): number { return this.seconds; }
    public getTotalTimeSeconds(): number { return 60 * this.minutes + this.seconds; }
    public isVisible(): boolean { return this.stopwatchIsVisible; }

    public toggleVisibility() {
        this.stopwatchIsVisible = !this.stopwatchIsVisible;
    }

    private start() {
        this.stopwatch = setInterval(() => {
            this.minutes = Math.floor(++this.totalSeconds / 60);
            this.seconds = this.totalSeconds - this.minutes * 60;
        }, 1000);
    }

    public stop() {
        clearInterval(this.stopwatch);
    }

    private reset() {
        this.totalSeconds = this.minutes = this.seconds = 0;
    }

    public restart() {
        this.stop();
        this.reset();
        this.start();
    }
}
