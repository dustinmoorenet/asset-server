var uuid = require('node-uuid'),
    Assets = require('../lib/assets');

describe('assets', function() {

  var store = '/tmp/' + uuid.v4(),
      assets = new Assets(store, true);
/*
  describe('.get(id)', function() {
    it('should retrieve an asset when it exists', function() {
      var id = '12345678-1234-1234-1234-123456789012',
          file_original = fs.

      assets.put(file_original);

      var asset = assets.get(id);
    });

    it('should not retrieve an asset when it does not exist', function() {

    });
  });
*/
});
