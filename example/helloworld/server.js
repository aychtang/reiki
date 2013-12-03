// Reiki Example.
var Reiki = require('../../index.js');
var r = new Reiki(8080);

// Create an event stream for all socket 'customMessage' events.
var messageStream = r.createEventStream('customMessage');

messageStream.subscribe(function(data) {
	console.log(data);
});
