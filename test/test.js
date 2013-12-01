var Reiki = require('../index.js');
var eic = require('engine.io-client');
var test = require('tape');

test('Reiki works?', function(t) {
	t.plan(1);
	var r = new Reiki({
  	port: 8080
	});
	r.connectionStream.subscribe(function(socket) {
		t.ok(socket, ' connectionStream event has a socket');
		t.end();
	});
	var socket = eic('ws://localhost:8080');
});

test('Bi-direcitonal', function(t) {
	var r = new Reiki({
  	port: 8081
	});
	r.connectionStream.subscribe(function(socket) {
		socket.send('hello world');
	});

	var socket = eic('ws://localhost:8081');
	socket.onopen = function() {
		socket.onmessage = function(data) {
			t.ok(data.toString() === 'hello world');
			t.end();
		};
	};
});