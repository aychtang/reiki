/*jslint indent: 2 */

var http = require('http');
var Reiki = require('./index.js');

var server = http.createServer(function() {
  'use strict';
  console.log('request logged');
});

var reikiServer = new Reiki({ server : server });

console.log('lsitening on port 8080');
reikiServer.listen(8080);
