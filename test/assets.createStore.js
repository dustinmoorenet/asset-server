var uuid = require('node-uuid'),
    Q = require('q'),
    exec = require('../lib/child_process.extras').exec,
    expect = require('expect.js'),
    Assets = require('../lib/assets');

describe('assets.createStore()', function() {
  beforeEach(function() {
    var store = '/tmp/' + uuid.v4();

    this.assets = new Assets(store);

    return this.assets.init(true);
  });

  it('should repair store if something is missing', function() {

    var promise =
      exec('rm -rf ' + this.assets.root + '/assets')
      .then(function() { return this.assets.createStore(); }.bind(this))
      .then(function() { return this.assets.validate(); }.bind(this));

    return promise;
  });

  it('should not complain if everything is there', function() {

    var promise =
      this.assets.createStore()
      .then(function() { return this.assets.validate(); }.bind(this));

    return promise;
  });

  afterEach(function() {
    return exec('rm -rf ' + this.assets.root);
  });
});

