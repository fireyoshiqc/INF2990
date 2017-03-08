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
            const newScore = new easyScore({ name: name, time: time });
            newScore.save();

        } else if (difficulty === "difficile") {
            const newScore = new hardScore({ name: name, time: time });
            newScore.save();

        } else {
            console.log("YOU DUN GOOFED");
        }

    }
}
