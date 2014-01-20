var uuid = require('node-uuid'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

/**
 * An asset lookup library
 *
 * @param [string] store_directory The location of the assets
 */
function Assets(store_directory, force_create) {
  this.root = store_directory;

  if (this.validate())
    return;

  if (force_create)
    this.createStore();
  else
    throw new Assets.InvalidStoreDirectory(this.root);
}

Assets.prototype = {
  get: function(id) {

  },

  put: function(id, asset) {

  },

  post: function(asset) {
    var id = uuid.v4;
  },

  delete: function(id) {

  },

  /**
   * Validate store in a usable state
   *
   * @return [bool] Returns true if store is usable
   */
  validate: function() {
    try {
      var stat = fs.statSync(this.root + '/indexes');

      if (!stat.isDirectory())
        return false;

      stat = fs.statSync(this.root + '/assets');

      if (!stat.isDirectory())
        return false;

      stat = fs.statSync(this.root + '/assets/files');

      if (!stat.isDirectory())
        return false;

      stat = fs.statSync(this.root + '/assets/.cache');

      if (!stat.isDirectory())
        return false;

    } catch (err) {
      return false;
    }

    return true;
  },

  /**
   * Create the store directory
   */
  createStore: function() {
    mkdirp.sync(this.root + '/indexes');
    mkdirp.sync(this.root + '/assets/files');
    mkdirp.sync(this.root + '/assets/.cache');
  }
}

/**
 * Error thrown when store is invalid
 *
 * @param [string] The store directory that is invalid
 */
Assets.InvalidStoreDirectory = function(directory) {
  this.name = 'Assets.InvalidStoreDirectory';
  this.value = directory
  this.message = 'is an invalid asset store directory';

  this.toString = function() {
    return this.value + ' ' + this.message;
  };
}

module.exports = Assets;
