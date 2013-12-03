var Reiki = require('../index.js');
var Rx = require('rx');
var sic = require('socket.io-client');
var test = require('tape');

var done = function(clients, subs, r) {
	for (var i = 0; i < clients.length; i++) {
		clients[i].disconnect();
	}
	for (var i = 0; i < subs.length; i++) {
		subs[i].dispose();
	}
	r.stop();
};

// Each server instance takes likes 10s to go offline after reiki.stop() is called.
// There will be wait time for test report after all tests complete.
test('Should be able to create and subscribe to custom event stream.', function(t) {
	t.plan(1);
	var r = new Reiki(8080);
	var messageStream = r.createEventStream('hello');
	var sub = messageStream.subscribe(function(e) {
		t.equal(e.message, 'hello world');
		done([socket], [sub], r);
	});
	var socket = sic.connect('ws://localhost:8080');
	socket.on('connect', function() {
		socket.emit('hello', 'hello world');
	});
});

test('Should squash all socket event streams into one main subject stream', function(t) {
	t.plan(2);
	var messages = 2;
	var r = new Reiki(8081);
	var messageStream = r.createEventStream('messages');
	var sendMessage = function() {
		this.emit('messages', 'hello world');
	};
	var sub = messageStream.subscribe(function(e) {
		t.equal(e.message, 'hello world', 'received hello world message from stream.');
		--messages || done([client1, client2], [sub], r);
	});
	var client1 = sic.connect('ws://localhost:8081');
	var client2 = sic.connect('ws://localhost:8081');
	client1.on('connect', sendMessage.bind(client1));
	client2.on('connect', sendMessage.bind(client2));
});

// test('Should be able to push messages to client from server', function(t) {
// 	t.plan(1);
// });

// Old tests to be rebuilt.
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

// });
