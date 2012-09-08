#!/usr/bin/env node

var serialport = require ( "SerialPort" );
var SerialPort = serialport.SerialPort;
var Util = require ( 'util' );

var zwDefs = require ( './zwdefs' );
var zwMsg = require ( './zwmsg' );

//////

var gQueue = [];
var gSerialPort = null;
var gDoQueue = false;

//////


function usage ( argv )
{
    if ( argv.length < 3 )
    {
        console.log ( "usage: node zwave.js <serial port device>" );
        process.exit ( 1 );
    }
}

function enqueueMsg ( val )
{
    if ( gDoQueue )
        gQueue.push ( val );
    else
        gSerialPort.write ( val );
}

function _sendMsg ( val )
{
    console.log ( "sendMsg: ", val );
    enqueueMsg ( val );
}

function sendMsg ( nodeId, msgType, func, cb )
{
    
}

function initSerial ( dev, dataCb )
{
        Util.debug ( "opening dev: " + dev );

        var serialPort = new SerialPort( dev,  { 
            parser: serialport.parsers.raw,
            baudrate: 115200
        });
        
        serialPort.on ( "open", function () {
             console.log ( "serial port is open" );
//             _sendMsg ( new Buffer ( [zwDefs.NAK] ) );
             _sendMsg ( new Buffer ( [0x01, 0x03, 0x00, 0x20,220] ) );
        });
        
        serialPort.on ( "data", function ( data ) {
            console.log ( "data = ", data );
            if ( dataCb )
                dataCb ( data );

        // or
        // You can write to the serial port by sending a string or buffer to the write method as follows:
        //
        // serialPort.write("OMG IT WORKS\r");

        });
        
        gSerialPort = serialPort;
}

function main ( argv )
{
    usage ( argv );

    initSerial ( argv[ 2 ] );
}


main ( process.argv );
