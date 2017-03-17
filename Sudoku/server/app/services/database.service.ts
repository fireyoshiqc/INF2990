/**
 * database.service.ts - Handles database requests for highscores.
 *
 * @authors Félix Boulet, Erica Bugden
 * @date 2017/03/07
 */

import * as mongoose from 'mongoose';
import easyScore from '../models/easyScore.model';
import hardScore from '../models/hardScore.model';

export class DatabaseService {
    connection: any;
    constructor() {
        (<any>mongoose).Promise = global.Promise;
    }

    connect() {
        let self = this;
        mongoose.connect("mongodb://factory24:sudoku@ds125060.mlab.com:25060/sudokuscores").then(
            () => {
                //Connected successfully to database.
                console.log("Connected to database successfully.");
            },
            err => {
                //Could not connect to database.
                console.log("Error connecting to database!");
            });
        this.connection = mongoose.connection;
        this.connection.on('disconnected', () => {
            //Reconnect on timeout
            self.connect();
        });
    }

    addScore(name: string, time: number, difficulty: string): Promise<boolean> {
        let addPromise = new Promise((resolve, reject) => {
            if (difficulty === "facile") {
                // Check if user already has a saved score for easy sudoku
                easyScore.findOne({ name: name }, (err, score) => {
                    if (err) {
                        reject("Error adding score to database!");
                    }

                    // If user has beaten their previous best time update their score
                    if (score && (score.time > time)) {
                        score.time = time;
                        score.save();  // TODO: Add error managing callback
                        resolve(true);
                    } else if (score === null) {
                        // If user never previously saved score then add entry
                        const newScore = new easyScore({ name: name, time: time });
                        newScore.save();
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else if (difficulty === "difficile") {
                hardScore.findOne({ name: name }, (err, score) => {
                    if (err) {
                        reject("Error adding score to database!");
                    }

                    // Check if user already has a saved score for hard sudoku
                    if (score && (score.time > time)) {
                        // If user has beaten their previous best time update their score
                        score.time = time;
                        score.save();  // TODO: Add error managing callback
                        resolve(true);
                    } else if (score === null) {
                        // If user never previously saved score then add entry
                        const newScore = new hardScore({ name: name, time: time });
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

    getHighscores(): Promise<IHighscores> {
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
}

interface IHighscores {
    easy: Array<string>;
    hard: Array<string>;
}
