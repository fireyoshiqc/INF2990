import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { RackComponent } from './rack.component';
import { BoardComponent, ICommandPlaceWord } from './board.component';
import { InfoComponent, ITurnInfo } from './info.component';
import { SocketHandler } from '../modules/socketHandler.module';

@Component({
    moduleId: module.id,
    selector: 'game-comp',
    templateUrl: '/assets/templates/game.component.html'
})

export class GameComponent implements OnInit {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3000";
    private socket: any;
    private rackActive = false;
    @ViewChild(RackComponent) private rackChild: RackComponent;
    @ViewChild(BoardComponent) private boardChild: BoardComponent;
    @ViewChild(InfoComponent) private infoChild: InfoComponent;

    public ngOnInit() {
        this.socket = SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);

        this.socket.on("wcUpdateBoard", (command: ICommandPlaceWord) => {
            this.boardChild.updateBoard(command);
        });

        this.socket.on("wcUpdateRack", (letters: string[]) => {
            this.rackChild.updateRack(letters);
        });

        this.socket.on("wcUpdateTurnInfo", (turnInfo: ITurnInfo) => {
            this.infoChild.updateTurnInfo(turnInfo);
        });

        this.socket.on("wcUpdateName", (name: string) => {
            this.infoChild.updateName(name);
        });
    }

    @HostListener('window:keydown', ['$event'])
    public keyboardInput(event: KeyboardEvent) {
        console.log(event.key);
        if (event.key === "Tab") {
            this.rackActive = !this.rackActive;
        } else {
            if (this.rackActive) {
                this.rackChild.keyboardInput(event);
            } else {
                // A changer: this.chatChild.keyboardInput(event);
            }
        }
    }
}
