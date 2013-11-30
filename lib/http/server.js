var http = require('http');
var _ = require('underscore');
var Rx = require('rx');

var ServerStream = function(options) {
  'use strict';
  this.pvt = {};
  this._server = http.createServer(options.init || this.init);


};

//this might need to be changed later?
ServerStream.prototype = Object.create({});

ServerStream.prototype.init = function(req, res) {
  'use strict';
  /* do stuff here to initialize the server */


};

ServerStream.prototype.listen = function(params) {
  'use strict';
  this._server.listen.apply(this._server, params);
  return this;
};








