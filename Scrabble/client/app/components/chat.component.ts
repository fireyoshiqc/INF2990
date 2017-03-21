import { Component, OnInit } from '@angular/core';
import { SocketHandler } from '../modules/socketHandler.module';
import { Message, IMessageFromServer } from '../classes/message';

@Component({
    moduleId: module.id,
    selector: 'chat-comp',
    templateUrl: '/assets/templates/chat.component.html'
})

export class ChatComponent implements OnInit {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3000";
    private socket: any;
    private msgFromClient: string;
    private msgList = new Array<Message>();
    private openWindow = window;
    private attemptingToConnect = false;

    public ngOnInit() {
        this.socket = SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);
        console.log(this.socket);

        this.socket.on("connect_error", () => {
            this.attemptingToConnect = true;
        });

        this.socket.on('message sent', (msg: IMessageFromServer) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });

        this.socket.on('command sent', (msg: IMessageFromServer) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg, true));
        });

        this.socket.on('user connect', (msg: IMessageFromServer) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user disconnect', (msg: IMessageFromServer) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });
    }

    public onSubmit() {
        if (this.msgFromClient !== undefined && this.msgFromClient !== null) {
            if (this.msgFromClient.replace(/\s+/g, "") !== "") {
                // Remove all spaces as a test to prevent sending huge empty messages
                this.socket.emit('chat message', this.msgFromClient);
            }
        }
    }

    public onResize(event: any) {
        this.openWindow = window;

    }

    public keyboardInput(event: KeyboardEvent) {
        // TODO: gérer le input à partir d'ici
    }
}
