/**
 * nameSelector.component.spec.ts
 *
 * @authors Yawen Hou et Pierre To
 * @date 2017/03/11
 */

import { NameSelectorComponent } from './nameSelector.component';
import { NameService } from '../services/name.service';
import { Http } from '@angular/http';

import { expect } from 'chai';

describe('NameSelector', function() {
    let http: Http;
    let nameService = new NameService(http);
    let comp = new NameSelectorComponent(null, nameService);

    it('should create component', () => {
        expect(comp).to.not.be.undefined;
        expect(comp).to.be.an.instanceOf(NameSelectorComponent);
    });
});
