var i2c = require('i2c');

//the address of the wire
var I2C_ADDRESS = 0x18;

//registers
var AMBIENT_TEMP_REGISTER = 0x05;
var DEVICE_ID_REGISTER = 0x07;
var MANUFACTURER_ID_REGISTER = 0x06;
var RESOLUTION_REGISTER = 0x08;
var CONFIGURATION_REGISTER = 0x01;

//Configuration register values.
var CONFIGURATION_SHUTDOWN_BYTES     = 0x0100

function MCP9808()
{
    //sets up the device
    this.i2cdevice = new i2c(I2C_ADDRESS, {device: '/dev/i2c-1'});
}

//export the class
module.exports = MCP9808;

//make these private
MCP9808.prototype.ReadData = function(Register, Bytes, Callback)
{
    this.i2cdevice.readBytes(Register, Bytes, function(err, data) 
    {
        var ParsedData;
        if(Bytes == 1)
        {
            ParsedData = data.readUInt8(0);
        }
        else if(Bytes == 2)
        {
            ParsedData = data.readUInt16BE(0);
        }
        
        Callback(err, ParsedData);
    });
}

MCP9808.prototype.WriteData = function(Register, ByteArray, Callback)
{
    this.i2cdevice.writeBytes(Register, ByteArray, function(err) 
    {   
        Callback(err);
    });
}

function ReverseByte(val) 
{
    return ((val & 0xFF) << 8)
           | ((val >> 8) & 0xFF);
}

MCP9808.prototype.SetShutdown = function(Callback)
{
    this.GetConfigurationRegister(function(ReadError, Configuration)
    {
        this.WriteData(CONFIGURATION_REGISTER, [ReverseByte(Configuration | CONFIGURATION_SHUTDOWN_BYTES)], function(err)
        {
            Callback(err);
        });
    });
}

MCP9808.prototype.ClearShutdown = function(Callback)
{
    this.GetConfigurationRegister(function(ReadError, Configuration)
    {
        this.WriteData(CONFIGURATION_REGISTER, [ReverseByte(Configuration & ~CONFIGURATION_SHUTDOWN_BYTES)], function(err)
        {
            Callback(err);
        });
    });
}

MCP9808.prototype.SetTemperatureHysteresis = function(Hysteresis, Callback)
{
    //throw an error if the nubmer passed is wrong
    this.GetConfigurationRegister(function(ReadError, Configuration)
    {
        if(Hysteresis == 0)
        {
            Configuration = (Configuration & 0xF9FF) | 0x0000;
        }
        else if(Hysteresis == 1.5)
        {
            Configuration = (Configuration & 0xF9FF) | 0x0200;
        }
        else if(Hysteresis == 3)
        {
            Configuration = (Configuration & 0xF9FF) | 0x0400;
        }
        else if(Hysteresis == 6)
        {
            Configuration = (Configuration & 0xF9FF) | 0x0600;
        }

        this.WriteData(CONFIGURATION_REGISTER, [ReverseByte(Configuration)], function(err)
        {
            Callback(err);
        });
    });
}

MCP9808.prototype.GetConfigurationRegister = function(Callback)
{
    this.ReadData(CONFIGURATION_REGISTER, 2, function(err, data)
    {
        Callback(err, data);
    });
}

MCP9808.prototype.ClearConfigurationRegister = function(Callback)
{
    this.WriteData(CONFIGURATION_REGISTER, [0x00, 0x00], function(err)
    {
        Callback(err);
    });
}

MCP9808.prototype.SetResolution = function(Resolution, Callback)
{
    //0x00 for lowest resoluton, 0x03 for highest resolution
    this.i2cdevice.writeBytes(RESOLUTION_REGISTER, [Resolution], function(err) 
    {   
        Callback(err);
    });
}

MCP9808.prototype.IsReady = function(Callback)
{
    var ManufacturerID;
    var DeviceID;

    this.i2cdevice.readBytes(MANUFACTURER_ID_REGISTER, 2, function(err, RawManufacturerID) 
    {
        ManufacturerID = RawManufacturerID.readInt16BE(0);
        
        this.i2cdevice.readBytes(DEVICE_ID_REGISTER, 2, function(err, RawDeviceID) 
        {
            DeviceID = RawDeviceID.readInt16BE(0);

            if (ManufacturerID == 0x0054 && DeviceID == 0x0400)
            {
                Callback(err, true);
            }
            else
            {
                Callback(err, false);
            }
        });
    });
}

MCP9808.prototype.GetResolution = function(Callback)
{
    this.i2cdevice.readBytes(RESOLUTION_REGISTER, 1, function(err, data) 
    {
        Resolution = data.readUInt8(0);

        Callback(err, Resolution);
    });
}

MCP9808.prototype.AmbientTemperature = function(Callback)
{
    this.i2cdevice.readBytes(AMBIENT_TEMP_REGISTER, 2, function(err, data) 
    {
        if (err) 
        {
            Callback(err);
        }
        else 
        {
            var temp = (data.readInt16BE(0) & 0x0FFF) / 16.0;
            if(data & 0x1000)
            {
                temp -= 256.0;
            }

            Callback(null, temp);
        }
    });
}

// GetConfigurationRegister(function (error, data){
//     console.log(data);
//     SetTemperatureHysteresis(3, function(err)
//     {
//        GetConfigurationRegister(function (errror, dddata)
//        {
//         console.log(dddata);
//        }); 
//     });
// });


// SetResolution(0x00, function()
// {
//     GetResolution(function(err, data)
//     {
//         console.log(data);

//         IsReady(function(err, ready)
//         {
//             console.log(ready);
//             AmbientTemperature(function(err, bytes)
//             {
//                 console.log(bytes);
//             });
//         });
//     });
// });