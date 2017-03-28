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
    private isDarkTheme = false;
    @ViewChild(RackComponent) private rackChild: RackComponent;
    @ViewChild(BoardComponent) private boardChild: BoardComponent;
    @ViewChild(InfoComponent) private infoChild: InfoComponent;

    public ngOnInit(): void {
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
    public keyboardInput(event: KeyboardEvent): void {
        if (event.key === "Tab") {
            this.rackActive = !this.rackActive;

            if (!this.rackActive) {
                this.rackChild.deselectLetter();
            }
        } else {
            if (this.rackActive) {
                this.rackChild.keyboardInput(event);
            }
        }
    }

    public toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
    }

    public getTheme(): boolean {
        return this.isDarkTheme;
    }

    public resetGame(): void {
        alert("reset");
    }
}
