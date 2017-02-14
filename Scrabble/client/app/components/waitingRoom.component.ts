import { Component, OnInit } from '@angular/core';
import { ChatComponent } from './chat.component';

@Component({
    moduleId: module.id,
    selector: 'waiting-room-comp',
    template: `
    <div class="flex-container" fxLayout="column" fxLayoutAlign="center center" fxFlexFill>
        <div class="flex-item" fxFlex="10%" fxFlexFill>
            <div id="header">
                <h1>Waiting Room</h1>
            </div>
        </div>
    </div>

    <div class="flex-item" fxFlex="80%" fxFlex.xs="80%" fxFlexFill>
        <chat-comp></chat-comp>
    </div>
    `
})
export class WaitingRoomComponent {
    
}