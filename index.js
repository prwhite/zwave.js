#!/usr/bin/env node

var Util = require ( 'util' );

var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' );
var zwDriver = require ( './zwdriver' );
var log = require ( './log' ).log;
var opts = require ( './opts' );

//////////////////////////////////////////////////////////////////////////////////////////

opts.setDefault ( "--dev", "/dev/cu.SLAB_USBtoUART" );

//////////////////////////////////////////////////////////////////////////////////////////

var gDriver = null;

function usage ( argv )
{
    if ( argv.length < 3 )
    {
        console.log ( "usage: node zwave.js <serial port device>" );
        process.exit ( 1 );
    }
}

function main ( argv )
{
    opts.init ();

    gDriver = new zwDriver.Driver ( opts.get ( "--dev" ) );
}


main ( process.argv );
