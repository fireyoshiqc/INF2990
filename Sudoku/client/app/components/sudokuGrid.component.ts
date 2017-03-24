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
        private inputService: InputService) { }

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

    public verifyPaste(event: any, entry: IEntryEvent): void {

        // Pick the field that's receiving the paste or drop
        let input = event.target;

        // Get what's being pasted or drag-and-dropped from the browser
        let pastedData: string;
        
        if (event.type === "drop") {
            pastedData = event.dataTransfer.getData("text/plain");

        } else {
            pastedData = event.clipboardData.getData("text/plain");
        }

        if (pastedData.length === 1 && pastedData.match(/[1-9]{1}/)) {

            input.value = pastedData;

            // Do as if a number key had been pressed, since the data matches the single digit 1-9
            let entryValidation = this.convertToValidation(entry, pastedData);

            if (!this.inputService.validate(entryValidation)) {
                this.inputService.putInvalidField(entry.inputField);
            }

            this.sudokuService.putEntry(entryValidation);

            if (this.sudokuService.isGridFull()) {
                this.validateSudoku();
            }

        } else {
            // Don't let the pasted value appear or do anything if it's not a single digit 1-9
            event.stopPropagation();
            event.preventDefault();
        }
    }

    private convertToValidation(entry: IEntryEvent, key?: string): IEntryValidation {
        // Check if it's a key passed by value instead of an event (in case of paste for example)
        return key === undefined ?
            {
                // Parse the keyEvent key value
                value: Number.parseInt(entry.keyEvent.key),
                grid: this.sudokuService.inputGrid,
                row: entry.row, column: entry.column
            } :
            {
                // Just parse the value that's passed as a parameter
                value: Number.parseInt(key),
                grid: this.sudokuService.inputGrid,
                row: entry.row, column: entry.column
            };
    }

    public putEntry(entry: IEntryEvent) {

        let entryValidation = this.convertToValidation(entry);

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

interface IEntryValidation {
    value: number;
    grid: any;
    row: number;
    column: number;
}
