var io = require('socket.io');
var _ = require('underscore');
var Rx = require('rx');

// Pass in listento which will be an instance of httpserver or a port number.
// Same as expected socket.io listen arguments.
var Reiki = function(listenTo) {
  this.subjects = {};
  this.socketsById = {};
  this.io = io.listen(listenTo);
  this._init(this.io);
};

Reiki.prototype = Object.create({});

Reiki.prototype._init = function(io) {
  var that = this;
  this.connectionStream = Rx.Observable.fromEvent(io, 'connection');
  this.connectionStream.subscribe(function(socket) {
    that._addConnectionById(socket);
    that.disconnectionStream = Rx.Observable.fromEvent(socket, 'disconnect');
    socket.on('disconnect', function() {
      that._removeConnectionById(socket.id);
    });
    _.each(that.subjects, function(subject, eventType) {
      that._addToEventStream(socket, eventType);
    });
  });
};

Reiki.prototype._addConnectionById = function(socket) {
  this.socketsById[socket.id] = socket;
};

Reiki.prototype._getConnectionById = function(id) {
  return this.socketsById[id] || undefined;
};

Reiki.prototype._removeConnectionById = function(id) {
  this.socketsById[id] = null;
  delete this.socketsById[id];
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

// Subscribes appropriate subject newStream to individual sockets event stream.
Reiki.prototype._addToEventStream = function(socket, ev) {
  var newStream = new Rx.Subject();

  socket.on(ev, function(data) {
    newStream.onNext({
      socket: socket,
      message: data
    });
  });

  newStream.subscribe(this._ensureEventStream(ev));

  return newStream;
};

Reiki.prototype.stop = function(callback) {
  try {
    _(this.socketsById).each(function(socket) {
      if (!socket.disconnected) {
        socket.disconnect();
      }
    });
    this.io.server.close();
  }
  catch (e) {
    console.log(e);
  }
};

module.exports = Reiki;
