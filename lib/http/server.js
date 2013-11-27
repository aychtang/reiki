/*jslint indent: 2 */
var http = require('http');
var _ = require('underscore');
var Rx = require('rx');

var ServerStream = function(intFunc) {
  'use strict';
  this._server = http.createServer(this.init);
  this.pvt = {};
  this.pvt.intFunc = intFunc;


};

//this might need to be changed later?
ServerStream.prototype = Object.create({});

ServerStream.prototype.init = function(req, res) {
  'use strict';
  /* do stuff here */

};

ServerStream.prototype.listen = function(params) {
  'use strict';
  params = arguments;
  this._server.listen.apply(this._server, params);
  return this;
};








