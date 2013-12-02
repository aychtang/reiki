/*jslint indent: 2 */
// var engine = require('engine.io');
var io = require('socket.io');
var Rx = require('rx');
var EventEmitter = require('events').EventEmitter;


// Pass in listento which will be an instance of httpserver or a port number
var Reiki = function(listenTo) {
  'use strict';
  // Map of event types and subject stream objects.
  // {Socket Event type : Rx.Subject}
  this.subjects = {};

  this.io = io.listen(listenTo);
  this._init(this.io);
  // Instantiate engine server depending on option.
  // if (options.server) {
  //   this.server = options.server;
  //   this.io = engine.attach(options.server);
  //   this._createConnectionStream(this.io);
  // }
  // else if (options.port) {
  //   this.io = engine.listen(options.port);
  //   this._createConnectionStream(this.io);
  // }
};

Reiki.prototype = Object.create({});

Reiki.prototype._init = function(io) {
  var that = this;
  io.on('connection', function(socket) {
    for (var subject in that.subjects) {
      that._addToEventStream(socket, subject);
    }
  });
};

Reiki.prototype._ensureEventStream = function(ev) {
  if (!this.subjects[ev]) {
    this.subjects[ev] = new Rx.Subject();
  }
  return this.subjects[ev];
};

Reiki.prototype.createEventStream = function(ev) {
  return this._ensureEventStream(ev);
};

Reiki.prototype._addToEventStream = function(socket, ev) {
  var newStream = Rx.Observable.fromEvent(socket, ev);
  newStream.subscribe(this._ensureEventStream(ev));
  return newStream;
};

// Doesn't work? wat.
Reiki.prototype.stop = function(callback) {
  try {
    this.io.server.close();
  }
  catch (e) {
    console.log(e);
  }
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
