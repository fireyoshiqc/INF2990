import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as io from 'socket.io-client';

export interface Player {
    name: string;
    capacity: number;
}

@Injectable()
export class PlayerManagerService {

    socket: any;
    private nameValid: boolean;
    private player = { name: "", capacity: 0 };

    constructor(private http: Http) {
        this.socket = io.connect('http://localhost:3000');

        this.socket.on('wcNameValidated', (validity: boolean) => {
            this.nameValid = validity;
        });
    }

    validateName(name: string) {
        this.socket.emit('cwValidateName', name);
    }

    addPlayer() {
        this.socket.emit('cwAddPlayer', this.player);
    }

    getName(): string {
        return this.player.name;
    }

    setName(name: string) {
        this.player.name = name;
    }

    setCapacity(capacity: number) {
        this.player.capacity = capacity;
    }

    getCapacity(): number {
        return this.player.capacity;
    }

    isNameValid(): boolean {
        return this.nameValid;
    }
}
