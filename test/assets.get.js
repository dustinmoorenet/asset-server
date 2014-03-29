var uuid = require('../lib/uuid'),
    Q = require('q'),
    exec = require('../lib/child_process.extras').exec,
    expect = require('expect.js'),
    Assets = require('../lib/assets'),
    Asset = require('../lib/asset'),
    fs = require('fs');

describe('assets.get()', function() {
  beforeEach(function() {
    this.store = '/tmp/blah' + uuid.v4();

    this.assets = new Assets(this.store);

    return this.assets.init(true);
  });

  it('should get the asset from an ID', function() {
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

    var promise =
      this.assets.putMeta(asset)
      .then(function() {
        return this.assets.get(expected.id)
      }.bind(this))
      .then(function(gotten_asset) {
        expect(gotten_asset.attributes).to.eql(asset.attributes);
      });

    return promise;
  });

  afterEach(function() {
    return exec('rm -rf ' + this.store);
  });
});
