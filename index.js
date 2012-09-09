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
    gDriver.playInitSequence ();
}

function main ( argv )
{
    usage ( argv );

    gDriver = new zwDriver.Driver ( argv[ 2 ], openCb );
}


main ( process.argv );
