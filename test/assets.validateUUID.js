var expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets', function() {
  describe('.validateUUID()', function() {
    it('should accept a valid UUID', function() {
      var uuid = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3';

      expect(Assets.validateUUID(uuid)).to.be(true);
    });

    it('should not accept an invalid UUID (directory)', function() {
      var uuid = '/var/some/directory';

      expect(Assets.validateUUID(uuid)).to.be(false);
    });

    it('should not accept an invalid UUID (too short)', function() {
      var uuid = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b';

      expect(Assets.validateUUID(uuid)).to.be(false);
    });

    it('should not accept an invalid UUID (too long)', function() {
      var uuid = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b33';

      expect(Assets.validateUUID(uuid)).to.be(false);
    });

    it('should not accept an invalid UUID (doubled)', function() {
      var uuid = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b38ee07a1f-599f-4ee9-b3c6-8cfce400f4b3';

      expect(Assets.validateUUID(uuid)).to.be(false);
    });
  });
});

