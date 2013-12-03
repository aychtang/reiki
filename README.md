reiki
===

An Rx.js wrapper which provides a stream-like API for building applications
with socket.io.

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
