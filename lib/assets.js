var uuid = require('node-uuid'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    Asset = require('../lib/asset');

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
  /**
   * Get the asset with ID
   *
   * @param [string] id UUID of asset
   */
  get: function(id) {
    var asset = this.cache.get(id);

    if (!asset) {
      var path = this.root + this.pathFromUUID(id);

      try {
        fs.statSync(path);
      } catch (err) {
        return null;
      }

      asset = require(path);

      this.cache.post(asset);
    }

    return asset;
  },

  put: function(asset) {
    var path = this.root + this.pathFromUUID(asset.id);

    mkdirp(path, function(err) {
      if (err)
        return;

      var meta = JSON.stringify(asset);

      // TODO how do we save files?
      // the file will be in a temp location?
      // or as a binary stream?
      // I feel like it should be able to save to a directory only once, so don't let express save to /tmp and have us move it, not fast enough...
    });
  },

  post: function(asset) {
    var id = uuid.v4;
  },

  delete: function(id) {

  },

  pathFromUUID: function(id) {
    return id.split('-').join('/');
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
  },

  /**
   * Import file uploads into store
   *
   * @param {array} uploads
   */
  fromUploads: function(uploads) {
    uploads.forEach(function(upload) {
      var asset = this.get(upload.name);

      asset = Asset.fromUpload(upload, asset);

      this.put(asset);
    }.bind(this));
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
