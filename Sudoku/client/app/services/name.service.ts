import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class NameService {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3300";
    constructor(private http: Http) { }

    public validateName(name: string): Promise<boolean> {
        let validName = false;
        let postPromise = new Promise((resolve, reject) => {
            this.http.post(this.HOST_NAME + this.SERVER_PORT + '/api/validateName', { "name": name })
                .toPromise()
                .then(res => {
                    if (res.text() === "true") {
                        console.log("Added name '" + name + "' to server.");
                        validName = true;
                        resolve(true);
                    }
                    else {
                        console.log("The name is invalid or already exists!");
                        resolve(false);
                    }
                })
                .catch(() => { console.log("Could not send name to server."); resolve(false); });
            return validName;
        });
        return postPromise;
    }
}
