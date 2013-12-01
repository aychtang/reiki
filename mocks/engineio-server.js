//jslint indent:2
'use strict';
var http = require('http');
var Reiki = require('../lib/index.js');

var server = function() {
  return http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('hello world');
    res.end('');
  });
};

var reiki = module.exports = new Reiki({server: server()});

//you should update this to include the stream api, for now I'll use
//the traditional calback style for the mock
reiki.server.on('connection', function(socket) {
  socket.on('echo', function(msg) {
    console.log('from the server ' , arguments);
    socket.send(msg);
  });
  socket.on('message', function() {
    console.log('triggered message, see ', arguments);
  });
});



