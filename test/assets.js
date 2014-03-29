var uuid = require('node-uuid'),
    Q = require('q'),
    exec = require('../lib/child_process.extras').exec,
    expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets.init()', function() {
  beforeEach(function() {
    this.store = '/tmp/blah' + uuid.v4();
  });

  it('should complain if store is not there', function() {
      var assets = new Assets(this.store);

      var promise = assets.init()
        .then(function() { throw new Error('should have validated false') }, function() { /* this is what we expected */ })
  });

  it('should create store if store is not there (force_create)', function() {
      var assets = new Assets(this.store);

      return assets.init(true);
  });

  it('should fix store structure if something is missing (force_create)', function() {
      var assets = new Assets(this.store);

      var promise = assets.init(true)
        .then(function() { return exec('rm -rf ' + assets.root + '/indexes'); })
        .then(function() { return assets.validate() })
        .then(
          function() { throw new Error('should have validated false') },
          function() { /* this is what we expected */ }
        )
        .then(function() {
          var assets_2 = new Assets(assets.root);

          var promise = assets_2.init(true)
            .then(function() { return assets.validate() })
            .then(function() { return assets_2.validate() });

          return promise;
        })

      return promise;
  });

  afterEach(function() {
    return exec('rm -rf ' + this.store);
  });
});
