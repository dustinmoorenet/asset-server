var expect = require('expect.js'),
    Asset = require('../lib/asset');

describe('asset', function() {
  describe('fromUpload', function() {
    it('should import the upload structure from express.multipart()', function() {
      var upload = {
        name: 'movie.mov',
        size: 1024,
        type: 'application/mov'
      };

      var asset = Asset.fromUpload(upload);

      expect(asset.label).to.be(upload.name);
      expect(asset.original_name).to.be(upload.name);
      expect(asset.mime_type).to.be(upload.type);
      expect(asset.size).to.be(upload.size);
    });

    it('should import a new file upload into an existing asset', function() {
      var upload = {
        name: 'movie.mov',
        size: 1024,
        type: 'application/mov'
      };

      var asset = Asset.fromUpload(upload);

      upload.name = asset.id;
      asset.label = 'My First Movie';
      var original_name = asset.original_name;

      Asset.fromUpload(upload, asset);

      // preserve label of existing asset
      expect(asset.label).to.be('My First Movie');

      expect(asset.original_name).to.be(original_name);
    });
  });
});
