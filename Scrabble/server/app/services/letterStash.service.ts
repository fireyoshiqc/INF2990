/**
 * letterStash.service.ts
 *
 * @authors Vincent Chassé, Félix Boulet
 * @date 2017/03/19
 */

import { Letter } from '../classes/letter';

export class LetterStash {
    private stash: Array<Letter>;

    public constructor() {
        this.buildStash();
    }

    public getAmountLeft(): number {
        return this.stash.length;
    }

    public pickLetters(amount: number): Array<Letter> {
        let pickedLetters: Array<Letter> = [];
        if (this.stash.length < amount) {
            amount = this.stash.length;
        }
        while (amount-- > 0) {
            pickedLetters.push(this.pickRandomLetter());
        }

        return pickedLetters;
    }

    public exchangeLetters(toExchange: Array<string>): Array<Letter> {
        toExchange = toExchange.map(letter => {
            return letter === "*" ? "JOKER" : letter;
        });
        const lettersToGive = this.pickLetters(toExchange.length);
        this.stash = this.stash.concat(toExchange.map(char => new Letter(char)));
        return lettersToGive;
    }

    private pickRandomLetter(): Letter {
        const randomIndex = Math.floor(Math.random() * (this.stash.length - 1));
        return this.stash.splice(randomIndex, 1)[0];
    }

    private buildStash(): void {
        const buildString =
            "A".repeat(9) + "B".repeat(2) + "C".repeat(2) + "D".repeat(3) +
            "E".repeat(15) + "F".repeat(2) + "G".repeat(2) + "H".repeat(2) +
            "I".repeat(8) + "JK" + "L".repeat(5) + "M".repeat(3) +
            "N".repeat(6) + "O".repeat(6) + "P".repeat(2) + "Q" +
            "R".repeat(6) + "S".repeat(6) + "T".repeat(6) + "U".repeat(6) +
            "V".repeat(2) + "WXYZ";
        const letterArr = buildString.split('');
        this.stash = letterArr.map(char => new Letter(char));
        this.stash.push(new Letter("JOKER"));
        this.stash.push(new Letter("JOKER"));
    }
}

