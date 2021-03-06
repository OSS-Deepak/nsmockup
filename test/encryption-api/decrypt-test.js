'use strict';

var should = require('should'),
    parallel = require('mocha.parallel'),
    nsmockup = require('../../');

/**
 * Test Suites
 */
describe('<Unit Test - Netsuite Encryption API>', function () {

    before(done => {
        nsmockup.init(done);
    });
    parallel('Encription API - nlapiDecrypt:', () => {
        let strFinal = 'nsmockup - Test your Suitescripts before deploying to NetSuite.';

        it('decrypt base64 to str', done => {
            let code = 'bnNtb2NrdXAgLSBUZXN0IHlvdXIgU3VpdGVzY3JpcHRzIGJlZm9yZSBkZXBsb3lpbmcgdG8gTmV0U3VpdGUu',
                algorithm = 'base64',
                str = nlapiDecrypt(code, algorithm);
            should(str).be.equal(strFinal);
            return done();
        });

        it('decrypt xor to str', done => {
            let code = 'BRYUBAYSHhVZRkUtDhYNSxwWHhdZOBAQHwAKCBcQGxEKSwccDQoLDkUdDhUVBBwQBQJZHwpZJQANOBAQHwBX',
                algorithm = 'xor',
                str = nlapiDecrypt(code, algorithm);
            should(str).be.equal(strFinal);
            return done();
        });

        it('decrypt aes to str', done => {
            let algorithm = 'aes',
                key = '128-bit',
            //code = nlapiEncrypt(strFinal, algorithm, key),
            //str = nlapiDecrypt(code, algorithm);
                str = nlapiDecrypt('opa', algorithm, key);
            //should(str).be.equal(strFinal);
            should(str).be.equal(null);
            return done();
        });

        it('decrypt missing str', done => {
            try {
                nlapiDecrypt();
                return done('missing str');
            } catch (e) {
                should(e).have.property('code', 'SSS_TYPE_STR_REQD');
                return done();
            }
        });

        it('decrypt missing algorithm', done => {
            try {
                nlapiDecrypt('opa');
                return done('missing algorithm');
            } catch (e) {
                should(e).have.property('code', 'SSS_TYPE_ALGORITHM_REQD');
                return done();
            }
        });

        it('decrypt invalid algorithm', done => {
            try {
                nlapiDecrypt('opa', 'des');
                return done('missing algorithm');
            } catch (e) {
                should(e).have.property('code', 'SSS_INVALID_ALGORITHM');
                return done();
            }
        });
    });
    after(done => {
        nsmockup.destroy(done);
    });
});
