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
    constructor(private http: Http) { }

    validateName(name: string): Promise<boolean> {
        let validName = false;
        let postPromise = new Promise((resolve, reject) => {
            this.http.post('http://localhost:3002/validateName', { "name": name })
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
