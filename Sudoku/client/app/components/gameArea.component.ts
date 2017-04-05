import { Component, ViewChild } from '@angular/core';
import { SudokuGridComponent } from './sudokuGrid.component';

@Component({
    selector: 'game-area',
    templateUrl: '/assets/templates/gameArea.component.html'
})
export class GameAreaComponent {
    private isDarkTheme = false;
     @ViewChild(SudokuGridComponent) private sudokuGridComponent: SudokuGridComponent;

    public toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
    }

    public showHighscores(): void {
        this.sudokuGridComponent.getSudokuService().getHighscores(true)
            .then((scores) => {
                if (scores !== undefined) {
                    // Pop the popup!
                    this.sudokuGridComponent.showHighscoresDialog(scores);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
