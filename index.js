/*jslint indent: 2 */
var engine = require('engine.io');
var Rx = require('rx');
var EventEmitter = require('events').EventEmitter;
/*
* pass in options object which will contain instance of httpserver or a port 
* which shall be a number.
*/
var Reiki = function(options) {
  'use strict';
  // engine.io is an eventemitter so we create a stream around the connect
  if (options.server) {
    this.server = options.server;
    engine.attach(this.server);
    this._createConnectionStream(this.server);
  }
  else if (options.port) {
    this.server = engine.listen(options.port);
    this._createConnectionStream(this.server);
  }
  else {
    throw new Error('must include a valid port number or httpServer instance!');
  }
};

Reiki.prototype = Object.create({});

Reiki.prototype._createConnectionStream = function(server) {
  'use strict';
  var eventEmitter = new EventEmitter();
  this.connectionStream = Rx.Observable.fromEvent(eventEmitter, 'connection');
  this.server.on('connection', function(socket) {
    eventEmitter.emit('connection', socket);
  });
};

module.exports = Reiki;

// Public API
// createEventStream - creates an event stream for each socket.
// Save reference to stream as any new connections events must be added to stream.

// var r = new Reiki({
//   port: 8080
// });

// Use cases.
// var dcStream = r.createEventStream('disconnect');
// var messageStream = r.createEventStream('message');
// var users = {
//   'socket id': {
//     name: 'peter'
//   }
// };

// dcStream.subscribe(function(socket, event) {
//   users[socket.id] = null;
//   delete users[socket.id];
// });

// messageStream.subscribe(function(socket, data) {
//   socket.send('messageReceived', 'hello world');
// });
