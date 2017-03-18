import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { RackComponent } from './rack.component';
import { BoardComponent, CommandPlaceWord } from './board.component';
import { SocketHandler } from '../modules/socketHandler.module';

//import { ChatComponent } from './chat.component';

@Component({
    moduleId: module.id,
    selector: 'game-comp',
    templateUrl: '/assets/templates/game.component.html'
})
export class GameComponent implements OnInit {
    socket: any;
    rackActive = false;
    @ViewChild(RackComponent) rackChild: RackComponent;
    @ViewChild(BoardComponent) boardChild: BoardComponent;

    ngOnInit() {
        this.socket = SocketHandler.requestSocket('http://localhost:3000');

        this.socket.on("wcPlaceWord", (command: CommandPlaceWord) => {
            this.boardChild.placeWord(command);
        });

        this.socket.on("wcUpdateRack", (letters: string[]) => {
            this.rackChild.updateRack(letters);
        });

        //TODO: GET LETTERS FROM STASH
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
