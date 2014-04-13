var uuid = require('../lib/uuid'),
    Q = require('q'),
    exec = require('../lib/child_process.extras').exec,
    expect = require('expect.js'),
    Assets = require('../lib/assets'),
    Asset = require('../lib/asset'),
    fs = require('fs'),
    stream = require('stream');

describe('assets.getData()', function() {
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

  it('should get the file from the asset directory', function() {
    var asset = new Asset({
      id: '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3',
      label: 'That File',
      original_name: 'file_1.txt',
      tags: []
    });

    var promise =
      this.assets.putMeta(asset)
      .then(function() { return this.assets.putData(asset.id, this.fixture.file) }.bind(this))
      .then(function() { return this.assets.getData(asset.id) }.bind(this))
      .then(function(file) {
        expect(file).to.eql({
          path: this.store + '/8ee07a1f/599f/4ee9/b3c6/8cfce400f4b3/data',
          name: 'file_1.txt'
        });
      }.bind(this));

    return promise;
  });

  it('should not get a file from the asset directory (invalid id)', function() {
    var promise =
      this.assets.getData('blah')
      .then(function() {
        throw new Error('ID is invalid and should not return success');
      }, function(err) {
        expect(err + '').to.be('(null) is an invalid asset ID');
      });

    return promise;
  });

  it('should not get a file from the asset directory (id not present)', function() {
    var id = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b1';

    var promise =
      this.assets.getData(id)
      .then(function() {
        throw new Error('ID is not present and should not return success');
      }, function(err) {
        expect(err.code).to.be('ENOENT');
      });

    return promise;
  });

  afterEach(function() {
    return exec('rm -rf ' + this.store);
  });
});
