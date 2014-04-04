#!/usr/bin/env node

var express = require('express'),
    package = require('./package.json'),
    program = require('commander'),
    _ = require('underscore'),
    Assets = require('./lib/assets.js');


program
  .version(package.version)
  .option('-s, --store <store>', 'Location of storage')
  .option('-u, --url <url>', 'Base url', '/store')
  .parse(process.argv);


if (!program.store)
  program.help();

var assets = new Assets(program.store),
    app = express();

app.get(program.url + '/:id',
  /**
   * GET asset meta information
   *
   * @param {Object} req
   *   @prop {Object} params
   *   @prop {string} params.id The asset ID
   *
   * @returns {json} Meta information about asset
   */
  function(req, res) {

    assets
      .get(req.params.id)
      .done(function(asset) {
        res.json(asset);
      }, function() {
        res.json(404, {error: 'Asset not found'});
      });
  }
);

app.get(program.url + '/data/:id',
  /**
   * GET asset data
   *
   * @param {Object} req
   *   @prop {Object} params
   *   @prop {string} params.id The asset ID
   *
   * @returns {file|redirect} File associated with asset or redirect to server
   *                          that has the file
   */
  function(req, res) {
    assets
      .getData(req.params.id)
      .done(function(file) {
        res.download(file.path, file.name);
      }, function() {
        res.json(404, {error: 'Asset not found'});
      });
  }
);

app.post(program.url,
  [express.json(), express.multipart()],
  /**
   * POST asset meta information and data
   *
   * @param {Object} req
   *   @prop {Object} files Uploaded files
   *
   * @returns {json} Meta information about asset
   */
  function(req, res) {
    assets
      .fromUploads(req.files)
      .done(function() {
        res.send('');
      }, function(err) {
        res.send(500, {error: 'Upload failed', raw_error: err});
      });
  }
);

app.put(program.url + '/:id',
  [express.json(), express.multipart()],
  /**
   * PUT asset meta information
   *
   * @param {Object} req
   *   @prop {Object} params
   *   @prop {string} params.id The asset ID
   *   @prop {Object} files Uploaded files
   *
   * @returns {json} Meta information about asset
   */
  function(req, res) {
    assets.put(req.params.id, file);
  }
);

app.delete(program.url + '/:id',
  /**
   * DELETE asset
   *
   * @param {Object} req
   *   @prop {Object} params
   *   @prop {string} params.id The asset ID
   *
   * @returns {json} Meta information about asset
   */
  function(req, res) {
    assets.delete(req.params.id);
  }
);

assets
  .init(true)
  .then(function() {
    app.listen(3001);

    console.log('Listening on port 3001');
  });
