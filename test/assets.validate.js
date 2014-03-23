var uuid = require('node-uuid'),
    Q = require('q'),
    child_process = require('child_process'),
    exec = Q.denodeify(child_process.exec),
    expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets.validate()', function() {
  beforeEach(function() {
    var store = '/tmp/' + uuid.v4();

    this.assets = new Assets(store, true);

    return this.assets.init(true);
  });

  it('should return false if something is missing', function() {

    var promise = exec('rm -rf ' + this.assets.root + '/assets')
      .then(function() { return this.assets.validate() }.bind(this))
      .then(function() { throw new Error('should have validated false') }, function() { /* this is what we expected */ });

    return promise;
  });

  it('should return true if everything is there', function() {

    return this.assets.validate();
  });

  afterEach(function() {
    return exec('rm -rf ' + this.assets.root);
  });
});
