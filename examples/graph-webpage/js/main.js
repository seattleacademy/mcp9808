
var StartTime;
var myLineChart;
var Points = 0;
var Data = {};

var Parameters = {"SetTemperatureHysteresis": true, "SetResolution": true, "SetUpperTemperature": true, "SetLowerTemperature": true, "SetCriticalTemperature": true};

//update the chart function
function UpdateChartData()
{
    while(Points > 10)
    {
        Points -= 1;

        myLineChart.removeData();
    }

    myLineChart.addData([Data["Temperature"]], Math.floor((Date.now() - StartTime) / 1000.0));
    myLineChart.update();
    Points+=1;
}

function UpdateDOM()
{
    $("#alert-output").html(Data["AlertOutput"]);
    $("#configuration-register").html(Data["ConfigurationRegister"]);
    $("#critical-temperature").html(Data["CriticalTemperature"]);
    $("#is-locked").html(Data["IsLocked"].toString());
    $("#is-ready").html(Data["IsReady"].toString());
    $("#lower-temperature").html(Data["LowerTemperature"]);
    $("#resolution").html(Data["Resolution"]);
    $("#temperature").html((Data["Temperature"]).toFixed(3));
    $("#upper-temperature").html(Data["UpperTemperature"]);
}

function UpdateParameters()
{
    var Command = $("#command-dropdown option:selected").val();

    if(Parameters[Command] == true)
    {
        $("#command-value-label").fadeIn(500);
        $("#command-value").fadeIn(500);
    }
    else
    {
        $("#command-value-label").fadeOut(500);
        $("#command-value").fadeOut(500);
    }
}

function UpdateRadio()
{
    if($('input[id=Clear]:checked').val() == "Clear")
    {
        $(".command-set").hide(0);
        $(".command-clear").show(0);
        $("#command-dropdown").val("ClearShutdown");
    }

    if($('input[id=Set]:checked').val() == "Set")
    {
        $(".command-set").show(0);
        $(".command-clear").hide(0);
        $("#command-dropdown").val("SetShutdown");
    }
}

//setup the chart
$(document).ready(function()
{
    //get the data every 1000 miliseconds
    setInterval(function()
    {
        $.get( "/data", function(data) 
        {
            Data = JSON.parse(data);
            UpdateDOM();
            UpdateChartData();
        });
    }, 1000);

    UpdateParameters();
    UpdateRadio();

    $('#command-dropdown').change(function() 
    {    
        UpdateParameters();
    });

    $(".radio").change(function()
    {
        UpdateRadio();
    });

    $("#command-send").click(function()
    {
        var Command = $("#command-dropdown option:selected").val();
        var Value = $("#command-value").val();
        var ObjectToSend = {'Command': Command, 'Value': Value};

        //send the data
        console.log(JSON.stringify(ObjectToSend));

        //send the post command
        $.post("/send", ObjectToSend).done(function(data) 
        {
            console.log(data);
        });
    });

    //set the start time
    StartTime = Date.now();

    data = {
        labels: [],
        datasets: [{
            data: []
        }]
    };
    ctx = $("#temperature-chart").get(0).getContext("2d");
    var Options = {
        animation : false,
        pointDot : true,
        bezierCurve : true
    }
    myLineChart = new Chart(ctx).Line(data, Options);
});