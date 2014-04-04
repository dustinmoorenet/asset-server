var uuid = require('./uuid'),
    _ = require('underscore'),
    Q = require('q'),
    fs = require('fs'),
    fs_stat = Q.denodeify(fs.stat),
    fs_readFile = Q.denodeify(fs.readFile),
    fs_writeFile = Q.denodeify(fs.writeFile),
    fs_rename = Q.denodeify(fs.rename),
    fs_unlink = Q.denodeify(fs.unlink),
    exec = require('./child_process.extras').exec,
    mkdirp = Q.denodeify(require('mkdirp')),
    Asset = require('./asset');
    CacheStore = require('./cache_store');

/**
 * An asset lookup library
 *
 * @param [string] store_directory The location of the assets
 */
function Assets(store_directory) {
  this.root = store_directory;

  this.cache = new CacheStore();
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
      return Q.reject(new Error('Invalid asset ID, cannot get'));

    var asset = this.cache.get(id);

    if (asset) {
      return Q(asset);

    } else {
      var path = this.root + '/' + this.pathFromUUID(id);

      var promise =
        Assets.readMeta(path)
        .then(function(meta) {
          var asset = new Asset(meta);

          this.cache.post(asset);

          return asset;
        }.bind(this));

      return promise;
    }
  },

  getData: function(id) {
    id = uuid.validate(id) && uuid.clean(id);

    if (!id)
      return Q.reject(new Error('Invalid asset ID, cannot get data'));

    var path = this.root + '/' + this.pathFromUUID(id) + '/data';

    var promise =
      this.get(id)
      .then(function(asset) {
        return fs_stat(path).then(function() { return asset })
      })
      .then(function(asset) {
        return {path: path, name: asset.original_name};
      });

    return promise;
  },

  /**
   * Put an asset into the store
   *
   * @param {Asset} asset Asset to store
   */
  putMeta: function(asset) {
    var path = this.root + '/' + this.pathFromUUID(asset.id),
        meta = JSON.stringify(asset);

    var promise = mkdirp(path)
      .then(function() { return this.readMeta(path) }.bind(this))
      .catch(function() { return {} })
      .then(function(orig_meta) {

        for (var x in meta)
          orig_meta[x] = meta[x];
        
        return this.writeMeta(path, meta)
      }.bind(this));

    return promise;
  },

  /**
   * Put an asset into the store
   *
   * @param {Asset} asset Asset to store
   */
  putData: function(asset, current_path) {
    var new_path = this.root + '/' + this.pathFromUUID(asset.id);

    return this.writeData(new_path, current_path)
  },

  delete: function(asset) {
    var path = this.pathFromUUID(asset.id);

    if (path)
      return exec('rm -rf ' + this.root + '/' + path);
    else
      return Q.reject(new Error('Invalid ID, can not delete'));
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
    var promises = [];

    _.forEach(uploads, function(upload, id) {
      var promise =
        this.get(id)
        .fail(function() { /* asset is new */ })
        .then(function(asset) {
          return Asset.fromUpload(upload, asset);
        })
        .then(function(asset) { 
          var promise =
            this.putMeta(asset)
            .then(function() {
              return this.putData(asset, upload.path);
            }.bind(this))

          return promise;
        }.bind(this));

      promises.push(promise);
    }.bind(this));

    return Q.all(promises);
  }
}

Assets.readMeta = function(path) {
  var promise = fs_readFile(path + '/meta.json')
    .then(function(value) { return JSON.parse(value) });

  return promise;
};

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
