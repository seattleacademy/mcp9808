# The Project
mcp9808 is a free-to-use library for controlling the mcp9808 temperature sensor from the raspberry pi. It includes support for all commands highlighted in the sensor’s datasheet, and provides useful examples of how to use the library in the examples folder. The examples include tools from a basic command-line temperature reader to a complete web-based temperature controller. 
# Documentation

To download, run sudo npm install mcp9808.
Then import and initialize the module in your Node.js program.

	var MCP9808 = new require('mcp9808');
	MCP9808.Initialize(function(){
	//your code here
	});
