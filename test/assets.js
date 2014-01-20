var uuid = require('node-uuid'),
    child_process = require('child_process'),
    expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets', function() {
  beforeEach(function() {
    this.store = '/tmp/blah' + uuid.v4();
  });

  it('should complain if store is not there', function() {
    expect(function() {
      var assets = new Assets(this.store);

    }.bind(this)).to.throwException(Assets.InvalidStoreDirectory);
  });

  it('should create store if store is not there (force_create)', function(done) {
    expect(function() {
      var assets = new Assets(this.store, true);

      expect(assets.validate()).to.be(true);

      done();

    }.bind(this)).to.not.throwException();
  });

  it('should fix store structure if something is missing (force_create)', function(done) {
      var assets = new Assets(this.store, true);

      child_process.exec('rm -rf ' + assets.root + '/indexes', function() {
        expect(assets.validate()).to.be(false);

        var assets_2 = new Assets(assets.root, true);

        expect(assets.validate()).to.be(true);

        expect(assets_2.validate()).to.be(true);

        done();
      });

  });

  afterEach(function(done) {
    child_process.exec('rm -rf ' + this.store, done);
  });
});
