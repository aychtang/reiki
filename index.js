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
  this.eventStreams = {};
  this.subjects = {};
  if (options.server) {
    this.server = options.server;
    this.io = engine.attach(options.server);
    this._createConnectionStream(this.io);
  }
  else if (options.port) {
    this.io = engine.listen(options.port);
    this._createConnectionStream(this.io);
  }
};

Reiki.prototype = Object.create({});

Reiki.prototype._createConnectionStream = function(server) {
  'use strict';
  var that = this;
  var eventEmitter = new EventEmitter();
  this.connectionStream = Rx.Observable.fromEvent(eventEmitter, 'connection');
  this.io.on('connection', function(socket) {
    for (var subject in that.subjects) {
      that._addToEventStream(socket, subject);
    }
    eventEmitter.emit('connection', socket);
  });
};

Reiki.prototype.stop = function(callback) {
  try {
    this.io.close();
  }
  catch (e) {
    console.log(e);
  }
};

Reiki.prototype.createEventStream = function(ev) {
  if (!this.subjects[ev]) {
    this.subjects[ev] = new Rx.Subject();
  }
  return this.subjects[ev];
};

Reiki.prototype._addToEventStream = function(socket, ev) {
  var newStream = Rx.Observable.fromEvent(socket, ev);
  if (!this.subjects[ev]) {
    this.subjects[ev] = new Rx.Subject();
  }
  newStream.subscribe(this.subjects[ev]);
  return newStream;
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
