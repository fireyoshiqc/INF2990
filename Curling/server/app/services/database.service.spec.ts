/**
 * database.service.spec.ts - Tests for the database service
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

import { DatabaseService } from './database.service';
import { expect } from 'chai';
import * as mongoose from 'mongoose';

describe("DatabaseService", () => {

    let testDatabase = new DatabaseService();

    describe('constructor()', () => {

        it('should construct a database service without connecting it', done => {
            expect(testDatabase).to.exist;
            expect(testDatabase).to.be.an.instanceof(DatabaseService);
            done();
        });

    });

    before((done) => {
        mongoose.connect("mongodb://factory24:curling@ds147900.mlab.com:47900/curlingscores", done);
    });

    describe('clear()', () => {

        it('should clear the database highscores', () => {
            return testDatabase.clearCollections().then(result => {
                expect(result).to.be.true;
            });
        });

        it('collections should be empty', () => {
            return testDatabase.getHighscores().then(() => {
                // Retrieve highscores a second time in case the first attempt fails
                return testDatabase.getHighscores().then(highscores => {
                    expect(highscores.easy.length).to.equal(0);
                    expect(highscores.hard.length).to.equal(0);
                });
            });
        });

    });

    describe('addHighscore()', () => {

        it('should add a score to the database', () => {
            return testDatabase.addHighscore("Test", 1, 0, "facile").then(result => {
                expect(result).to.be.true;
            });
        });

    });

    describe('getHighscores()', () => {

        it('easy collection should contain one data', () => {
            return testDatabase.getHighscores().then(() => {
                // Retrieve highscores a second time in case the first attempt fails
                return testDatabase.getHighscores().then(highscores => {
                    expect(highscores.easy.length).to.equal(1);

                    let easyScore1 = JSON.parse(JSON.stringify(highscores.easy[0]));

                    expect(easyScore1.name).to.be.equal("Test");
                    expect(easyScore1.playerScore).to.be.equal(1);
                    expect(easyScore1.aiScore).to.be.equal(0);
                });
            });
        });

    });

    describe('clear()', () => {

        it('should clear the database highscores', () => {
            return testDatabase.clearCollections().then(result => {
                expect(result).to.be.true;
            });
        });

        it('collections should be empty', () => {
            return testDatabase.getHighscores().then(() => {
                // Retrieve highscores a second time in case the first attempt fails
                return testDatabase.getHighscores().then(highscores => {
                    expect(highscores.easy.length).to.equal(0);
                    expect(highscores.hard.length).to.equal(0);
                });
            });
        });

    });

    describe('Add scores to test the ranking rules', () => {

        // Change playerScore and aiScore here to test ranking rules
        const P_NAMES = ["Emilio", "Louis", "Jean-Sebastien", "Dylan", "Mathieu", "Nicolas", "Michel"];
        const P_SCORE = [6, 6, 1, 2, 2, 2, 4];
        const A_SCORE = [3, 4, 0, 1, 0, 1, 2];

        for (let i = 0; i < P_NAMES.length; i++) {
            it('should add a scores to the database', () => {
                // AddHighscore (playerName, playerScore, aiScore)
                return testDatabase.addHighscore(P_NAMES[i], P_SCORE[i], A_SCORE[i], "facile")
                    .then(result => { expect(result).to.be.true; });
            });
        }

        it('easy collection should contain seven data', () => {
            return testDatabase.getHighscores().then(() => {
                // Retrieve highscores a second time in case the first attempt fails
                return testDatabase.getHighscores().then(highscores => {
                    expect(highscores.easy.length).to.equal(7);
                    expect(highscores.hard.length).to.equal(0);
                });
            });
        });

        it('should be ranked by descending order of player scores, '
            + 'by ascending order of ai scores if player scores are equal, '
            + 'by ascending order of added/updated time if player and ai scores are equal', () => {
                return testDatabase.getHighscores().then(() => {
                    // Retrieve highscores a second time in case the first attempt fails
                    return testDatabase.getHighscores().then(highscores => {
                        // Ranking
                        for (let i = 0; i < (P_NAMES.length - 1); i++) {
                            let currentScore = JSON.parse(JSON.stringify(highscores.easy[i]));
                            let nextScore = JSON.parse(JSON.stringify(highscores.easy[i + 1]));

                            // 1- By descending order of player score
                            expect(currentScore.playerScore).to.be.gte(nextScore.playerScore);

                            if (currentScore.playerScore === nextScore.playerScore) {
                                // 2- By ascending order of ai score
                                expect(currentScore.aiScore).to.be.lte(nextScore.aiScore);

                                if (currentScore.aiScore === nextScore.aiScore) {
                                    // 3- By ascending order of added/updated time
                                    expect(currentScore.createdAt).to.be.lt(nextScore.createdAt);
                                    expect(currentScore.updatedAt).to.be.lt(nextScore.updatedAt);
                                }
                            }
                        }
                    });
                });
            });

    });

    describe('reset database', () => {

        it('should clear the database highscores', () => {
            return testDatabase.clearCollections().then(result => {
                expect(result).to.be.true;
            });
        });

        it('collections should be empty', () => {
            return testDatabase.getHighscores().then(() => {
                // Retrieve highscores a second time in case the first attempt fails
                return testDatabase.getHighscores().then(highscores => {
                    expect(highscores.easy.length).to.equal(0);
                    expect(highscores.hard.length).to.equal(0);
                });
            });
        });

    });

});
