var Reiki = require('../index.js');
var Rx = require('rx');
var sic = require('socket.io-client');
var test = require('tape');
var http = require('http');

var done = function(clients, r) {
	for (var i = 0; i < clients.length; i++) {
		clients[i].disconnect();
	}
	r.stop();
};

// Force new connections for multi-client tests.
var connect = function(url) {
	var socket = sic.connect(url, {
		'force new connection': true
	});
	return socket;
};

// Each server instance takes likes 10s to go offline after reiki.stop() is called.
// There will be wait time for test report after all tests complete.
test('Should be able to create and subscribe to custom event stream.', function(t) {
	t.plan(1);
	var r = new Reiki(8080);
	var messageStream = r.createEventStream('hello');
	var sub = messageStream.subscribe(function(e) {
		t.equal(e.message, 'hello world');
		done([socket], r);
	});
	var socket = connect('ws://localhost:8080');
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
		--messages || done([client1, client2], r);
	});
	var client1 = connect('ws://localhost:8081');
	var client2 = connect('ws://localhost:8081');
	client1.on('connect', sendMessage.bind(client1));
	client2.on('connect', sendMessage.bind(client2));
});

test('Should be able to push messages to client from server', function(t) {
	t.plan(1);
	var r = new Reiki(8082);
	r.createEventStream('messages')
		.subscribe(function(data) {
			data.socket.emit('message', 111);
		});

	var socket = connect('ws://localhost:8082');
	socket.on('connect', function() {
		socket.emit('messages');
		socket.on('message', function(data) {
			t.equal(data, 111);
			done([socket], r);
		})
	});
});

test('Should be able to create an eventStream for socket disconnection events', function(t) {
	t.plan(3);
	var r = new Reiki(8085);
	var disconnectStream = r.createEventStream('disconnect');
	var dcsub = disconnectStream.subscribe(function(d) {
		t.ok(d.socket, 'arg has socket property.');
		t.ok(d.message, 'arg has message property.');
		t.pass('disconnect event handled correctly.')
		done([socket], r);
	});
	var socket = connect('ws://localhost:8085');
	socket.on('connect', function() {
		socket.disconnect();
	});
});

test('Should be able to be instantiated from httpServer', function(t) {
	t.plan(1);
	var server = http.createServer(handler);

	var handler = function(request, response) {
		response.end('hello world');
	};

	server.listen(8083);
	var r = new Reiki(server);
	var eventStream = r.createEventStream('messages');
	eventStream.subscribe(function(d) {
		t.equal(d.message, 12);
		done([socket], r);
	});
	var socket = connect('ws://localhost:8083');
	socket.on('connect', function() {
		socket.emit('messages', 12);
	});
});

test('Should be able to be intantiated with express application', function(t) {
	t.plan(1);
	var app = require('express')();
	var server = http.createServer(app);
	server.listen(8084);
	var r = new Reiki(server);
	var eventStream = r.createEventStream('messages');
	eventStream.subscribe(function(d) {
		t.equal(d.message, 15);
		done([socket], r);
	});
	var socket = connect('ws://localhost:8084');
	socket.on('connect', function() {
		socket.emit('messages', 15);
	});
});

test('Socket.broadcast.emit should produce the expected behaviour', function(t) {
	t.plan(1);
	var r = new Reiki(8086);
	var eventStream = r.createEventStream('messages');
	eventStream.subscribe(function(data) {
		data.socket.broadcast.emit('hi', 'coolcoolcool');
	});
	var sendMessage = function() {
		this.emit('messages', 'hello world');
	};
	var client1 = connect('ws://localhost:8086');
	var client2 = connect('ws://localhost:8086');
	client1.on('hi', function(d) {
		t.equal(d, 'coolcoolcool');
		done([client1, client2], r);
	});
	client2.on('connect', sendMessage.bind(client2));
});

// Socket.set test.
test('Socket.set should produce the expected behaivour', function(t) {
	t.plan(1);
	var r = new Reiki(8087);
	var eventStream = r.createEventStream('setName');
	eventStream.subscribe(function(d) {
		d.socket.set('name', d.message);
		d.socket.get('name', function(err, name) {
			t.equal(name, d.message);
			done([client1], r);
		});
	});
	var client1 = connect('ws://localhost:8087');
	client1.on('connect', function() {
		client1.emit('setName', 'howard');
	});
});
