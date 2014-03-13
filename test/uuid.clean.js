var expect = require('expect.js'),
    uuid = require('../lib/uuid');

describe('uuid', function() {
  var correct_id = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3'; 

  describe('.clean()', function() {
    it('cleans clean UUID', function() {
      var id = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3';

      expect(uuid.clean(id)).to.be(correct_id);
    });

    it('cleans upper cased UUID', function() {
      var id = '8EE07A1F-599F-4EE9-B3C6-8CFCE400F4B3';

      expect(uuid.clean(id)).to.be(correct_id);
    });

    it('cleans mixed cased UUID', function() {
      var id = '8Ee07A1F-599F-4Ee9-B3C6-8CfCE400F4B3';

      expect(uuid.clean(id)).to.be(correct_id);
    });
  });
});

