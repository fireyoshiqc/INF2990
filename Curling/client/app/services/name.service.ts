/**
 * name.service.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/03/11
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class NameService {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3001";
    constructor(private http: Http) { }

    public validateName(name: string): Promise<boolean> {
        let validName = false;
        let postPromise = new Promise((resolve, reject) => {
            this.http.post(this.HOST_NAME + this.SERVER_PORT + "/api/validateName", { "name": name })
                .toPromise()
                .then(res => {
                    if (res.text() === "true") {
                        validName = true;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(() => { resolve(false); });
            return validName;
        });
        return postPromise;
    }
}
