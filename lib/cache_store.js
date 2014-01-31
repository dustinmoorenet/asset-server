var fs = require('fs'),
    child_process = require('child_process'),
    mkdirp = require('mkdirp'),
    uuid = require('node-uuid');

/**
 * TODO finish this
 */
function CacheStore() {

}

CacheStore.prototype = {
  get: function(id) {
    return null;
  },

  put: function(id, asset) {

  },

  post: function(asset) {

  },

  delete: function(id) {

  },

  setup: function() {
    this.id = uuid.v4();

    this.root = '/mnt/' + this.id;

    mkdirp.sync(this.root);

    child_process.exec('mount -t tmpfs -o size=20m tmpfs ' + this.root);
  },

  tearDown: function() {
    child_process.exec('umount ' + this.root);

    child_process.exec('rm ' + this.root);
  }
};
