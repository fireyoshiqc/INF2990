import { Component, HostListener, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { RackComponent } from './rack.component';
import { ChatComponent } from './chat.component';
import { BoardComponent, ICommandPlaceWord } from './board.component';
import { InfoComponent, ITurnInfo } from './info.component';
import { SocketHandler } from '../modules/socketHandler.module';
import { Router } from '@angular/router';
import { QuitGamePopupComponent } from './quitGame.component';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'game-comp',
    templateUrl: '/assets/templates/game.component.html'
})

export class GameComponent implements OnInit, AfterViewInit {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3200";
    private socket: any;
    private isDarkTheme = false;
    private dialogRef: MdDialogRef<QuitGamePopupComponent>;
    @ViewChild(RackComponent) private rackChild: RackComponent;
    @ViewChild(BoardComponent) private boardChild: BoardComponent;
    @ViewChild(InfoComponent) private infoChild: InfoComponent;
    @ViewChild(ChatComponent) private chatChild: ChatComponent;

    constructor(public router: Router, public dialog: MdDialog) { }

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

        // Redirect user to startPage if page was refreshed (see onBeforeUnload() function)
        if (localStorage.getItem("pageRefresh") === "true") {
            location.replace('/startPage');
            this.router.navigate(['/startPage']);
        }
    }

    public ngAfterViewInit(): void {
        if (this.socket) {
            this.socket.emit("cwGameCompLoaded", this.infoChild.getPlayer().getRoomID());
        }
    }

    @HostListener('window:keydown', ['$event'])
    public keyboardInput(event: KeyboardEvent): void {
        if (event.key === "Escape" && this.infoChild.isGameOver()) {
            this.quitGame();
        } else if (event.key === "Tab") {

            this.rackChild.toggleActiveState();
            this.chatChild.setActive(!this.rackChild.isActive());

            if (!this.rackChild.isActive()) {
                this.rackChild.deselectLetter();
            }

            event.preventDefault();
            event.stopPropagation();
        } else if (this.rackChild.isActive()) {
            this.rackChild.keyboardInput(event);
        }
    }

    public toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
    }

    public getTheme(): boolean {
        return this.isDarkTheme;
    }

    public disableRack(): void {
        if (this.rackChild.isActive()) {
            this.rackChild.toggleActiveState();
            this.rackChild.deselectLetter();
        }
    }

    // Disconnect user when he is refreshing the page
    @HostListener('window:beforeunload', ['$event'])
    public onBeforeUnload(event: any): any {
        this.socket.emit('disconnect');

        // Set refresh value to "true" in order to redirect user to startPage
        localStorage.setItem("pageRefresh", "true");
    }

    public quitGame(): void {
        // User confirmation popup
        this.dialogRef = this.dialog.open(QuitGamePopupComponent);

        // User confirmation response
        this.dialogRef.afterClosed().subscribe(confirmQuit => {
            if (confirmQuit) {
                this.socket.emit('cwLeaveRoom', {
                    roomID: this.infoChild.getPlayer().getRoomID(),
                    name: this.infoChild.getPlayer().getName()
                });

                // Reset room ID
                this.infoChild.getPlayer().setRoomID(-1);

                this.router.navigate(['/startPage']);
            }
        });
    }
}
