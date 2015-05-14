# The Project
mcp9808 is a free-to-use library for controlling the mcp9808 temperature sensor from the raspberry pi. It includes support for all commands highlighted in the sensor’s datasheet, and provides useful examples of how to use the library in the examples folder. The examples include tools from a basic command-line temperature reader to a complete web-based temperature controller. This codebase is managed by Isaac Zinda. 

# Installation

mcp9808 is available as an npm module. To download, simply run:  

	sudo npm install mcp9808 --unsafe-perm

Once the module is installed, navigate to the node_modules folder and enter into the mcp9808 directory. Then type: 

	sudo ./setup.sh

This command will automatically configure the raspberry pi to use I2C.

# Documentation

To start, import and initialize the module in your Node.js program.

	var MCP9808 = new require('mcp9808');
	MCP9808.Initialize(function(){
		//your code here
	});

All commands in this library use callbacks. For example, if you want to get the temperature and tne log it to the screen, use this code.

	var MCP9808 = new require('mcp9808');
	MCP9808.Initialize(function()
	{
		MCP9808.AmbientTemperature(function(error, data)
		{
			console.log(data);
		});
	});

# Examples

To quickly learn how to use the mcp9808 sensor library, sample programs are available in the module’s example folder.

temperature.js is a bare-bones program that outputs the temperature to the console once a second. Navigate to node_modules/mcp9808/examples and run

	sudo node temperature.js

graph.js provides a powerful web interface for using the mcp9808 sensor. To use, run:

	sudo node graph.js

Then navigate to [ip address]:10000. Here you will see a graph of the sensor’s temperature readings and a list of commands to send to the sensor.
