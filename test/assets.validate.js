var uuid = require('node-uuid'),
    child_process = require('child_process'),
    expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets', function() {
  describe('.validate()', function() {
    beforeEach(function() {
      var store = '/tmp/' + uuid.v4();

      this.assets = new Assets(store, true);
    });

    it('should return false if something is missing', function(done) {

        child_process.exec('rm -rf ' + this.assets.root + '/assets', function() {
          expect(this.assets.validate()).to.be(false);

          done();
        }.bind(this));
    });

    it('should return true if everything is there', function() {

        expect(this.assets.validate()).to.be(true);
    });

    afterEach(function(done) {
      child_process.exec('rm -rf ' + this.assets.root, done);
    });
  });
});
