var uuid = require('./uuid'),
    Q = require('q'),
    fs = require('fs'),
    fs_stat = Q.denodeify(fs.stat),
    fs_readFile = Q.denodeify(fs.readFile),
    fs_writeFile = Q.denodeify(fs.writeFile),
    fs_rename = Q.denodeify(fs.rename),
    mkdirp = Q.denodeify(require('mkdirp')),
    Asset = require('./asset');

/**
 * An asset lookup library
 *
 * @param [string] store_directory The location of the assets
 */
function Assets(store_directory) {
  this.root = store_directory;
}

Assets.prototype = {
  /**
   * Get the asset with ID
   *
   * @param [string] id UUID of asset
   */
  get: function(id) {
    id = uuid.validate(id) && uuid.clean(id);

    if (!id)
      return null;

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

  /**
   * Put an asset into the store
   *
   * @param {Asset} asset Asset to store
   */
  put: function(asset) {
    var id = uuid.validate(asset.id) && uuid.clean(asset.id);

    if (!id)
      return;

    var path = this.root + '/' + this.pathFromUUID(id),
        meta = JSON.stringify(asset);

    var promise = mkdirp(path)
      .then(function() { return this.writeMeta(path, meta) }.bind(this))
      .then(function() { return this.writeData(path, asset.uri.location) }.bind(this));

    return promise;
  },

  post: function(asset) {
    var id = uuid.v4();
  },

  delete: function(id) {

  },

  /**
   * Write meta information for an asset
   * 
   * @param {string} path The asset location
   * @param {string} meta The json string of meta information
   */
  writeMeta: function(path, meta) {
    return fs_writeFile(path + '/meta.json', meta);
  },

  /**
   * Write data file for an asset
   * 
   * @param {string} path The asset location
   * @param {string} file Path to the file
   */
  writeData: function(path, file) {
    return fs_rename(file, path + '/data');
  },

  pathFromUUID: function(id) {
    return id.split('-').join('/');
  },

  init: function(force_create) {
    var promise = this.validate()
  
    if (force_create)
      promise = promise.fail(this.createStore.bind(this));
  
    return promise;
  },

  /**
   * Validate store in a usable state
   *
   * @return [bool] Returns true if store is usable
   */
  validate: function() {
    var root = this.root,
        promise = fs_stat(this.root + '/indexes')
                  .then(function() { return fs_stat(root + '/assets'); })
                  .then(function() { return fs_stat(root + '/assets/files'); })
                  .then(function() { return fs_stat(root + '/assets/.cache'); });

    return promise;
  },

  /**
   * Create the store directory
   */
  createStore: function() {
    var root = this.root,
        promise = mkdirp(this.root + '/indexes')
                  .then(function() { return mkdirp(root + '/assets/files'); })
                  .then(function() { return mkdirp(root + '/assets/.cache'); });

    return promise;
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
};

module.exports = Assets;
