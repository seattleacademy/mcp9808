var chai = require("chai");
var MCP9808 = require("./index.js");
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

MCP9808.Initialize(function()
{
	TestWritableBits(function () 
	{
		
	});
});
