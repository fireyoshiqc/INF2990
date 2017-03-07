import { Component, HostListener, ViewChild } from '@angular/core';
import { RackComponent } from './rack.component';
//import { ChatComponent } from './chat.component';

@Component({
    moduleId: module.id,
    selector: 'game-comp',
    templateUrl: '/assets/templates/game.component.html'
})
export class GameComponent {

    rackActive = false;

    @ViewChild(RackComponent) rackChild: RackComponent;
    // TODO : comprendre pourquoi ça plante les tests
    // @ViewChild(ChatComponent) chatChild: ChatComponent;

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
