var uuid = require('../lib/uuid'),
    Q = require('q'),
    child_process = require('child_process'),
    exec = Q.denodeify(child_process.exec),
    expect = require('expect.js'),
    Assets = require('../lib/assets'),
    Asset = require('../lib/asset'),
    fs = require('fs');

describe('assets.putData()', function() {
  beforeEach(function() {
    this.store = '/tmp/blah' + uuid.v4();

    this.fixture = {
      file: this.store + '/file'
    };

    this.assets = new Assets(this.store);

    var promise = this.assets.init(true)
      .then(function() { return Q.nfcall(fs.stat, 'test/fixtures/file.txt') })
      .then(function() { return exec('cp test/fixtures/file.txt ' + this.fixture.file) }.bind(this))
      .then(function() { return Q.nfcall(fs.stat, this.fixture.file) }.bind(this));

    return promise;
  });

  it('should save the file to the asset directory', function() {
    var asset = new Asset({
      id: '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3',
      label: 'That File',
      original_name: 'file_1.txt',
      tags: [],
      uri: {
        type: 'file',
        location: this.fixture.file
      }
    });

    var data_file = this.store + '/8ee07a1f/599f/4ee9/b3c6/8cfce400f4b3/data';

    var promise =
      this.assets.putMeta(asset)
      .then(function() { return this.assets.putData(asset) }.bind(this))
      .then(function() { return Q.nfcall(fs.stat, data_file) })
      .then(function(stat) { expect(stat.size).to.be(10100) });

    return promise;
  });

  afterEach(function() {
    return exec('rm -rf ' + this.store);
  });
});