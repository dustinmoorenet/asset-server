var expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets.readMeta()', function() {
  it('should read meta json file from path', function() {
    var expected = {
      id: '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3',
      label: 'That File',
      original_name: 'file.txt',
      tags: [],
      uri: {
        type: 'file',
        location: ''
      }
    };

    var promise = Assets.readMeta('test/fixtures')
      .then(function(meta) { expect(meta).to.eql(expected) });

    return promise;
  });
});
