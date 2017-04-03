/**
 * highscores.service.ts
 *
 * @authors Yawen Hou et Pierre To
 * @date 2017/04/03
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HighscoresService {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3001";

    constructor(private http: Http) { }

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
