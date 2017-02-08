/**
 * stopwatch.service.ts - Calculates the time of sudoku game
 *
 * @authors Vincent Chassé, Mikaël Ferland
 * @date 2017/02/05
 */

import { Injectable } from '@angular/core';

@Injectable()
export class StopwatchService {
    minutes = 0;
    seconds = 0;
    totalSeconds = 0;
    stopwatch: any;
    // Question : where to declare stopwatchIsVisible, sudokuGrid.component or stopwatch.service?
    stopwatchIsVisible = true;

    getMinutes(): number { return this.minutes; }
    getSeconds(): number { return this.seconds; }
    isVisible(): boolean { return this.stopwatchIsVisible; }

    toggleVisibility() {
        this.stopwatchIsVisible = !this.stopwatchIsVisible;
    }

    start() {
        this.stopwatch = setInterval(() => {
            this.minutes = Math.floor(++this.totalSeconds / 60);
            this.seconds = this.totalSeconds - this.minutes * 60;
        }, 1000);
    }

    stop() {
        clearInterval(this.stopwatch);
    }

    reset() {
        this.totalSeconds = this.minutes = this.seconds = 0;
    }

    restart() {
        this.stop();
        this.reset();
        this.start();
    }
}
