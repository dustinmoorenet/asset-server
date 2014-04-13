var expect = require('expect.js'),
    uuid = require('../lib/uuid');

describe('uuid.validate()', function() {
  it('should accept a valid UUID', function() {
    var id = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b3';

    expect(uuid.validate(id)).to.be(true);
  });

  it('should not accept an invalid UUID (directory)', function() {
    var id = '/var/some/directory';

    expect(uuid.validate(id)).to.be(false);
  });

  it('should not accept an invalid UUID (too short)', function() {
    var id = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b';

    expect(uuid.validate(id)).to.be(false);
  });

  it('should not accept an invalid UUID (too long)', function() {
    var id = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b33';

    expect(uuid.validate(id)).to.be(false);
  });

  it('should not accept an invalid UUID (doubled)', function() {
    var id = '8ee07a1f-599f-4ee9-b3c6-8cfce400f4b38ee07a1f-599f-4ee9-b3c6-8cfce400f4b3';

    expect(uuid.validate(id)).to.be(false);
  });

  it('should not accept an invalid UUID (half zeros)', function() {
    var id = '8ee07a1f-599f-4ee9-0000-000000000000'

    expect(uuid.validate(id)).to.be(false);
  });

  it('should not accept an invalid UUID (full zeros)', function() {
    var id = '00000000-0000-0000-0000-000000000000'

    expect(uuid.validate(id)).to.be(false);
  });

  it('should not accept an invalid UUID (null)', function() {
    var id = null;

    expect(uuid.validate(id)).to.be(false);
  });

  it('should not accept an invalid UUID (undefined)', function() {
    expect(uuid.validate(undefined)).to.be(false);
  });
});
