import { Component, OnInit } from '@angular/core';
import { SocketHandler } from '../modules/socketHandler.module';
import { Message, MessageFromServer } from '../classes/message';

@Component({
    moduleId: module.id,
    selector: 'chat-comp',
    templateUrl: '/assets/templates/chat.component.html'
})

export class ChatComponent implements OnInit {
    private readonly HOST_NAME = "http://" + window.location.hostname;
    private readonly SERVER_PORT = ":3000";
    socket: any;
    msgFromClient: string;
    msgList = new Array<Message>();
    openWindow = window;
    attemptingToConnect = false;

    ngOnInit() {
        this.socket = SocketHandler.requestSocket(this.HOST_NAME + this.SERVER_PORT);
        console.log(this.socket);

        this.socket.on("connect_error", () => {
            this.attemptingToConnect = true;
        });

        this.socket.on('message sent', (msg: MessageFromServer) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });

        this.socket.on('command sent', (msg: MessageFromServer) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg, true));
        });

        this.socket.on('user connect', (msg: MessageFromServer) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user disconnect', (msg: MessageFromServer) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });
    }

    onSubmit() {
        if (this.msgFromClient !== undefined && this.msgFromClient !== null) {
            if (this.msgFromClient.replace(/\s+/g, "") !== "") {
                //Remove all spaces as a test to prevent sending huge empty messages
                this.socket.emit('chat message', this.msgFromClient);
            }
        }
    }

    onResize(event: any) {
        this.openWindow = window;

    }

    keyboardInput(event: KeyboardEvent) {
        //TODO: gérer le input à partir d'ici
    }
}
