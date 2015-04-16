var i2c = require('i2c');

//the address of the wire
var I2C_ADDRESS = 0x18;

//registers
var AMBIENT_TEMP_REGISTER = 0x05;
var DEVICE_ID_REGISTER = 0x07;
var MANUFACTURER_ID_REGISTER = 0x06;
var RESOLUTION_REGISTER = 0x08;
var CONFIGURATION_REGISTER = 0x01;

//info
//The read command reads the 0x0080 from right to left

//Configuration register values.
var CONFIGURATION_SHUTDOWN_BYTES = 0x0100;
var CONFIGURATION_CRITICAL_LOCK = 0x0080;
var CONFIGURATION_WINDOW_LOCK = 0x0040;
var CONFIGURATION_INTERRUPT_CLEAR = 0x0020;
var CONFIGURATION_ALERT_STATUS = 0x0010; 
var CONFIGURATION_ALERT_CONTROL = 0x0008;
var CONFIGURATION_ALERT_SELECT = 0x0004;

var CONFIGURATION_ALERT_POL = 0x0002;

var exports = module.exports = {};
var i2cdevice;

exports.Initialize = function(Callback)
{
    //sets up the device
    i2cdevice = new i2c(I2C_ADDRESS, {device: '/dev/i2c-1'});

    Callback();
}

//make these private
function ReadData(Register, Bytes, Callback)
{
    i2cdevice.readBytes(Register, Bytes, function(err, data) 
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

//sends the LSB first. The device wants the MSB first. 
function WriteData(Register, ByteArray, Callback)
{
    i2cdevice.writeBytes(Register, ByteArray, function(err) 
    {   
        Callback(err);
    });
}

function ReverseByte(val)
{
    return ((val & 0xFF) << 8)
           | ((val >> 8) & 0xFF);
}

exports.SetShutdown = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {
        WriteData(CONFIGURATION_REGISTER, [ReverseByte(Configuration | CONFIGURATION_SHUTDOWN_BYTES)], function(err)
        {
            Callback(err);
        });
    });
}

exports.ClearShutdown = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {
        NewConfig = Configuration & ~CONFIGURATION_SHUTDOWN_BYTES;
        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.SetTemperatureHysteresis = function(Hysteresis, Callback)
{
    //throw an error if the nubmer passed is wrong
    exports.GetConfigurationRegister(function(ReadError, Configuration)
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

        WriteData(CONFIGURATION_REGISTER, [ReverseByte(Configuration)], function(err)
        {
            Callback(err);
        });
    });
}

exports.GetConfigurationRegister = function(Callback)
{
    ReadData(CONFIGURATION_REGISTER, 2, function(err, data)
    {
        Callback(err, data);
    });
}

exports.ClearConfigurationRegister = function(Callback)
{
    WriteData(CONFIGURATION_REGISTER, [0x00, 0x00], function(err)
    {
        Callback(err);
    });
}

exports.SetCriticalLock = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {

        NewConfig = (Configuration | CONFIGURATION_CRITICAL_LOCK);

        //this effectively reverses the byte order
        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.SetWindowLock = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {

        NewConfig = (Configuration | CONFIGURATION_WINDOW_LOCK);

        //this effectively reverses the byte order
        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.SetInterruptClear = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {

        NewConfig = (Configuration | CONFIGURATION_INTERRUPT_CLEAR);

        //this effectively reverses the byte order
        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.SetAlertStatus = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {

        NewConfig = (Configuration | CONFIGURATION_ALERT_STATUS);

        //this effectively reverses the byte order
        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.SetAlertControl = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {

        NewConfig = (Configuration | CONFIGURATION_ALERT_CONTROL);

        //this effectively reverses the byte order
        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.SetAlertSelect = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {

        NewConfig = (Configuration | CONFIGURATION_ALERT_SELECT);

        //this effectively reverses the byte order
        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.ClearAlertSelect = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {
        NewConfig = Configuration & ~CONFIGURATION_ALERT_SELECT;

        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.ClearAlertControl = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {
        NewConfig = Configuration & ~CONFIGURATION_ALERT_CONTROL;

        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.ClearAlertStatus = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {
        NewConfig = Configuration & ~CONFIGURATION_ALERT_STATUS;

        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.ClearInterruptClear = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {
        NewConfig = Configuration & ~CONFIGURATION_INTERRUPT_CLEAR;

        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.IsLocked = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {
        Configuration = Configuration & 0x00C0;

        if(Configuration == 0x00C0 || Configuration == 0x0080 || Configuration == 0x0040)
        {
            Callback(true, ReadError);
        }
        else
        {
            Callback(false, ReadError);
        }
    });
}

exports.SetResolution = function(Resolution, Callback)
{
    //0x00 for lowest resoluton, 0x03 for highest resolution
    i2cdevice.writeBytes(RESOLUTION_REGISTER, [Resolution], function(err) 
    {   
        Callback(err);
    });
}

exports.IsReady = function(Callback)
{
    var ManufacturerID;
    var DeviceID;

    i2cdevice.readBytes(MANUFACTURER_ID_REGISTER, 2, function(err, RawManufacturerID) 
    {
        ManufacturerID = RawManufacturerID.readInt16BE(0);
        
        i2cdevice.readBytes(DEVICE_ID_REGISTER, 2, function(err, RawDeviceID) 
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

exports.GetResolution = function(Callback)
{
    i2cdevice.readBytes(RESOLUTION_REGISTER, 1, function(err, data) 
    {
        Resolution = data.readUInt8(0);

        Callback(err, Resolution);
    });
}

exports.AmbientTemperature = function(Callback)
{
    i2cdevice.readBytes(AMBIENT_TEMP_REGISTER, 2, function(err, data) 
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