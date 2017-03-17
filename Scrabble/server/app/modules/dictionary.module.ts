/**
 * dictionary.module.ts
 *
 * @authors Vincent Chassé et Mikaël Ferland
 * @date 2017/03/17
 */

export module Dictionary {

    let wordList = require('../../dictionary.js') as string[];

    export function isWordValid(word: string): boolean {
        return wordList.indexOf(word.toUpperCase()) !== -1;
    }
}
