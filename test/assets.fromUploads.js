var uuid = require('node-uuid'),
    Q = require('q'),
    exec = require('../lib/child_process.extras').exec,
    expect = require('expect.js'),
    sinon = require('sinon'),
    Assets = require('../lib/assets');

describe('assets.fromUploads()', function() {
  beforeEach(function() {
    var store = '/tmp/blah' + uuid.v4();

    this.assets = new Assets(store);

    sinon.stub(this.assets, 'putMeta', function() { return Q('') });
    sinon.stub(this.assets, 'putData');

    return this.assets.init(true);
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

    var promise = this.assets.fromUploads(uploads)
    .then(function() {
      expect(this.assets.putMeta.callCount).to.be(4);
      expect(this.assets.putData.callCount).to.be(4);
    }.bind(this));

    return promise;
  });

  afterEach(function() {
    return exec('rm -rf ' + this.assets.root);
  });
});
