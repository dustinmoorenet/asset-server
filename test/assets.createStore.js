var uuid = require('node-uuid'),
    child_process = require('child_process'),
    expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets', function() {
  describe('.createStore()', function() {
    beforeEach(function() {
      var store = '/tmp/' + uuid.v4();

      this.assets = new Assets(store, true);
    });

    it('should repair store if something is missing', function(done) {

        child_process.exec('rm -rf ' + this.assets.root + '/assets', function() {
          this.assets.createStore();

          expect(this.assets.validate()).to.be(true);

          done();

        }.bind(this));
    });

    it('should not complain if everything is there', function() {

        expect(this.assets.createStore).to.not.throwException();
    });

    afterEach(function(done) {
      child_process.exec('rm -rf ' + this.assets.root, done);
    });
  });
});

