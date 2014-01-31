var uuid = require('node-uuid'),
    child_process = require('child_process'),
    expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets', function() {
  describe('fromUploads', function() {
    beforeEach(function() {
      var store = '/tmp/blah' + uuid.v4();

      this.assets = new Assets(store, true);
    });

    it('should import new file uploads into the assets instance', function() {
      var uploads = [
        {
          name: 'movie_1.mov',
          size: 1024,
          type: 'application/mov'
        },
        {

          name: 'movie_2.mov',
          size: 1024,
          type: 'application/mov'
        },
        {

          name: 'movie_3.mov',
          size: 1024,
          type: 'application/mov'
        },
        {

          name: 'movie_4.mov',
          size: 1024,
          type: 'application/mov'
        }
      ];

      this.assets.fromUpload(uploads);

      expect(false).to.be(true);
    });

    afterEach(function(done) {
      child_process.exec('rm -rf ' + this.assets.root, done);
    });
  });
});
