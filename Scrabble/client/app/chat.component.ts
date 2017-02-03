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

    ngOnInit() {
        this.socket = io.connect('http://localhost:3000');

        this.socket.on('message sent', (msg: string) => {
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user connect', (msg: string) => {
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user disconnect', (msg: string) => {
            this.msgList.push(new Message(msg));
        });
    }

    onSubmit() {
        this.socket.emit('chat message', this.msg.message);
    }
}

export class Message {
    username: string;
    submessage: string;

    constructor(public message: string) {
        let split = message.split("~", 2);
        this.username = split[0];
        this.submessage = split[1];
    }
}
