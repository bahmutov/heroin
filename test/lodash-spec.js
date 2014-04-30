var _ = require('lodash');
var heroin = require('..');

_.mixin({
  partialSome: heroin
});

var expect = require('expect.js');

describe('partial argument binding in _', function () {
  it('bind to _ if available', function () {
    expect(_).to.be.a('function');
  });

  it('binds to _', function () {
    expect(_.partialSome).to.be.a('function');
    expect(heroin).to.be.a('function');
    expect(heroin).to.equal(_.partialSome);
  });

  var add = function(a, b, c) {
    expect(a).to.equal(1);
    expect(b).to.equal(2);
    expect(c).to.equal(3);
    return a + b + c;
  };

  it('partial', function () {
    var addBound = _.partial(add, 1, 2);
    expect(addBound(3)).to.equal(6);
    expect(addBound.length).to.equal(0);
  });

  it('partial right', function () {
    var addBound = _.partialRight(add, 2, 3);
    expect(addBound(1)).to.equal(6);
    expect(addBound.length).to.equal(0);
  });

  it('binds some arguments', function () {
    var addBound = _.partialSome(add, {
      a: 1,
      c: 3
    });
    expect(addBound).to.be.a('function');
    expect(addBound(2)).to.equal(6);
  });
});
