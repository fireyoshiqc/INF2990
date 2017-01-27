import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PostsService {
    constructor(private http: Http){
        console.log('PostsService Initialized...');
    }

    getPosts(){
        return this.http.get('localhost:3002/sudoku')
            .map(res => res.json());
    }
}
