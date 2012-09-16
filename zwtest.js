//     This file is part of zwave.js.
// 
//     zwave.js is free software: you can redistribute it and/or modify
//     it under the terms of the GNU Lesser General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
// 
//     zwave.js is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU Lesser General Public License for more details.
// 
//     You should have received a copy of the GNU Lesser General Public License
//     along with zwave.js.  If not, see <http://www.gnu.org/licenses/>.

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
