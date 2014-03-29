var uuid = require('../lib/uuid'),
    Q = require('q'),
    exec = require('../lib/child_process.extras').exec,
    expect = require('expect.js'),
    Assets = require('../lib/assets'),
    Asset = require('../lib/asset'),
    fs = require('fs');

describe('assets.putMeta()', function() {
  beforeEach(function() {
    this.store = '/tmp/blah' + uuid.v4();

    this.fixture = {
      file: this.store + '/file'
    };

    this.assets = new Assets(this.store);

    return this.assets.init(true);
  });

  it('should create a directory where there was none', function() {
    var asset = new Asset({
      id: '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3',
      label: 'That File',
      original_name: 'file_1.txt',
      tags: [],
      uri: {
        type: 'file',
        location: ''
      }
    });

    var promise =
      this.assets.putMeta(asset)
      .then(function() {
        return Q.nfcall(fs.stat, this.store + '/8ee07a1f/599f/4ee9/b3c6/8cfce400f4b3');
      }.bind(this));

    return promise;
  });

  it('should save meta data to the asset directory', function() {
    var expected = {
      id: '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3',
      label: 'That File',
      original_name: 'file_1.txt',
      tags: [],
      uri: {
        type: 'file',
        location: ''
      }
    };

    var asset = new Asset(expected);

    var meta_file = this.store + '/8ee07a1f/599f/4ee9/b3c6/8cfce400f4b3/meta.json';

    var promise =
      this.assets.putMeta(asset)
      .then(function() { return Q.nfcall(fs.stat, meta_file) })
      .then(function() { return Q.nfcall(fs.readFile, meta_file) })
      .then(function(json) { expect(JSON.parse(json)).to.eql(expected); });

    return promise;
  });

  afterEach(function() {
    return exec('rm -rf ' + this.store);
  });
});
