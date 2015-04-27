//import mcp9808
var MCP9808 = new require('./mcp9808.js');

//setup express server
var express = require('express');
var app = express();
app.use(express.static("./www"));
var server = app.listen(10000);

var Data = {"Temperature": 0, "ConfigurationRegister": 0, "IsLocked": 0, "IsReady": 0, "AlertOutput": 0, "Resolution": 0, "UpperTemperature": 0, "LowerTemperautre": 0, "CriticalTemperature": 0};

function UpdateObject(Callback)
{
	MCP9808.GetConfigurationRegister(function(ConfigurationRegisterError, ConfigurationRegisterData)
	{
		Data["ConfigurationRegister"] = ConfigurationRegisterData;

		MCP9808.AmbientTemperature(function(AmbientTemperatureError, AmbientTemperatureData)
		{
			Data["Temperature"] = AmbientTemperatureData;

			MCP9808.IsLocked(function(IsLockedError, IsLockedData)
			{
				Data["IsLocked"] = IsLockedData;

				MCP9808.IsReady(function(IsReadyError, IsReadyData)
				{
					Data["IsReady"] = IsReadyData;

					MCP9808.GetAlertOutput(function(AlertOutputError, AlertOutputData)
					{
						Data["AlertOutput"] = AlertOutputData;

						MCP9808.GetResolution(function(ResolutionError, ResolutionData)
						{
							Data["Resolution"] = ResolutionData;

							MCP9808.GetUpperTemperature(function(UpperTemperatureError, UpperTemperatureData)
							{
								Data["UpperTemperature"] = UpperTemperatureData;

								MCP9808.GetLowerTemperature(function(LowerTemperatureError, LowerTemperautreData)
								{
									Data["LowerTemperautre"] = LowerTemperautreData;

									MCP9808.GetCriticalTemperature(function(CriticalTemperatureError, CriticalTemperatureData)
									{
										Data["CriticalTemperature"] = CriticalTemperatureData;

										Callback();
									});
								});
							});
						});
					});
				});
			});
		});
	});
}

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
				UpdateObject(function()
				{
					socket.emit('data', JSON.stringify(Data));
				});
			});
		}, 1000);
	    //send most recent update out to client

	    socket.on('data', function(data)
	    {
	    	console.log("data");
	    });
	});
});
