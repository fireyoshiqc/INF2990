import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
    selector: 'chat-comp',
    template: `
        <body>
            <table>
                <tr *ngFor="let msg of msgList; let i = index">
                    <td>
                        <div>
                            <strong>{{msg.username}} : </strong>{{msg.submessage}}
                        </div>
                    </td>
                </tr>
            </table>

            <form #messageForm="ngForm">
            <div class="message-box">
                <input type="text" autocomplete="off" class="form-control" id="message"
                [(ngModel)]="msg.message" name="message">
                <button type="submit" class="btn btn-default" (click)="onSubmit(); messageForm.reset()">
                Submit</button>
            </div>
            </form>
        </body>
    `,
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
