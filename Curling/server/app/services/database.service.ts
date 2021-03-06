/**
 * database.service.ts - Handles database requests for highscores.
 * MLAB Username : factory24
 * MLAB Password : factoryDB24
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

import * as mongoose from 'mongoose';
import easyScore from '../models/easyScore.model';
import hardScore from '../models/hardScore.model';

export class DatabaseService {
    private readonly DUMMIES_PER_DIFFICULTY = 7;
    private readonly MAX_CONNECTION_ATTEMPTS = 30;
    private readonly MAX_SCORES_PER_DIFFICULTY = 7;
    private connectionAttempts = 0;

    constructor() {
        (<any>mongoose).Promise = global.Promise;
    }

    public connect(): void {
        let self = this;
        mongoose.connect("mongodb://factory24:curling@ds147900.mlab.com:47900/curlingscores").then(
            () => {
                // Connected successfully to database.
                this.addDummyScores();
                console.log("Connected to database successfully.");
            },
            err => {
                // Could not connect to database.
                console.log("Error connecting to database! Retrying...");
                self.connectionAttempts++;
                mongoose.disconnect();

                if (self.connectionAttempts < self.MAX_CONNECTION_ATTEMPTS) {
                    self.connect();
                } else {
                    console.log(this.MAX_CONNECTION_ATTEMPTS +
                        " attempts were made to connect without success! Disconnecting...");
                }
            });
    }

    public addHighscore(name: string, playerScore: number, aiScore: number, difficulty: string): Promise<boolean> {
        let addPromise = new Promise((resolve, reject) => {
            if (difficulty === "facile") {
                // Check if user already has a saved score for easy curling game
                easyScore.findOne({ name, playerScore, aiScore }, (err, document) => {
                    if (err) {
                        reject("Error adding easy score to database!");
                    }

                    // If user has the same player score and ai score, do nothing
                    if (document) {
                        resolve(true);
                    } else if (document === null) {
                        // If user has a new score then add entry
                        const newScore = new easyScore({ name, playerScore, aiScore });
                        newScore.save((errSave) => {
                            if (errSave) {
                                reject("Error saving easy score to database!");
                            }
                        });
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else if (difficulty === "difficile") {
                hardScore.findOne({ name, playerScore, aiScore }, (err, document) => {
                    if (err) {
                        reject("Error adding hard score to database!");
                    }

                    // If user has the same player score and ai score, do nothing
                    if (document) {
                        resolve(true);
                    } else if (document === null) {
                        // If user never previously saved score then add entry
                        const newScore = new hardScore({ name, playerScore, aiScore });
                        newScore.save((errSave) => {
                            if (errSave) {
                                reject("Error saving hard score to database!");
                            }
                        });
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
            easyScore
                .find({})
                .sort( { 'playerScore': -1 } ) // Sort playerScore in descending order
                .sort( { 'aiScore': 1 } ) // Then sort aiScore in ascending order
                .sort('updatedAt') // Then sort by last update
                .limit(this.MAX_SCORES_PER_DIFFICULTY)
                .lean().exec((err, scores) => {

                    if (err) {
                        reject("Error, could not get easy highscores!");
                    }
                    scoreJSON.easy = JSON.parse(JSON.stringify(scores));
                }).then(() => hardScore
                    .find({})
                    .sort( { 'playerScore': -1 } ) // Sort playerScore in descending order
                    .sort( { 'aiScore': 1 } ) // Then sort aiScore in ascending order
                    .sort('updatedAt') // Then sort by last update
                    .limit(this.MAX_SCORES_PER_DIFFICULTY)
                    .lean().exec((err, scores) => {

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
        const EASY_NAMES = ["Emilio", "Louis", "Jean-Sebastien", "Dylan", "Mathieu", "Nicolas", "Michel"];
        const HARD_NAMES = ["Mikael", "Vincent", "Erica", "Felix", "Pierre", "Yawen", "Dijkstra"];
        const AVG_HARD_PLAYER_SCORE = 1;
        const AVG_HARD_AI_SCORE = 0;

        // Dummy scores that tests the ranking rules
        this.addHighscore(EASY_NAMES[0], 6, 3, "facile");
        this.addHighscore(EASY_NAMES[1], 6, 4, "facile");
        this.addHighscore(EASY_NAMES[2], 1, 0, "facile");
        this.addHighscore(EASY_NAMES[3], 2, 1, "facile");
        this.addHighscore(EASY_NAMES[4], 2, 0, "facile");
        this.addHighscore(EASY_NAMES[5], 2, 1, "facile");
        this.addHighscore(EASY_NAMES[6], 4, 2, "facile");

        for (let j = 0; j < this.DUMMIES_PER_DIFFICULTY; j++) {
            this.addHighscore(HARD_NAMES[j], (AVG_HARD_PLAYER_SCORE + j), (AVG_HARD_AI_SCORE + j), "difficile");
        }
    }

    public clearCollections(): Promise<boolean> {
        easyScore.remove({}).then;
        hardScore.remove({});

        let clearPromise = new Promise((resolve, reject) => {
            easyScore.remove({}, (err) => {
                if (err) {
                    reject("Error, could not clear easy highscores!");
                }
            }).then(() => {
                hardScore.remove({}, (err) => {
                    if (err) {
                        reject("Error, could not clear hard highscores!");
                    }

                    resolve(true);
                });
            });
        });

        return clearPromise;
    }
}

interface IHighscores {
    easy: Array<string>;
    hard: Array<string>;
}
