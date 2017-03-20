import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SocketHandler } from '../modules/socketHandler.module';

export interface IPlayer {
    name: string;
    capacity: number;
}

@Injectable()
export class PlayerManagerService {

    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3000";
    private socket: any;
    private nameValid: boolean;
    private player = { name: "", capacity: 0 };

    constructor(private http: Http) {
        this.socket = SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);

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

    saveSocket() {
        SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);
    }
}
