var i2c = require('i2c');

var I2C_ADDRESS = 0x18;
var AMBIENT_TEMP_REGISTER = 0x05;
var DEVICE_ID_REGISTER = 0x07;
var MANUFACTURER_ID_REGISTER = 0x06;
var RESOLUTION_REGISTER = 0x08;
var CONFIGURATION_REGISTER = 0x01;

//sets up the device
var i2cdevice = new i2c(I2C_ADDRESS, {device: '/dev/i2c-1'});

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

function WriteData(Register, ByteArray, Callback)
{
    i2cdevice.writeBytes(Register, ByteArray, function(err) 
    {   
        Callback(err);
    });
}

function SetTemperatureHysteresis(Hysteresis, Callback)
{
    //throw an error if the nubmer passed is wrong
    GetConfigurationRegister(function(ReadError, Configuration)
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

        
    });
}

function GetConfigurationRegister(Callback)
{
    ReadData(CONFIGURATION_REGISTER, 2, function(err, data)
    {
        Callback(err, data);
    });
}

function ClearConfigurationRegister(Callback)
{
    WriteData(CONFIGURATION_REGISTER, [0x00, 0x00], function(err)
    {
        Callback(err);
    });
}

function SetResolution(Resolution, Callback)
{
    //0x00 for lowest resoluton, 0x03 for highest resolution
    i2cdevice.writeBytes(RESOLUTION_REGISTER, [Resolution], function(err) 
    {   
        Callback(err);
    });
}

function IsReady(Callback)
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

function GetResolution(Callback)
{
    i2cdevice.readBytes(RESOLUTION_REGISTER, 1, function(err, data) 
    {
        Resolution = data.readUInt8(0);

        Callback(err, Resolution);
    });
}

function AmbientTemperature(Callback)
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

GetConfigurationRegister(function(err, data)
{
    console.log(data);
    ClearConfigurationRegister(function(error)
    {
        GetConfigurationRegister(function(errror, daata)
        {
            console.log(daata);
            AmbientTemperature(function(e, d)
            {
                console.log(d);
            })
        })
    })
});