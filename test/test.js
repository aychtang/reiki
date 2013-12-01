var Reiki = require('../index.js');
var eic = require('engine.io-client');
var test = require('tape');

test('Connection stream events should have a socket object.', function(t) {
	t.plan(1);
	var r = new Reiki({
  	port: 8080
	});
	r.connectionStream.subscribe(function(socket) {
		t.ok(socket, ' connectionStream event has a socket.');
		t.end();
	});
	var socket = eic('ws://localhost:8080');
});

test('Should be able to send messages to sockets from connectionStream.', function(t) {
	t.plan(1);
	var r = new Reiki({
  	port: 8081
	});
	r.connectionStream.subscribe(function(socket) {
		socket.send('hello world');
	});

	var socket = eic('ws://localhost:8081');
	socket.onopen = function() {
		socket.onmessage = function(data) {
			t.equal(data.toString(), 'hello world', ' client has received message from server.');
			t.end();
		};
	};
});

test('Should be able to be instantiated from httpServer option', function(t) {
	t.plan(1);
	var http = require('http').createServer().listen(8002);
	var r = new Reiki({
		server: http
	});
	r.connectionStream.subscribe(function(socket) {
		t.ok(socket, ' has a socket');
		t.end();
	});
	var socket = eic('ws://localhost:8002');
});
