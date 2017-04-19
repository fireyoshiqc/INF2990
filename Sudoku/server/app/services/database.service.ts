/**
 * database.service.ts - Handles database requests for highscores.
 * MLAB Username : factory24
 * MLAB Password : factoryDB24
 * 
 * @authors Félix Boulet, Erica Bugden
 * @date 2017/03/07
 */

import * as mongoose from 'mongoose';
import easyScore from '../models/easyScore.model';
import hardScore from '../models/hardScore.model';

export class DatabaseService {
    private readonly DUMMIES_PER_DIFFICULTY = 3;
    private readonly MAX_RETRIES = 30;
    private tries = 0;
    constructor() {
        (<any>mongoose).Promise = global.Promise;
    }

    public connect(): void {
        let self = this;
        mongoose.connect("mongodb://factory24:sudoku@ds125060.mlab.com:25060/sudokuscores").then(
            () => {
                // Connected successfully to database.
                this.addDummyScores();
                console.log("Connected to database successfully.");
            },
            err => {
                // Could not connect to database.
                console.log("Error connecting to database! Retrying...");
                self.tries++;
                mongoose.disconnect();
                if (self.tries < self.MAX_RETRIES) {
                    self.connect();
                }
                else {
                    console.log(this.MAX_RETRIES + " attempts were made to connect without success! Disconnecting...");
                }
            });
    }

    public addScore(name: string, time: number, difficulty: string): Promise<boolean> {
        let addPromise = new Promise((resolve, reject) => {
            if (difficulty === "facile") {
                // Check if user already has a saved score for easy sudoku
                easyScore.findOne({ name }, (err, score) => {
                    if (err) {
                        reject("Error adding score to database!");
                    }

                    // If user has beaten their previous best time update their score
                    if (score && (score.time > time)) {
                        score.time = time;
                        score.save();
                        resolve(true);
                    } else if (score === null) {
                        // If user never previously saved score then add entry
                        const newScore = new easyScore({ name, time });
                        newScore.save();
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else if (difficulty === "difficile") {
                hardScore.findOne({ name }, (err, score) => {
                    if (err) {
                        reject("Error adding score to database!");
                    }

                    // Check if user already has a saved score for hard sudoku
                    if (score && (score.time > time)) {
                        // If user has beaten their previous best time update their score
                        score.time = time;
                        score.save();
                        resolve(true);
                    } else if (score === null) {
                        // If user never previously saved score then add entry
                        const newScore = new hardScore({ name, time });
                        newScore.save();
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                reject("Error, invalid difficulty! Did you hack the game?");
            }
        });
        return addPromise;
    }

    public getHighscores(): Promise<IHighscores> {
        let scoreJSON: IHighscores = { easy: [], hard: [] };
        let scorePromise = new Promise((resolve, reject) => {
            easyScore.find({}).sort('time').sort('updatedAt').limit(3).lean().exec((err, scores) => {
                if (err) {
                    reject("Error, could not get easy highscores!");
                }
                scoreJSON.easy = JSON.parse(JSON.stringify(scores));
            }).then(() => hardScore.find({}).sort('time').sort('updatedAt').limit(3).lean().exec((err, scores) => {
                if (err) {
                    reject("Error, could not get hard highscores!");
                }
                scoreJSON.hard = JSON.parse(JSON.stringify(scores));
                resolve(scoreJSON);
            }));
        });
        return scorePromise;
    }

    private addDummyScores(): void {
        const EASY_NAMES = ["Toto", "Snoop Dogg", "Michel Gagnon"];
        const HARD_NAMES = ["Doom Marine", "John Doe", "Joe Blo"];
        const AVG_EASY_TIME = 7 * 60;
        const AVG_HARD_TIME = 15 * 60;
        for (let i = 0; i < this.DUMMIES_PER_DIFFICULTY; i++) {
            this.addScore(EASY_NAMES[i], AVG_EASY_TIME + i, "facile");
        }
        for (let j = 0; j < this.DUMMIES_PER_DIFFICULTY; j++) {
            this.addScore(HARD_NAMES[j], AVG_HARD_TIME + j, "difficile");
        }

    }
}

interface IHighscores {
    easy: Array<string>;
    hard: Array<string>;
}
