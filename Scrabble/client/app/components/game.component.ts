import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { RackComponent } from './rack.component';
import { BoardComponent, CommandPlaceWord } from './board.component';
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

    ngOnInit() {
        this.socket = SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);

        this.socket.on("wcPlaceWord", (command: CommandPlaceWord) => {
            this.boardChild.placeWord(command);
        });

        this.socket.on("wcUpdateRack", (letters: string[]) => {
            this.rackChild.updateRack(letters);
        });
    }

    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        console.log(event.key);
        if (event.key === "Tab") {
            this.rackActive = !this.rackActive;
        } else {
            if (this.rackActive) {
                this.rackChild.keyboardInput(event);
            } else {
                // this.chatChild.keyboardInput(event);
            }
        }
    }
}
