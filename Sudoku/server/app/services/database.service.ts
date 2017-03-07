/**
 * database.service.ts - Handles database requests for highscores.
 *
 * @authors Félix Boulet
 * @date 2017/03/07
 */

import * as mongoose from 'mongoose';

export class DatabaseService {
    constructor() {
        (<any>mongoose).Promise = global.Promise;
    }

    connect() {
        //TODO: Dummy host, need a provider
        mongoose.connect("mongodb://localhost:7000").then(
            () => {
                //Connected successfully to database.
                console.log("Connected to database successfully.");
            },
            err => {
                //Could not connect to database.
                console.log("Error connecting to database!");
            });
    }
}
