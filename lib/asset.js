/**
 * An asset is an object that contains information about a file
 *
 * @attr [string] label
 * @attr [string] original_name
 * @attr [int] size
 * @attr [string] mime_type
 * @attr [array] tags
 * @attr [object] uri
 *  @attr [string] type The uri type (file, http, ...)
 *  @attr [string] location The location within the type
 */
var HumanModel = require('human-model'),
    _ = require('underscore'),
    uuid = require('node-uuid');

var Asset = HumanModel.define({
  type: 'asset',

  props: {
    id: {
      type: 'string',
      setOnce: true
    },
    label: ['string', true],
    original_name: ['string', true],
    size: ['int', true],
    mime_type: ['string'],
    tags: ['array'],
    uri: ['object', true, {type: 'file', location: ''}],
  },

  initialize: function() {
    if (!this.id)
      this.id = uuid.v4();

    if (!this.tags)
      this.tags = [];

    this.uri = _.clone(this.uri);
  }

});

/**
 * Import express.multipart() upload file to an Asset instance
 *
 * @param {Object} upload The file upload object
 * @param {Asset} [asset={}] The asset if the asset already exists
 *
 * @param {Asset} Returns the asset object with updated information
 */
Asset.fromUpload = function(upload, asset) {
  var obj = {
    label: asset ? asset.label : upload.name,
    original_name: asset ? asset.original_name : upload.name,
    mime_type: upload.type,
    size: upload.size
  };

  return asset ? asset.set(obj) : new Asset(obj);
};

module.exports = Asset;
