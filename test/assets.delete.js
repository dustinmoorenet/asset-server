var uuid = require('../lib/uuid'),
    Q = require('q'),
    exec = require('../lib/child_process.extras').exec,
    expect = require('expect.js'),
    Assets = require('../lib/assets'),
    Asset = require('../lib/asset'),
    fs = require('fs');

describe('assets.delete()', function() {
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

  it('should remove the asset directory', function() {
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
      .then(function() { return this.assets.delete(asset) }.bind(this))
      .then(function() { return Q.nfcall(fs.stat, data_file) })
      .then(
        function() { throw new Error('asset should have been deleted') },
        function() { /* this is what we expected */ }
      );

    return promise;
  });

  it('should complain when UUID is blank', function() {
    var promise =
      this.assets.delete({id: ''})
      .then(
        function() { return Q.reject(new Error('should not try to delete with empty id')) },
        function() { /* this is what we expected */ }
      );

    return promise;
  });

  afterEach(function() {
    return exec('rm -rf ' + this.store);
  });
});
