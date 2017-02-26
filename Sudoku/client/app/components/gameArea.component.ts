import { Component } from '@angular/core';

@Component({
    selector: 'game-area',
    templateUrl: '/assets/templates/gameArea.component.html'
})
export class GameAreaComponent {
    private isDarkTheme = false;

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }
 }
