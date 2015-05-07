# The Project
mcp9808 is a free-to-use library for controlling the mcp9808 temperature sensor from the raspberry pi. It includes support for all commands highlighted in the sensor’s datasheet, and provides useful examples of how to use the library in the examples folder. The examples include tools from a basic command-line temperature reader to a complete web-based temperature controller. 
# Documentation

mcp9808 is available as an npm module. To download, simply run  sudo npm install mcp9808.
Then import and initialize the module in your Node.js program.

	var MCP9808 = new require('mcp9808');
	MCP9808.Initialize(function(){
		//your code here
	});

All commands in this library use callbacks. For example, if you want to get the temperature and tne log it to the screen, use this code.

	var MCP9808 = new require('mcp9808');
	MCP9808.Initialize(function(){
		MCP9808.AmbientTemperature(error, data)
		{
			console.log(data);
		});
	});