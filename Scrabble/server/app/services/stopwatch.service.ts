/**
 * stopwatch.service.ts - Calculates the time of Scrabble turn
 *
 * @authors Vincent Chassé, Mikaël Ferland
 * @adapted by Erica Bugden, Yawen Hou
 * @date 2017/02/05
 */

export class StopwatchService {
    // Each turn is at most 5 minutes
    private readonly MAX_TURN_LENGTH_SEC = 300;

    private minutes: number;
    private seconds: number;
    private totalSeconds: number;
    private stopwatch: any;

    constructor() {
        this.minutes = 0;
        this.seconds = 0;
        this.totalSeconds = 0;
    }

    public getMinutesLeft(): number { return Math.floor((this.MAX_TURN_LENGTH_SEC - this.getTotalTimeSeconds()) / 60); }
    public getSecondsLeft(): number { return (this.MAX_TURN_LENGTH_SEC - this.getTotalTimeSeconds()) % 60; }
    public getTotalTimeSeconds(): number { return 60 * this.minutes + this.seconds; }

    public start(): void {
        this.stopwatch = setInterval(() => {
            this.minutes = Math.floor(++this.totalSeconds / 60);
            this.seconds = this.totalSeconds - this.minutes * 60;
        }, 1000);
    }

    private stop(): void {
        clearInterval(this.stopwatch);
    }

    private reset(): void {
        this.totalSeconds = this.minutes = this.seconds = 0;
    }

    public restart(): void {
        this.stop();
        this.reset();
        this.start();
    }

    public isTurnOver(): boolean {
        return (this.totalSeconds >= this.MAX_TURN_LENGTH_SEC);
    }
}
