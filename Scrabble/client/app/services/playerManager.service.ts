import { Injectable } from '@angular/core';
import { SocketHandler } from '../modules/socketHandler.module';
import { PlayerHandler } from '../modules/playerHandler.module';
import { Player } from '../classes/player';

@Injectable()
export class PlayerManagerService {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3000";
    private socket: any;
    private player: Player;
    private nameValid: boolean;

    constructor() {
        this.socket = this.saveSocket();
        this.player = PlayerHandler.requestPlayer();

        this.socket.on('wcNameValidated', (nameValid: boolean) => {
            this.nameValid = nameValid;
        });
    }

    public validateName(name: string): void {
        this.socket.emit('cwValidateName', name);
    }

    public getNameValid(): boolean {
        return this.nameValid;
    }

    public addPlayer(): void {
        this.socket.emit('cwAddPlayer', { name: this.player.getName(), capacity: this.player.getRoomCapacity() });
    }

    public joinRoom(): void {
        this.socket.emit('cwJoinRoom', { name: this.player.getName(), capacity: this.player.getRoomCapacity() });
    }

    private saveSocket(): any {
        return SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);
    }
}
