var MCP9808 = new require('./index.js');

MCP9808.Initialize(function(){
	MCP9808.GetCriticalTemperature(function(err, data)
	{
		console.log(data);
		MCP9808.SetCriticalTemperature(-35.5, function(err3)
		{
			MCP9808.GetCriticalTemperature(function(err2, data2)
			{
				console.log(data2);
			});
		})
	});
});