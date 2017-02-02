import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
    selector: 'chat-comp',
    template: `<head>
    <title>Socket.IO chat</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      .message-box { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      .message-box input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      .message-box button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
  </head>
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
            console.log(msg);
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user connect', (msg: string) => {
            console.log(msg);
            this.msgList.push(new Message(msg));
        });

        this.socket.on('user disconnect', (msg: string) => {
            console.log(msg);
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
