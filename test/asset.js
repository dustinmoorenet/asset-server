var expect = require('expect.js'),
    Asset = require('../lib/asset');

describe('asset', function() {
  it('should create an Asset model', function() {
    var asset = new Asset({
      id: '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3',
      label: 'That Movie',
      original_name: 'movie.mov',
      size: 1024
    });

    expect(asset).to.be.an(Asset);

    expect(asset.id).to.have.length(36);
  });
});
