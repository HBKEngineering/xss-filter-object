var expect = require('chai').expect;
var ld = require('lodash');

describe('default:', function() {

    var xssFilter = require('../')();

    it('validate string', function () {
        var str = '<script>alert(\'123\')</script>';
        expect(xssFilter.sanitize(str)).to.equal('&lt;script>alert(\'123\')&lt;/script>');
    });

    it('validate array', function () {
        var arr = ['some', 'valid', 'chars'];
        expect(xssFilter.sanitize(ld.clone(arr))).to.deep.equal(arr);
    });

    it('validate object', function () {
        var obj = { im: 'valid', nested: { obj: 'hi'}, yep: 123, date: new Date() },
            resObj = xssFilter.sanitize(ld.clone(obj));
        expect(resObj).to.deep.equal(obj);
        expect(resObj.im.obj).to.equal(obj.im.obj);
        expect(resObj.yep).to.equal(obj.yep);
        expect(resObj.date).to.be.instanceof(Date);
    });

    it('sanitize object', function () {
        var obj = { invalid: '<script>alert(123);</script>' };
        expect(xssFilter.sanitize(ld.clone(obj)).invalid).to.equal('&lt;script>alert(123);&lt;/script>');
    });

    it('pass other types', function () {
        var func = function () {};
        expect(xssFilter.sanitize(func)).to.be.instanceof(Function);
    });

});

// https://github.com/yahoo/xss-filters/wiki
describe('apply another filter:', function() {

    var xssFilter = require('../')({
        filters: ['inDoubleQuotedAttr']
    });

    it('convert double quoted only', function () {
        var str = '<script>alert("123")</script>';
        expect(xssFilter.sanitize(str)).to.equal('<script>alert(&quot;123&quot;)</script>');
    });

});
