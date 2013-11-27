var http = require('http');
var ServerStream = function() {
  this.server = http.createServer(this.init);
}

//this might need to be changed later?
ServerStream.prototype = Object.create({});

ServerStream.prototype.init = function(req, res) {

}








