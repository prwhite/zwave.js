#!/usr/bin/env node

var Util = require ( 'util' );

var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' );
var zwDriver = require ( './zwdriver' );
var log = require ( './log' ).log;

/////

var gDriver = null;

function usage ( argv )
{
    if ( argv.length < 3 )
    {
        console.log ( "usage: node zwave.js <serial port device>" );
        process.exit ( 1 );
    }
}

function openCb ()
{
    log ( "openCb" );

    gDriver.sendMsg ( new zwMsg.Msg ( 0xff, "REQUEST", "FUNC_ID_ZW_GET_VERSION" ) );
    gDriver.sendMsg ( new zwMsg.Msg ( 0xff, "REQUEST", "FUNC_ID_ZW_MEMORY_GET_ID" ) );
    gDriver.sendMsg ( new zwMsg.Msg ( 0xff, "REQUEST", "FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES" ) );
    gDriver.sendMsg ( new zwMsg.Msg ( 0xff, "REQUEST", "FUNC_ID_SERIAL_API_GET_CAPABILITIES" ) );
    gDriver.sendMsg ( new zwMsg.Msg ( 0xff, "REQUEST", "FUNC_ID_ZW_GET_SUC_NODE_ID" ) );   
}

function main ( argv )
{
    usage ( argv );

    gDriver = new zwDriver.Driver ( argv[ 2 ], openCb );
}


main ( process.argv );
