var MCP9808 = new require('./index.js');
var TemperatureSensor = new MCP9808();

TemperatureSensor.AmbientTemperature(function(err, data)
{
	console.log(data);
});