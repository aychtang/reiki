var Reiki = require('../../index.js');

var r = new Reiki(8080);
var messageStream = r.createEventStream('customMessage');

messageStream.subscribe(function(data) {
	console.log(data);
});
