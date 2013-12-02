var io = require('socket.io');
var Rx = require('rx');

// Pass in listento which will be an instance of httpserver or a port number.
// Same as expected socket.io listen arguments.
var Reiki = function(listenTo) {
  // Map of event types and subject stream objects.
  // {Socket Event type : Rx.Subject}
  this.subjects = {};
  this.connections = [];
  this.io = io.listen(listenTo);
  this._init(this.io);
};

Reiki.prototype = Object.create({});

Reiki.prototype._init = function(io) {
  var that = this;
  io.on('connection', function(socket) {
    that.connections.push(socket);
    for (var subject in that.subjects) {
      that._addToEventStream(socket, subject);
    }
  });
};

// Creates a new Subject instance for each event type.
// The subject instance subscribes to each individual socket connections event stream
// and can be itself subscribed to as an observable stream by the end user.
Reiki.prototype._ensureEventStream = function(ev) {
  if (!this.subjects[ev]) {
    this.subjects[ev] = new Rx.Subject();
  }
  return this.subjects[ev];
};

Reiki.prototype.createEventStream = function(ev) {
  return this._ensureEventStream(ev);
};

// Subscribes appropriate subject stream to individual sockets event stream.
Reiki.prototype._addToEventStream = function(socket, ev) {
  var newStream = Rx.Observable.fromEvent(socket, ev);
  newStream.subscribe(this._ensureEventStream(ev));
  return newStream;
};

Reiki.prototype.stop = function(callback) {
  try {
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].disconnect();
    }
    this.io.server.close();
  }
  catch (e) {
    console.log(e);
  }
};

module.exports = Reiki;
