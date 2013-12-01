var Reiki = require('../index.js');
var eic = require('engine.io-client');
var test = require('tape');

test('Reiki works?', function(t) {
	var r = new Reiki({
  	port: 8080
	});
	r.connectionStream.subscribe(function(socket) {
		t.ok(socket);
		t.end();
	});
	var socket = eic('ws://localhost:8080');
});