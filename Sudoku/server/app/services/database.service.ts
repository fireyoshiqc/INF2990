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
    constructor() {
        (<any>mongoose).Promise = global.Promise;
    }

    connect() {
        //TODO: Dummy host, need a provider
        mongoose.connect("mongodb://factory24:sudoku@ds125060.mlab.com:25060/sudokuscores").then(
            () => {
                //Connected successfully to database.
                console.log("Connected to database successfully.");
            },
            err => {
                //Could not connect to database.
                console.log("Error connecting to database!");
            });
    }

    addScore(name: string, time: number, difficulty: string) {
        if (difficulty === "facile") {
            // Check if user already has a saved score for easy sudoku
            easyScore.findOne({ name: name }, (err, score) => {
                // If user has beaten their previous best time update their score
                if (score && (score.time > time)) {
                    score.time = time;
                    score.save();  // TODO: Add error managing callback
                } else if (score === null) {
                    // If user never previously saved score then add entry
                    const newScore = new easyScore({ name: name, time: time });
                    newScore.save();
                }
            });
        } else if (difficulty === "difficile") {
            hardScore.findOne({ name: name }, (err, score) => {
                // Check if user already has a saved score for hard sudoku
                if (score && (score.time > time)) {
                    // If user has beaten their previous best time update their score
                    score.time = time;
                    score.save();  // TODO: Add error managing callback
                } else if (score === null) {
                    // If user never previously saved score then add entry
                    const newScore = new hardScore({ name: name, time: time });
                    newScore.save();
                }
            });
        } else {
            console.log("Invalid difficulty.");
        }

    }

    getHighscores(): JSON {
        let scoreJSON: any = {
            "easy": {},
            "hard": {}
        };

        easyScore.find({}).sort('time').limit(3).lean().exec((err, scores) => {
            console.log(JSON.stringify(scores));
            scoreJSON.easy = JSON.stringify(scores);
        });
        hardScore.find({}).sort('time').limit(3).lean().exec((err, scores) => {
            console.log(JSON.stringify(scores));
            scoreJSON.hard = JSON.stringify(scores);
        });

        console.log(<JSON>scoreJSON);
        return <JSON>scoreJSON;
    }
}
