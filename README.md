reiki
===

An Rx.js wrapper which provides a stream-like API for building applications
with socket.io.

## Usage

Reiki helps simplify writing your socket io code by providing an observable stream-like interface.

### The Event Object

Functions that are subscribed to Reiki event streams will receive one argument which is an object containing two properties.

- socket: Socket instance.
- message: data sent from the client.

### Hello world

```js

var Reiki = require('../../index.js');
var r = new Reiki(8080);

// Create an event stream which sends out an event whenever any socket connected
// has received the newmessage event.
var messageStream = r.createEventStream('newMessage');

// Observe the message event stream and specify the function to be invoked.
messageStream.subscribe(function(data) {
	// Data contains a socket and message property.
	data.socket.broadcast.emit('newMessage', data.message);
});

```

## Documentation

### createEventStream(eventName)

Returns a subject event stream which broadcasts events for each independant socket connection.

```js

var r = new Reiki(8080);
var messageStream = r.createEventStream('messages');

messageStream.subscribe(function(message) {
	console.log(message);
});

```
