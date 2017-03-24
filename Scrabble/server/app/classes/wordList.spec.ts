/**
 * wordList.spec.ts - tests for wordList
 *
 * @authors Yawen Hou, Vincent Chassé
 * @date 2017/03/21
 */

import { WordList } from './wordList';

import { expect } from 'chai';

describe('WordList', () => {

    let wordList = new WordList();
    let word1 = { row: 0, column: 1, orientation: 'h', word: 'maman' };
    let word2 = { row: 2, column: 4, orientation: 'v', word: 'maman' };
    let word3 = { row: 3, column: 3, orientation: 'v', word: 'famille' };
    let word4 = { row: 8, column: 8, orientation: 'h', word: 'casquette' };
    let word5 = { row: 11, column: 8, orientation: 'v', word: 'casquette' };
    let word6 = { row: 4, column: 10, orientation: 'h', word: 'amour' };

    describe('Default constructor', () => {
        it('should construct a ScrabbleGame object.', done => {
            expect(wordList).to.exist;
            expect(wordList).to.be.an.instanceOf(WordList);
            done();
        });
    });

    describe('updateNewWords', () => {
        it('should insert all the new words for the first time.', done => {
            wordList.updateNewWords(word1);
            expect(wordList.getNewWords().length).to.be.equal(1);
            expect(wordList.getNewWords()[0].column).to.be.equal(word1.column);

            wordList.updateNewWords(word2);
            expect(wordList.getNewWords().length).to.be.equal(2);
            expect(wordList.getNewWords()[1].column).to.be.equal(word2.column);

            wordList.updateNewWords(word3);
            expect(wordList.getNewWords().length).to.be.equal(3);
            expect(wordList.getNewWords()[2].column).to.be.equal(word3.column);

            wordList.updateNewWords(word4);
            expect(wordList.getNewWords().length).to.be.equal(4);
            expect(wordList.getNewWords()[3].column).to.be.equal(word4.column);
            done();
        });
    });

    describe('updateExistingWords', () => {
        it('should update the existingWordsList.', done => {
            wordList.updateExistingWords();

            expect(wordList.getExistingWords().length).to.be.equal(4);
            expect(wordList.getExistingWords()[0].column).to.be.equal(word1.column);
            expect(wordList.getExistingWords()[1].column).to.be.equal(word2.column);
            expect(wordList.getExistingWords()[2].column).to.be.equal(word3.column);
            expect(wordList.getExistingWords()[3].column).to.be.equal(word4.column);
            expect(wordList.getNewWords()).to.be.empty;
            done();
        });
    });

    describe('updateNewWords', () => {
        it('should only insert the new words.', done => {
            wordList.updateNewWords(word1);
            expect(wordList.getNewWords().length).to.be.empty;

            wordList.updateNewWords(word2);
            expect(wordList.getNewWords().length).to.be.empty;

            wordList.updateNewWords(word5);
            expect(wordList.getNewWords().length).to.be.equal(1);
            expect(wordList.getNewWords()[0].column).to.be.equal(word5.column);

            wordList.updateNewWords(word6);
            expect(wordList.getNewWords().length).to.be.equal(2);
            expect(wordList.getNewWords()[1].column).to.be.equal(word6.column);

            done();
        });
    });

    describe('updateExistingWords', () => {
        it('should update the existingWordsList after new insertions.', done => {
            wordList.updateExistingWords();

            expect(wordList.getExistingWords().length).to.be.equal(6);
            expect(wordList.getExistingWords()[4].column).to.be.equal(word5.column);
            expect(wordList.getExistingWords()[5].column).to.be.equal(word6.column);
            expect(wordList.getNewWords()).to.be.empty;
            done();
        });
    });

    describe('clearNewWords', () => {
        it('should empty the new words list.', done => {
            wordList.clearNewWords();

            expect(wordList.getNewWords()).to.be.empty;
            done();
        });
    });
});
