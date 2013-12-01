var configs = require('./config.json');
var should = require('should');
var Reiki = require('../lib/index.js');
var request = require('request');
describe('engineioServer', function() {
  'use strict';
  describe('websocket server', function() {
    var reiki;
    var connectionUrl;
    before(function() {
      connectionUrl = configs.host + ':' + configs.port;
      reiki = require('../mocks/engineio-server.js');
      reiki.listen(8080);
    });

    after(function() {
      reiki.server.close();
    });


    it('should return hello world for a standard http request', function(done) {
      request('http://' + connectionUrl, function(err, response, body) {
        should.exist(body);
        body.should.equal('hello world');
        done();
      });
    });

    it('should return "hello world" in response to me sending it', function(done) {
      console.log('listening');
      reiki.listen(configs.port);
      console.log('sweet');
      var client = require('engine.io-client')('ws://' + connectionUrl);
      console.log('client emit:' + client.emit);
      client.onopen = function() {
        client.onmessage = function(data) {
          console.log('go data: ', data);
        };
        client.onclose = function() {};
        //client.emit('message', 'hello world');
        client.send('shittzzz');
      };
    });
  });
});

