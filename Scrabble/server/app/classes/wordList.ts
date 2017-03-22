/**
 * wordList.ts - keeps all the words already on the board
 *
 * @authors Yawen Hou, Vincent Chassé
 * @date 2017/03/21
 */

export interface IWord {
    row: number;
    column: number;
    orientation: string;
    word: string;
}

export class WordList {
    private exsitingWords: IWord[];
    private newWords: IWord[];

    constructor() {
        this.exsitingWords = [];
        this.newWords = [];
    }

    public updateNewWords(word: IWord): void {
        let index = this.exsitingWords.findIndex(listedWord => (
            listedWord.word === word.word &&
            listedWord.column === word.column &&
            listedWord.row === word.row &&
            listedWord.orientation === word.orientation
        ));

        if (index === -1) {
            this.newWords.push(word);
        }
    }

    public getNewWords(): IWord[] {
        return this.newWords;
    }

    // Pour les test
    public getExistingWords(): IWord[] {
        return this.exsitingWords;
    }

    public updateExistingWords(): void {
        this.newWords.forEach(newWord => {
            this.exsitingWords.push(newWord);
        });

        this.clearNewWords();
    }

    public clearNewWords() {
        this.newWords = [];
    }

}
