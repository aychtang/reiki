//jslint indent:2
var http = require('http');
var Reiki = require('../lib.index.js');

var server = http.createServer(function(req, res) {
  'use strict';
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('hello world');
  res.end('');
});

module.exports = new Reiki(server);


