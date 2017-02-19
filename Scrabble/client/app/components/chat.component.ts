import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
    moduleId: module.id,
    selector: 'chat-comp',
    templateUrl: '/assets/templates/chat.component.html'
})
export class ChatComponent implements OnInit {
    socket: any;
    msg = new Message("");
    msgList = new Array<Message>();
    openWindow = window;
    attemptingToConnect = false;

    ngOnInit() {
        this.socket = io.connect('http://localhost:3000');

        this.socket.on("connect_error", () => {
            this.attemptingToConnect = true;
        });

        this.socket.on('message sent', (msg: string) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user connect', (msg: string) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user disconnect', (msg: string) => {
            this.attemptingToConnect = false;
            this.msgList.push(new Message(msg));
        });
    }

    onSubmit() {
        if (this.msg.message !== undefined && this.msg.message !== null) {
            if (this.msg.message.replace(/\s+/g, "") !== "") {
                //Remove all spaces as a test to prevent sending huge empty messages
                this.socket.emit('chat message', this.msg.message);
            }
        }
    }

    onResize(event: any){
      this.openWindow = window;

    }
}

export class Message {
    username = "";
    submessage = "";

    constructor(public message: string) {
        let split = message.split("~", 2);
        this.username = split[0];
        this.submessage = split[1];
    }
}
