var chai = require("chai");
var MCP9808 = require("../index.js");
var expect = chai.expect;

function TestWritableBits(Callback)
{
	//set all of the bits, then make sure that 
	MCP9808.SetAlertControl(function(err)
	{
		MCP9808.SetAlertSelect(function(err)
		{
			MCP9808.SetAlertPolarity(function(err)
			{
				MCP9808.SetAlertMode(function(err)
				{
					MCP9808.GetConfigurationRegister(function(error, ConfigurationRegister)
					{
						expect(ConfigurationRegister & 0x0F).equal(15);
						Callback();
					});
				});
			});
		});
	});
}

function TestSetCommands(Callback)
{
	//set all of the bits, then make sure that 
	MCP9808.SetResolution(0x02, function(err)
	{
		MCP9808.GetResolution(function(err, Resolution)
		{
			MCP9808.SetUpperTemperature(27, function(err)
			{
				MCP9808.GetUpperTemperature(function(err, UpperTemperature)
				{
					MCP9808.SetLowerTemperature(27, function(err)
					{
						MCP9808.GetLowerTemperature(function(err, LowerTemperature)
						{
							MCP9808.SetCriticalTemperature(27, function(err)
							{
								MCP9808.GetCriticalTemperature(function(err, CriticalTemperature)
								{
									expect(Resolution).equal(0x02);
									expect(UpperTemperature).equal(27);
									expect(LowerTemperature).equal(27);
									expect(CriticalTemperature).equal(27);
									Callback();
								});
							});
						});
					});
				});
			});
		});
	});
}

function TestTemperature(Callback)
{
	MCP9808.AmbientTemperature(function(err, Temperature)
	{
		//makes sure it isn't undefined
		expect(Temperature).to.be.a('number');
		Callback();
	});
}

MCP9808.Initialize(function()
{
	TestWritableBits(function () 
	{
		TestSetCommands(function()
		{
			TestTemperature(function()
			{
				//done
			});
		});
	});
});
