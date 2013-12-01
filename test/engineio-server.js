var configs = require('./config.json');
var should = require('should');
var Reiki = require('../lib/index.js');
var request = require('request');
describe('engineioServer', function() {
  'use strict';
  describe('initialization', function() {
    var reiki;
    var connectionUrl;
    before(function() {
      connectionUrl = 'http://' + configs.host + ':' + configs.port;
      reiki = require('../mocks/engineio-server.js');
      reiki.listen(8080);
    });

    after(function() {
      reiki.server.close();
    });


    it('should return hello world', function(done) {
      request(connectionUrl, function(err, response, body) {
        should.exist(body);
        body.should.equal('hello world');
        done();
      });
    });

  });


});

