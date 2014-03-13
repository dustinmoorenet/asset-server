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

  describe('.initialize()', function() {
    beforeEach(function() {
      this.asset_1 = new Asset({
        label: 'That Movie',
        original_name: 'movie1.mov',
        size: 1024
      });

      this.asset_2 = new Asset({
        label: 'That Other Movie',
        original_name: 'movie2.mov',
        size: 512 
      });
    });

    it('should have a unique tag array', function() {
      this.asset_1.tags.push('blah');

      expect(this.asset_2.tags).to.not.eql(['blah']);
      expect(this.asset_1.tags).not.to.be(this.asset_2.tags);
    });

    it('should have a unique uri object', function() {
      this.asset_1.uri.location = 'http://www.google.com';
      
      expect(this.asset_2.uri.location).not.to.be('http://www.google.com');
      expect(this.asset_1.uri).not.to.be(this.asset_2.uri);
    });
  });
});
