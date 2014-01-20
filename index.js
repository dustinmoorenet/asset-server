#!/usr/bin/env node

var express = require('express'),
    package = require('./package.json'),
    program = require('commander'),
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

app.get(program.url + '/:id', function(req, res) {

  var asset = assets.get(req.params.id);
});

app.post(program.url, function(req, res) {
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
});

app.put(program.url + '/:id', function(req, res) {
  assets.put(req.params.id, file);
});

app.delete(program.url + '/:id', function(req, res) {
  assets.delete(req.params.id);
});

app.listen(3001);

console.log('Listening on port 3001');
