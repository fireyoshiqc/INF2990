/**
 * board.component.spec.ts
 *
 * @authors Pierre To
 * @date 2017/02/21
 */

import { BoardComponent } from './board.component';
import { Http } from '@angular/http';

import { expect } from 'chai';

describe('BoardComponent', function() {
    let http: Http;
    let comp: BoardComponent = new BoardComponent(http);

    it('should create component', () => {
        expect(comp).to.not.be.undefined;
        expect(comp).to.be.an.instanceOf(BoardComponent);
    });
});
