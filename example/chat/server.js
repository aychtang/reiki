// Reiki Example.
var Reiki = require('../../index.js');
var r = new Reiki(8080);

var messageStream = r.createEventStream('newMessage');

messageStream.subscribe(function(data) {
	data.socket.broadcast.emit('newMessage', data.message);
});
