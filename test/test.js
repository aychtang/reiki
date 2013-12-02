var Reiki = require('../index.js');
var Rx = require('rx');
var sic = require('socket.io-client');
var test = require('tape');

test('Should be able to create and subscribe to custom event stream.', function(t) {
	t.plan(1);
	var r = new Reiki(8080);
	var messageStream = r.createEventStream('hello');
	var sub = messageStream.subscribe(function(data) {
		sub.dispose();
		socket.disconnect();
		r.stop();
		t.equal(data, 'hello world');
	});
	var socket = sic.connect('ws://localhost:8080');
	socket.on('connect', function() {
		socket.emit('hello', 'hello world');
	});
});

// test('Connection stream events should have a socket object.', function(t) {
// 	t.plan(1);
// 	var r = new Reiki({
//   	port: 8080
// 	});
// 	r.connectionStream.subscribe(function(socket) {
// 		t.ok(socket, ' connectionStream event has a socket.');
// 		t.end();
// 	});
// 	var socket = eic('ws://localhost:8080');
// });

// test('Should be able to send messages to sockets from connectionStream.', function(t) {
// 	t.plan(1);
// 	var r = new Reiki({
//   	port: 8081
// 	});
// 	r.connectionStream.subscribe(function(socket) {
// 		socket.send('hello world');
// 	});

// 	var socket = eic('ws://localhost:8081');
// 	socket.onopen = function() {
// 		socket.onmessage = function(data) {
// 			t.equal(data.toString(), 'hello world', ' client has received message from server.');
// 			t.end();
// 		};
// 	};
// });

// test('Should be able to be instantiated from httpServer option', function(t) {
// 	t.plan(1);
// 	var http = require('http').createServer().listen(8002);
// 	var r = new Reiki({
// 		server: http
// 	});
// 	r.connectionStream.subscribe(function(socket) {
// 		t.ok(socket, ' has a socket');
// 		t.end();
// 	});
// 	var socket = eic('ws://localhost:8002');
// });

// test('Should be able to create custom event streams on server side', function(t) {
// 	var r = new Reiki({
// 		port: 8083
// 	});
// 	// message is a subject which streams message events for all sockets connected.
// 	r.createEventStream('message')
// 		.subscribe(function(n) {
// 			t.equal(n, 'hello world', 'received hello world message from stream.');
// 			t.end();
// 		});
// 	var socket = eic('ws://localhost:8083');
// 	socket.onopen = function() {
// 		socket.send('hello world');
// 	};
// });

// test('Should squash all sockets events into one subject stream', function(t) {
// 	t.plan(2);
// 	var r = new Reiki({
// 		port: 8084
// 	});

// 	var messageStream = r.createEventStream('message');

// 	messageStream.subscribe(function(n) {
// 		t.equal(n, 'hello world', 'received hello world message from stream.');
// 	});

// 	// Since message stream is a subject which streams message events for all sockets.
// 	// The subscribed function should run twice.
// 	var sendMessage = function() {
// 		client1.send('hello world');
// 	};

// 	var client1 = eic('ws://localhost:8084');
// 	var client2 = eic('ws://localhost:8084');
// 	client1.onopen = client2.onopen = sendMessage;
// });
