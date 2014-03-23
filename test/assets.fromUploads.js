var uuid = require('node-uuid'),
    Q = require('q'),
    child_process = require('child_process'),
    exec = Q.denodeify(child_process.exec),
    expect = require('expect.js'),
    sinon = require('sinon'),
    Assets = require('../lib/assets');

describe('assets.fromUploads()', function() {
  beforeEach(function() {
    var store = '/tmp/blah' + uuid.v4();

    this.assets = new Assets(store);

    sinon.stub(this.assets, 'put');

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

    this.assets.fromUploads(uploads);

    expect(this.assets.put.callCount).to.be(4);
  });

  afterEach(function() {
    return exec('rm -rf ' + this.assets.root);
  });
});
