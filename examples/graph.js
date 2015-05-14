var MCP9808 = new require('../index.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(express.static("./graph-webpage"));
var server = app.listen(10000);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var Data = {"Temperature": 0, "ConfigurationRegister": 0, "IsLocked": 0, "IsReady": 0, "AlertOutput": 0, "Resolution": 0, "UpperTemperature": 0, "LowerTemperature": 0, "CriticalTemperature": 0};

MCP9808.Initialize(function()
{
	SetupMiddleware();
});

function SetupMiddleware()
{
	app.get('/data', function(req, res)
	{
		UpdateObject(function()
		{
			res.send(JSON.stringify(Data));
		});
	});

	app.post('/send', function(req, res)
	{

		console.log("Recieved '" + req.body.Command + "'' with Value '" + req.body.Value + "'");
		
		switch(req.body.Command) 
		{
		    case "SetShutdown":
		        MCP9808.SetShutdown(function(){});
		        break;
		    case "SetTemperatureHysteresis":
		        console.log("Set Hystresis to " + req.body.Value);
		        MCP9808.SetTemperatureHysteresis(req.body.Value, function(){});
		        break;
	        case "SetCriticalLock":
	        	console.log("Set Critical Lock");
	        	MCP9808.SetCriticalLock(function(){});
	        	break;
	        case "ClearShutdown":
	        	MCP9808.ClearShutdown(function(){});
	        	break;
	    	case "ClearConfigurationRegister":
	    		MCP9808.ClearConfigurationRegister(function(){});
	    		break;
			case "SetWindowLock":
				MCP9808.SetWindowLock(function(){});
				break;
			case "SetInterruptClear":
				MCP9808.SetInterruptClear(function(){});
				break;
			case "SetAlertStatus":
				MCP9808.SetAlertStatus(function(){});
				break;
			case "SetAlertControl":
				MCP9808.SetAletControl(function(){});
				break;
			case "SetAlertSelect":
				MCP9808.SetAlertSelect(function(){});
				break;
			case "SetAlertPolarity":
				MCP9808.SetAlertPolarity(function(){});
				break;
			case "SetAlertMode":
				MCP9808.SetAlertMode(function(){});
				break;
			case "ClearAlertMode":
				MCP9808.ClearAlertMode(function(){});
				break;
			case "ClearAlertPolarity":
				MCP9808.ClearAlertPolarity(function(){});
				break;
			case "ClearAlertSelect":
				MCP9808.ClearAlertSelect(function(){});
				break;
			case "ClearAlertControl":
				MCP9808.ClearAlertControl(function(){});
				break;
			case "ClearAlertStatus":
				MCP9808.ClearAlertStatus(function(){});
				break;
			case "ClearInterruptClear":
				MCP9808.ClearInterruptClear(function(){});
				break;
			case "SetResolution":
				MCP9808.SetResolution(req.body.Value, function(){});
				break;
			case "SetUpperTemperature":
				MCP9808.SetUpperTemperature(req.body.Value, function(){});
				break;
			case "SetLowerTemperature":
				MCP9808.SetLowerTemperature(req.body.Value, function(){});
				break;
			case "SetCriticalTemperature":
				MCP9808.SetCriticalTemperature(req.body.Value, function(){});
				break;
		    default:
		        console.log("Invalid Request");
		}

		res.send("success");
	});
}
	    	

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
									Data["LowerTemperature"] = LowerTemperautreData;

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