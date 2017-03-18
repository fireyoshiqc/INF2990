import { Component, AfterViewInit, HostListener } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';
import { StopwatchService } from '../services/stopwatch.service';
import { InputService } from '../services/input.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { NameDialogComponent } from './nameSelector.component';
import { HighscoresPopupComponent, HighscoresComponent } from './highscores.component';

@Component({
    selector: 'sudoku-grid',
    templateUrl: '/assets/templates/sudokuGrid.component.html',
    providers: [SudokuService, StopwatchService, InputService]
})
export class SudokuGridComponent implements AfterViewInit {
    private isDarkTheme = false;
    private nameDialogRef: MdDialogRef<NameDialogComponent>;
    private scoreDialogRef: MdDialogRef<HighscoresPopupComponent>;

    constructor(public dialog: MdDialog, private sudokuService: SudokuService,
        private stopwatchService: StopwatchService,
        private inputService: InputService) {
        this.sudokuService = sudokuService;
    }

    public ngAfterViewInit() {
        // Necessary to fix prodmode exclusive error (data binding changed on init)
        setTimeout(() => {
            this.nameDialogRef = this.dialog.open(NameDialogComponent, {
                disableClose: true
            });
            this.nameDialogRef.afterClosed().subscribe(result => {
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

    public getSudokuService() {
        return this.sudokuService;
    }

    public getEasySudoku() {
        this.stopwatchService.restart();
        this.sudokuService.getEasySudoku();
    }

    public getHardSudoku() {
        this.stopwatchService.restart();
        this.sudokuService.getHardSudoku();
    }

    public validateSudoku() {
        this.sudokuService.validateSudoku(() => {
            if (this.sudokuService.isValid) {
                this.stopwatchService.stop();
                this.sudokuService.addScore(this.stopwatchService.getTotalTimeSeconds())
                    .then((resolve) => {
                        if (resolve) {
                            this.sudokuService.getHighscores()
                                .then((scores) => {
                                    if (scores !== undefined) {
                                        // Pop the popup!
                                        this.showHighscoresDialog(scores);
                                    } else {
                                        // Don't pop the popup! Show a message to say you didn't get a highscore!
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

    public showHighscoresDialog(highscores: any) {
        setTimeout(() => {
            this.scoreDialogRef = this.dialog.open(HighscoresPopupComponent);
            (this.scoreDialogRef.componentInstance.dialogRef.componentInstance as HighscoresComponent)
                .highscores = { easy: highscores.easy, hard: highscores.hard };
        });
    }

    public resetSudoku() {
        document.forms['gridForm'].reset();
        this.sudokuService.resetSudoku();
        this.stopwatchService.restart();
    }

    public getStopwatchVisibility(): boolean {
        return this.stopwatchService.isVisible();
    }

    public toggleStopwatch() {
        this.stopwatchService.toggleVisibility();
    }

    public putEntry(entry: IEntryEvent) {

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
            entryValidation.grid = this.sudokuService.initialGrid;
            entryValidation.value = entry.keyEvent.keyCode;
            this.inputService.handleArrowKey(entryValidation, entry.inputField);
        }
        // 3- Number entered
        else if (this.inputService.isNumber(entry.keyEvent.key)) {
            // "!" permitted?
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

    public formatSelectedTableCell(input: HTMLInputElement) {
        this.inputService.formatSelectedTableCell(input);
    }

    public unformatSelectedTableCell(input: HTMLInputElement) {
        this.inputService.unformatSelectedTableCell(input);
    }

    public toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }

    @HostListener('window:beforeunload', ['$event'])
    public onBeforeUnload(event: any): any {
        this.sudokuService.quitGame();
        return;
    }
}

interface IEntryEvent {
    keyEvent: KeyboardEvent;
    inputField: HTMLInputElement;
    row: number;
    column: number;
}
