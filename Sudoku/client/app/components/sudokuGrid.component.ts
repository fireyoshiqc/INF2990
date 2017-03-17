import { Component, AfterViewInit, HostListener } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';
import { StopwatchService } from '../services/stopwatch.service';
import { InputService } from '../services/input.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { NameDialogComponent } from './nameSelector.component';
import { HighscoresPopupComponent } from './highscores.component';

@Component({
    selector: 'sudoku-grid',
    templateUrl: '/assets/templates/sudokuGrid.component.html',
    providers: [SudokuService, StopwatchService, InputService]
})
export class SudokuGridComponent implements AfterViewInit {
    isDarkTheme = false;
    private dialogRef: MdDialogRef<any>;

    constructor(public dialog: MdDialog, private sudokuService: SudokuService,
        private stopwatchService: StopwatchService,
        private inputService: InputService) {
        this.sudokuService = sudokuService;
    }

    ngAfterViewInit() {
        // Necessary to fix prodmode exclusive error (data binding changed on init)
        setTimeout(() => {
            this.dialogRef = this.dialog.open(NameDialogComponent, {
                disableClose: true
            });
            this.dialogRef.afterClosed().subscribe(result => {
                if (result.difficulty === "facile") {
                    this.getEasySudoku();
                }
                else if (result.difficulty === "difficile") {
                    this.getHardSudoku();
                }
                this.sudokuService.difficulty = result.difficulty;
                this.sudokuService.playerName = result.playerName;
            });
        });

    }

    getSudokuService() {
        return this.sudokuService;
    }

    getEasySudoku() {
        this.stopwatchService.restart();
        this.sudokuService.getEasySudoku();
    }

    getHardSudoku() {
        this.stopwatchService.restart();
        this.sudokuService.getHardSudoku();
    }

    validateSudoku() {
        this.sudokuService.validateSudoku(() => {
            if (this.sudokuService.isValid) {
                this.stopwatchService.stop();
                this.sudokuService.addScore(this.stopwatchService.getTotalTimeSeconds())
                    .then((resolve) => {
                        if (resolve) {
                            console.log("L'ajout du score a marché!");
                            this.sudokuService.getHighscores()
                                .then((scores) => {
                                    if (scores !== undefined) {
                                        //Pop the popup!
                                        console.log("This should launch the popup!");
                                        alert("You'Re a dumbass!!!");
                                        this.showHighscoresDialog(scores);
                                    } else {
                                        // Don't pop the popup! Show a message to say you suck!
                                        console.log("YOU SUCK AT CODING");
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }
                    })
                    .catch((error) => console.log(error));
            }
        });
    }

    showHighscoresDialog(data: JSON) {
        setTimeout(() => {
            this.dialogRef = this.dialog.open(HighscoresPopupComponent, {});
            this.dialogRef.componentInstance.data = data;
        });
    }

    resetSudoku() {
        document.forms['gridForm'].reset();
        this.sudokuService.resetSudoku();
        this.stopwatchService.restart();
    }

    getStopwatchVisibility(): boolean {
        return this.stopwatchService.isVisible();
    }

    toggleStopwatch() {
        this.stopwatchService.toggleVisibility();
    }

    putEntry(entry: EntryEvent) {

        let entryValidation = {
            value: Number.parseInt(entry.keyEvent.key),
            grid: this.sudokuService.inputGrid,
            row: entry.row, column: entry.column
        };

        // 1- Delete/Backspace entered
        if (this.inputService.isDelete(entry.keyEvent)) {
            entryValidation.value = 0;
            this.inputService.removeInvalidField(entry.inputField);
            this.sudokuService.putEntry(entryValidation);
        }
        // 2- Arrow key entered
        else if (this.inputService.isArrowKey(entry.keyEvent)) {
            //alert(entry.inputField.parentElement.parentElement.parentElement.parentElement.parentElement.className);
            entryValidation.grid = this.sudokuService.initialGrid;
            entryValidation.value = entry.keyEvent.keyCode;
            this.inputService.handleArrowKey(entryValidation, entry.inputField);
        }
        // 3- Number entered
        else if (this.inputService.isNumber(entry.keyEvent.key)) {
            // "!" permis?
            if (!this.inputService.validate(entryValidation)) {
                this.inputService.putInvalidField(entry.inputField);
            }
            this.sudokuService.putEntry(entryValidation);
        }
        // 4- Invalid input
        else {
            entry.keyEvent.preventDefault();
        }

        if (this.sudokuService.isGridFull()) {
            this.validateSudoku();
        }
    }

    formatSelectedTableCell(input: HTMLInputElement) {
        this.inputService.formatSelectedTableCell(input);
    }

    unformatSelectedTableCell(input: HTMLInputElement) {
        this.inputService.unformatSelectedTableCell(input);
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event: any): any {
        this.sudokuService.quitGame();
        return;
    }
}

interface EntryEvent {
    keyEvent: KeyboardEvent;
    inputField: HTMLInputElement;
    row: number;
    column: number;
}
