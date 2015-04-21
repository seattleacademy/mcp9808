//import mcp9808
var MCP9808 = new require('./mcp9808.js');

//setup express server
var express = require('express');
var app = express();
app.use(express.static("./www"));
var server = app.listen(10000);

//setup socket.io
var io = require('socket.io').listen(server);
MCP9808.Initialize(function()
{
	io.sockets.on('connection', function (socket) 
	{
		console.log("Connection Created");
		setInterval(function()
		{
			MCP9808.AmbientTemperature(function(err, data)
			{
				console.log(data);
				socket.emit('data', data);
			});
		}, 1000);
	    //send most recent update out to client
	});
});
