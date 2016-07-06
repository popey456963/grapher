var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('static'));

data = {}

function getParams(req) {
  if (req) {
    var params = {}
    if(req.body) {
    	bodyKeys = Object.keys(req.body)
    } else {
    	bodyKeys = {}
    }
    if(req.query) {
	    queryKeys = Object.keys(req.query)    	
    } else {
    	queryKeys = {}
    }
    for (i=0; i<bodyKeys.length; i++) {
      params[bodyKeys[i]] = req.body[bodyKeys[i]]
    }
    for (i=0; i<queryKeys.length; i++) {
      params[queryKeys[i]] = unescape(req.query[queryKeys[i]])
    }
    return params
  } else {
    return {}
  }
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index3.html');
});

app.get('/data', function(req, res) {
	for (var attrname in getParams(req)) { data[attrname] = getParams(req)[attrname]; }
	data["date"] = Math.floor(Date.now() / 1000);
	res.send("Success")
	console.log(data)
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

setInterval(function(){
  io.emit("ping", data)
}, 1000);

server.listen(3000, function () {
  console.log('[Grapher] Listening on port 3000!');
});