import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PlayerManagerService{

    private nameValid: boolean;
    private name: string;
    private capacity: number; //CHANGE

    constructor(private http: Http) {
    }

    validateName(name: string) {
        this.http.post('http://localhost:3000/validatePlayerName', name).subscribe(res => {
            this.nameValid = (res.text() === "true");
        });
    }

    addPlayer() {
        this.http.post('http://localhost:3000/addPlayer', this.name).subscribe(res => {
            //Empty
        });
    }

    getName(): string {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }

    setCapacity(capacity: number) {
        this.capacity = capacity;
    }

    getCapacity() : number {
        return this.capacity;
    }

    isNameValid(): boolean {
        return this.nameValid;
    }
}
