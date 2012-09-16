#!/usr/bin/env node

// var Util = require ( 'util' );

// var zwDefs = require ( './zwdefs' ).Defs;
// var zwMsg = require ( './zwmsg' );
var zwDriver = require ( './zwdriver' );

var log = require ( './log' ).log;
var opts = require ( './opts' );
var colors = require ( './colors' );

//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////

function main ( argv )
{
    opts.init ();
    
    zwDriver.init ();
    
    zwDriver.get ().on ( 'driverReady', function () {
        log ( "main: Received driverReady".green );
    } );
}

main ( process.argv );
