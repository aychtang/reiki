var Reiki = require('../index.js');
var Rx = require('rx');
var sic = require('socket.io-client');
var test = require('tape');

var done = function(clients, r) {
	for (var i = 0; i < clients.length; i++) {
		clients[i].disconnect();
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
		done([socket], r);
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
		--messages || done([client1, client2], r);
	});
	var client1 = sic.connect('ws://localhost:8081');
	var client2 = sic.connect('ws://localhost:8081');
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

	var socket = sic.connect('ws://localhost:8082');
	socket.on('connect', function() {
		socket.emit('messages');
		socket.on('message', function(data) {
			t.equal(data, 111);
			done([socket], r);
		})
	});
});

test('Should be able to be instantiated from httpServer', function(t) {
	t.plan(1);
	var server = require('http').createServer(handler);

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
	var socket = sic.connect('ws://localhost:8083');
	socket.on('connect', function() {
		socket.emit('messages', 12);
	});
});
