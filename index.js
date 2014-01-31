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
    var asset = assets.get(req.params.id);

    if (asset)
      res.json(asset);
    else
      res.json(404, {error: 'Asset not found'});
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
    var asset = assets.get(req.params.id);

    if (asset)
      var uri = asset.uri;

      if (uri.type == 'file')
        res.download(uri.location, asset.original_name);
      else
        res.redirect(uri.location);
    else
      res.json(404, {error: 'Asset not found'});
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
    var finished_count = 0,
        file_names = Object.keys(req.files);
  
    file_names.forEach(function(file_name) {
  
      assets.post(req.files[file_name], function(err) {
        finished_count++;
        if (finished_count == file_names.length)
          res.send('');
      });
    });
  
    assets.post(file);
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

app.listen(3001);

console.log('Listening on port 3001');
