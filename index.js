var i2c = require('i2c');

//the address of the wire
var I2C_ADDRESS = 0x18;

//registers
var AMBIENT_TEMP_REGISTER = 0x05;
var DEVICE_ID_REGISTER = 0x07;
var MANUFACTURER_ID_REGISTER = 0x06;
var RESOLUTION_REGISTER = 0x08;
var CONFIGURATION_REGISTER = 0x01;
var UPPER_TEMPERATURE_REGISTER = 0x02;
var LOWER_TEMPERATURE_REGISTER = 0x03;
var CRITICAL_TEMPERATURE_REGISTER = 0x04;

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
var CONFIGURATION_ALERT_POLARITY = 0x0002;
var CONFIGURATION_ALERT_MODE = 0x0001;

var exports = module.exports = {};
var i2cdevice;

exports.Initialize = function(Callback)
{
    //sets up the device
    i2cdevice = new i2c(I2C_ADDRESS, {device: '/dev/i2c-1'});

    Callback();
}

//make these private
function IsFloat(n) {
    return n === +n && n !== (n|0);
}

function IsInteger(n) {
    return n === +n && n === (n|0);
}

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
        NewConfig = Configuration& ~CONFIGURATION_SHUTDOWN_BYTES;
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

//works
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

//works
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

//might work: documentation says that when read it reverts to 0
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

//works
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

//works
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

//works
exports.SetAlertPolarity = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {

        NewConfig = (Configuration | CONFIGURATION_ALERT_POLARITY);

        //this effectively reverses the byte order
        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

//works
exports.SetAlertMode = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {

        NewConfig = (Configuration | CONFIGURATION_ALERT_MODE);

        //this effectively reverses the byte order
        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.ClearAlertMode = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {
        NewConfig = Configuration & ~CONFIGURATION_ALERT_MODE;

        WriteData(CONFIGURATION_REGISTER, [NewConfig >> 8, NewConfig], function(err)
        {
            Callback(err);
        });
    });
}

exports.ClearAlertPolarity = function(Callback)
{
    exports.GetConfigurationRegister(function(ReadError, Configuration)
    {
        NewConfig = Configuration & ~CONFIGURATION_ALERT_POLARITY;

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
            Callback(ReadError, true);
        }
        else
        {
            Callback(ReadError, false);
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


//This function will return the cause of the alert output trigger, it will return
//the bits 13 14 and 15 of the TA Register mapped into an int
exports.GetAlertOutput = function(Callback)
{
    ReadData(AMBIENT_TEMP_REGISTER, 2, function(err, data)
    {
        Callback(err, (data & 0xE000) >> 13);
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
    ReadData(AMBIENT_TEMP_REGISTER, 2, function(err, data) 
    {
        if (err) 
        {
            Callback(err);
        }
        else 
        {
            var temp = (data & 0x0FFF) / 16.0;
            if(data & 0x1000)
            {
                temp -= 256.0;
            }

            Callback(null, temp);
        }
    });
}

//Set the Temperature Upper Register with a resolution of 0.25 Degree Celsius, if the temperature passed
//to the funcition is not in that resolution it will be rounded by defect to the nearest decimal resolution
//works
exports.SetUpperTemperature = function(Temperature, Callback)
{
    //Check if temp is float
    Temperature = Temperature * 1.00;

    //Divide Integer from decimal parts
    DecimalPart = (Math.abs(Temperature) % 1).toFixed(4);
    IntegerPart = Math.floor(Math.abs(Temperature));

    //Round decimal parts to 0.25 steps
    if (DecimalPart >= 0 && DecimalPart < 0.25)
    {
        DecimalPart = 0x00;
    }
    else if (DecimalPart >= 0.25 && DecimalPart < 0.5)
    {
        DecimalPart = 0x01;
    }
    else if (DecimalPart >= 0.5 && DecimalPart < 0.75)
    {
        DecimalPart = 0x02;
    }
    else if (DecimalPart >= 0.75 && DecimalPart < 1)
    {
        DecimalPart = 0x03;
    }
    //Calculate the new temperature to write
    FinalTemperature = 0;
    FinalTemperature = ((IntegerPart << 4) | (DecimalPart << 2)) & 0x0FFC;

    //Set Sign if it is negative
    if(Temperature < 0)
    {
        FinalTemperature = FinalTemperature | 0x1000;
    }

    //Write to Register
    WriteData(UPPER_TEMPERATURE_REGISTER, [FinalTemperature >> 8, FinalTemperature], function(err)
    {
        Callback(err);
    });
}

exports.SetLowerTemperature = function(Temperature, Callback)
{
    //Check if temp is float
    Temperature = Temperature * 1.00;

    //Divide Integer from decimal parts
    DecimalPart = (Math.abs(Temperature) % 1).toFixed(4);
    IntegerPart = Math.floor(Math.abs(Temperature));

    //Round decimal parts to 0.25 steps
    if (DecimalPart >= 0 && DecimalPart < 0.25)
    {
        DecimalPart = 0x00;
    }
    else if (DecimalPart >= 0.25 && DecimalPart < 0.5)
    {
        DecimalPart = 0x01;
    }
    else if (DecimalPart >= 0.5 && DecimalPart < 0.75)
    {
        DecimalPart = 0x02;
    }
    else if (DecimalPart >= 0.75 && DecimalPart < 1)
    {
        DecimalPart = 0x03;
    }
    //Calculate the new temperature to write
    FinalTemperature = 0;
    FinalTemperature = ((IntegerPart << 4) | (DecimalPart << 2)) & 0x0FFC;

    //Set Sign if it is negative
    if(Temperature < 0)
    {
        FinalTemperature = FinalTemperature | 0x1000;
    }

    //Write to Register
    WriteData(LOWER_TEMPERATURE_REGISTER, [FinalTemperature >> 8, FinalTemperature], function(err)
    {
        Callback(err);
    });
}

exports.SetCriticalTemperature = function(Temperature, Callback)
{
    //Check if temp is float
    Temperature = Temperature * 1.00;

    //Divide Integer from decimal parts
    DecimalPart = (Math.abs(Temperature) % 1).toFixed(4);
    IntegerPart = Math.floor(Math.abs(Temperature));

    //Round decimal parts to 0.25 steps
    if (DecimalPart >= 0 && DecimalPart < 0.25)
    {
        DecimalPart = 0x00;
    }
    else if (DecimalPart >= 0.25 && DecimalPart < 0.5)
    {
        DecimalPart = 0x01;
    }
    else if (DecimalPart >= 0.5 && DecimalPart < 0.75)
    {
        DecimalPart = 0x02;
    }
    else if (DecimalPart >= 0.75 && DecimalPart < 1)
    {
        DecimalPart = 0x03;
    }
    //Calculate the new temperature to write
    FinalTemperature = 0;
    FinalTemperature = ((IntegerPart << 4) | (DecimalPart << 2)) & 0x0FFC;

    //Set Sign if it is negative
    if(Temperature < 0)
    {
        FinalTemperature = FinalTemperature | 0x1000;
    }

    //Write to Register
    WriteData(CRITICAL_TEMPERATURE_REGISTER, [FinalTemperature >> 8, FinalTemperature], function(err)
    {
        Callback(err);
    });
}

//Get the Temperature Upper Register
//works
exports.GetUpperTemperature = function(Callback)
{
    ReadData(UPPER_TEMPERATURE_REGISTER, 2, function(err, data)
    {
        UpperByte = data & 0x0FF0;
        LowerByte = data & 0x000C;
        Sign = 1;

        if(data & 0x1000)
        {
            Sign = -1;
        }

        Callback(err, (((UpperByte >> 4) + ((LowerByte >> 2) / 4))) * Sign);
    });
}

exports.GetLowerTemperature = function(Callback)
{
    ReadData(LOWER_TEMPERATURE_REGISTER, 2, function(err, data)
    {
        UpperByte = data & 0x0FF0;
        LowerByte = data & 0x000C;
        Sign = 1;

        if(data & 0x1000)
        {
            Sign = -1;
        }

        Callback(err, (((UpperByte >> 4) + ((LowerByte >> 2) / 4))) * Sign);
    });
}

exports.GetCriticalTemperature = function(Callback)
{
    ReadData(CRITICAL_TEMPERATURE_REGISTER, 2, function(err, data)
    {
        UpperByte = data & 0x0FF0;
        LowerByte = data & 0x000C;
        Sign = 1;

        if(data & 0x1000)
        {
            Sign = -1;
        }

        Callback(err, (((UpperByte >> 4) + ((LowerByte >> 2) / 4))) * Sign);
    });
}