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
        this.socket = this.saveSocket();

        this.socket.on('wcNameValidated', (validity: boolean) => {
            this.nameValid = validity;
        });
    }

    public validateName(name: string) {
        this.socket.emit('cwValidateName', name);
    }

    public addPlayer() {
        this.socket.emit('cwAddPlayer', this.player);
    }

    public getName(): string {
        return this.player.name;
    }

    public setName(name: string) {
        this.player.name = name;
    }

    public setCapacity(capacity: number) {
        this.player.capacity = capacity;
    }

    public getCapacity(): number {
        return this.player.capacity;
    }

    public isNameValid(): boolean {
        return this.nameValid;
    }

    private saveSocket(): any {
        return SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);
    }
}
