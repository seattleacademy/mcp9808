var MCP9808 = new require('./index.js');

MCP9808.Initialize(function(){
	MCP9808.SetWindowLock(function(){
		MCP9808.GetConfigurationRegister(function(err, data)
		{
			console.log(data);
			MCP9808.ClearConfigurationRegister(function(){
				MCP9808.GetConfigurationRegister(function(err2, data2)
				{
					console.log(data2);
				});
			})
		});
	});
});