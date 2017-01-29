import { expect } from 'chai';
//import { request } from 'chai-http';
//import { Application } from './app';

describe('A trivial test ', () => {
    it('should pass true equals true', done => {
        expect(true).to.equal(true);
        done();
    });
});

/*describe('baseRoute', () => {
	it('should be a string', () => {
		chai.request(Application).get('/')
		.then(res => {
			expect(res.body.message).to.eql('Hello world');
		});
	});
});*/
