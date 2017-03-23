/**
 * board.component.spec.ts
 *
 * @authors Pierre To
 * @date 2017/02/21
 */

import { BoardComponent } from './board.component';
import { Http } from '@angular/http';

import { expect } from 'chai';

describe('BoardComponent', () => {
    let http: Http;
    let comp: BoardComponent = new BoardComponent(http);

    describe('Default constructor ', () => {
        it('should create component', done => {
            expect(comp).to.not.be.undefined;
            expect(comp).to.be.an.instanceOf(BoardComponent);
            done();
        });
    });

    describe('updateBoard()', () => {
        it('should place a word on the board', done => {
            let placeWordCommand = {row : 0, column : 0, orientation : "h", word : "bonjour"};
            comp.updateBoard(placeWordCommand);

            expect(comp.getBoard()[0][0].getTexture()).to.be.equal("../../assets/textures/letters/B.png");
            expect(comp.getBoard()[0][1].getTexture()).to.be.equal("../../assets/textures/letters/O.png");
            expect(comp.getBoard()[0][2].getTexture()).to.be.equal("../../assets/textures/letters/N.png");
            expect(comp.getBoard()[0][3].getTexture()).to.be.equal("../../assets/textures/letters/J.png");
            expect(comp.getBoard()[0][4].getTexture()).to.be.equal("../../assets/textures/letters/O.png");
            expect(comp.getBoard()[0][5].getTexture()).to.be.equal("../../assets/textures/letters/U.png");
            expect(comp.getBoard()[0][6].getTexture()).to.be.equal("../../assets/textures/letters/R.png");

            done();
        });

         it('should place a word with empty letters on the board', done => {
            let placeWordCommand2 = {row : 0, column : 0, orientation : "h", word : "bo---u-"};
            comp.updateBoard(placeWordCommand2);

            expect(comp.getBoard()[0][0].getTexture()).to.be.equal("../../assets/textures/letters/B.png");
            expect(comp.getBoard()[0][1].getTexture()).to.be.equal("../../assets/textures/letters/O.png");
            expect(comp.getBoard()[0][2].getTexture()).to.be.equal("../../assets/textures/board/Basic.png");
            expect(comp.getBoard()[0][3].getTexture()).to.be.equal("../../assets/textures/board/Basic.png");
            expect(comp.getBoard()[0][4].getTexture()).to.be.equal("../../assets/textures/board/Basic.png");
            expect(comp.getBoard()[0][5].getTexture()).to.be.equal("../../assets/textures/letters/U.png");
            expect(comp.getBoard()[0][6].getTexture()).to.be.equal("../../assets/textures/board/Basic.png");

            done();
         });

          it('should place a word with letters as JOKER on the board', done => {
            let placeWordCommand3 = {row : 0, column : 0, orientation : "h", word : "boNJour"};
            comp.updateBoard(placeWordCommand3);

            expect(comp.getBoard()[0][0].getTexture()).to.be.equal("../../assets/textures/letters/B.png");
            expect(comp.getBoard()[0][1].getTexture()).to.be.equal("../../assets/textures/letters/O.png");
            expect(comp.getBoard()[0][2].getTexture()).to.be.equal("../../assets/textures/letters/JOKER.png");
            expect(comp.getBoard()[0][3].getTexture()).to.be.equal("../../assets/textures/letters/JOKER.png");
            expect(comp.getBoard()[0][4].getTexture()).to.be.equal("../../assets/textures/letters/O.png");
            expect(comp.getBoard()[0][5].getTexture()).to.be.equal("../../assets/textures/letters/U.png");
            expect(comp.getBoard()[0][6].getTexture()).to.be.equal("../../assets/textures/letters/R.png");

            done();
          });
    });
});

