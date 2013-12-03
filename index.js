var io = require('socket.io');
var _ = require('underscore');
var Rx = require('rx');

// Pass in listento which will be an instance of httpserver or a port number.
// Same as expected socket.io listen arguments.
var Reiki = function(listenTo) {
  this.subjects = {};
  this.connectionsById = {};
  this.io = io.listen(listenTo);
  this._init(this.io);
};

Reiki.prototype = Object.create({});

Reiki.prototype._init = function(io) {
  var that = this;
  io.on('connection', function(socket) {
    _.each(that.subjects, function(subject, eventType) {
      that._addToEventStream(socket, eventType);
    });
  });
};

Reiki.prototype._getSocketById = function(id) {
  return this.connectionsById[id];
};

Reiki.prototype._addSocketById = function(socket, id) {
  return this.connectionsById[id] = socket;
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

// Create a new event type which adds socket data.
// Reiki.prototype._transformEvent = function(socket, ev) {
//   socket.on(ev, function(arg) {
//     socket.emit('reiki-' + ev, arg, socket.id);
//   });
// };

Reiki.prototype.stop = function(callback) {
  try {
    this.io.server.close();
  }
  catch (e) {
    console.log(e);
  }
};

module.exports = Reiki;


// Individual socket arg feature.
// - create map of sockets to their ids.
// - create custom event emitter with sockets.
// - create observable stream from this new event.
// - subscribe to new stream with subject object.

// - should work.
