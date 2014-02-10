var expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets', function() {
  var correct_uuid = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3'; 

  describe('.cleanUUID()', function() {
    it('cleans clean UUID', function() {
      var uuid = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3';

      expect(Assets.cleanUUID(uuid)).to.be(correct_uuid);
    });

    it('cleans upper cased UUID', function() {
      var uuid = '8EE07A1F-599F-4EE9-B3C6-8CFCE400F4B3';

      expect(Assets.cleanUUID(uuid)).to.be(correct_uuid);
    });

    it('cleans mixed cased UUID', function() {
      var uuid = '8Ee07A1F-599F-4Ee9-B3C6-8CfCE400F4B3';

      expect(Assets.cleanUUID(uuid)).to.be(correct_uuid);
    });
  });
});

