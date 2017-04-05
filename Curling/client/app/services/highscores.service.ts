/**
 * highscores.service.ts
 *
 * @authors Yawen Hou et Pierre To
 * @date 2017/04/03
 */

import { IGameData, AIDifficulty } from './gameController.service';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HighscoresService {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3001";

    constructor(private http: Http) { }

    public addHighscore(playerName: string, gameData: IGameData, aiDifficulty: AIDifficulty): Promise<boolean> {
        // Transform enum to string for database
        let difficulty = (aiDifficulty === AIDifficulty.Normal) ? "facile" : "difficile";

        let postPromise = new Promise((resolve, reject) => {
            if (gameData.playerScore <= gameData.aiScore) {
                reject("addHighscore() can be called only if the player won (!= draw)");
            }

            this.http
                .put(this.HOST_NAME + this.SERVER_PORT + '/api/addHighscore',
                    { "name": playerName, "playerScore": gameData.playerScore,
                      "aiScore": gameData.aiScore, "difficulty": difficulty
                    })
                .toPromise()
                .then(res => resolve(res.json()))
                .catch((error) => reject());
        });
        return postPromise;
    }

    public getHighscores(): Promise<any> {
        let getPromise = new Promise((resolve, reject) => {
            this.http.get(this.HOST_NAME + this.SERVER_PORT + '/api/getHighscores').toPromise()
                .then(res => {
                    let highscores = res.json();

                    if (highscores.easy === undefined || highscores.hard === undefined) {
                        reject("Highscores request failed.");
                    }

                    resolve(highscores);
                })
                .catch(() => reject("Could not get highscores."));
        });

        return getPromise;
    }
}
