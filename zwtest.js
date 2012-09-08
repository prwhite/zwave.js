#!/usr/bin/env node

var serialport = require("serialport");
var SerialPort = require("serialport").SerialPort;
var util = require('util');

var serial_port = new SerialPort(process.argv[ 2 ],{ 
            parser: serialport.parsers.raw,
            baudrate: 115200
        });
serial_port.write(new Buffer([0x01, 0x03, 0x00, 0x20,220]));
util.puts("write");
//serial_port.read();

serial_port.on("data", function(d){ 
    util.puts("here"); 
    util.puts(d); 
    serial_port.close(); 
});
