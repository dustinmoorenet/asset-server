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
   * Initialize the asset store
   *
   * @param {bool} force_create If true, create the store if not valid
   * 
   * @return {Promise} Returns a promise that will resolve once the store is
   *                   ready and valid
   */
  init: function(force_create) {
    var promise = this.validate()
  
    if (force_create)
      promise = promise.fail(this.createStore.bind(this));
  
    return promise;
  },

  /**
   * Get the asset with ID
   *
   * @param {string} id UUID of asset
   *
   * @return {Promise} Returns a promise based on the outcome of getting asset
   */
  get: function(id) {
    id = uuid.clean(id);

    if (!uuid.validate(id))
      return Q.reject(new Assets.InvalidAssetID(id));

    var asset = this.cache.get(id);

    if (asset) {
      return Q(asset);

    } else {
      var path = this.root + '/' + Assets.pathFromUUID(id);

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

  /**
   * Get the data for an asset from the store
   *
   * @param {string} id UUID of asset
   *
   * @return {Promise} Returns a promise based on the outcome of getting data
   */
  getData: function(id) {
    id = uuid.clean(id);

    if (!uuid.validate(id))
      return Q.reject(new Assets.InvalidAssetID(id));

    var path = this.root + '/' + Assets.pathFromUUID(id) + '/data';

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
   *
   * @return {Promise} Returns a promise based on the outcome of putting meta
   */
  putMeta: function(asset) {
    id = uuid.clean(asset.id);

    if (!uuid.validate(id))
      return Q.reject(new Assets.InvalidAssetID(id));

    asset.id = id;

    var path = this.root + '/' + Assets.pathFromUUID(id),
        meta = JSON.stringify(asset);

    var promise = mkdirp(path)
      .then(function() { return this.readMeta(path) }.bind(this))
      .catch(function() { return {} })
      .then(function(orig_meta) {

        for (var x in meta)
          orig_meta[x] = meta[x];
        
        return Assets.writeMeta(path, meta)
      }.bind(this));

    return promise;
  },

  /**
   * Put an asset into the store
   *
   * @param {string} id Asset ID
   *
   * @return {Promise} Returns a promise based on the outcome of putting data
   */
  putData: function(id, current_path) {
    id = uuid.clean(id);

    if (!uuid.validate(id))
      return Q.reject(new Assets.InvalidAssetID(id));

    var new_path = this.root + '/' + Assets.pathFromUUID(id);

    return Assets.writeData(new_path, current_path)
  },

  /**
   * Delete an asset from the store
   *
   * @param {string} id Asset ID
   *
   * @return {Promise} Returns a promise based on the outcome of deleting data
   */
  delete: function(id) {
    id = uuid.clean(id);

    if (!uuid.validate(id))
      return Q.reject(new Assets.InvalidAssetID(id));

    var path = this.root + '/' + Assets.pathFromUUID(id);

    return exec('rm -rf ' + path);
  },

  /**
   * Validate store in a usable state
   *
   * @return {Promise} Returns a promise that will resolve is store is usable
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
   *
   * @return {Promise} Returns a promise that will resolve once the store is
   *                   created
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
   *
   * @return {Promise} Returns a promise that will resolve once assets are
   *                   stored
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
              return this.putData(asset.id, upload.path);
            }.bind(this))

          return promise;
        }.bind(this));

      promises.push(promise);
    }.bind(this));

    return Q.all(promises);
  }
}

/**
 * Read meta from store
 *
 * @param {string} path The path to the asset directory
 *
 * @return {Promise} Returns a promise based on the outcome of reading meta
 */
Assets.readMeta = function(path) {
  var promise = fs_readFile(path + '/meta.json')
    .then(function(value) { return JSON.parse(value) });

  return promise;
};

/**
 * Write meta information for an asset
 * 
 * @param {string} path The asset location
 * @param {string} meta The json string of meta information
 *
 * @return {Promise} Returns a promise based on the outcome of writing meta
 */
Assets.writeMeta = function(path, meta) {
  return fs_writeFile(path + '/meta.json', meta);
},

/**
 * Write data file for an asset
 * 
 * @param {string} path The asset location
 * @param {string} file Path to the file
 *
 * @return {Promise} Returns a promise based on the outcome of writing data
 */
Assets.writeData = function(path, file) {
  return fs_rename(file, path + '/data');
},

/**
 * Convert UUID to path
 *
 * @param {string} id UUID to convert to path
 *
 * @return {string} Returns a path from the pieces of the UUID
 */
Assets.pathFromUUID = function(id) {
  return id.split('-').join('/');
},

/**
 * Error thrown when store is invalid
 *
 * @param {string} directory The store directory that is invalid
 */
Assets.InvalidStoreDirectory = function(directory) {
  this.name = 'Assets.InvalidStoreDirectory';
  this.value = directory;
  this.message = 'is an invalid asset store directory';

  this.toString = function() {
    return this.value + ' ' + this.message;
  };
};

/**
 * Error thrown when asset id is invalid
 *
 * @param {string} id The asset ID that is invalid
 */
Assets.InvalidAssetID = function(id) {
  this.name = 'Assets.InvalidAssetID';
  this.value = id;
  this.message = 'is an invalid asset ID';

  this.toString = function() {
    return '(' + this.value + ') ' + this.message;
  };
};

module.exports = Assets;
