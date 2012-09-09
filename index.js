#!/usr/bin/env node

var Util = require ( 'util' );

var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' );
var zwDriver = require ( './zwdriver' );
var log = require ( './log' ).log;
var opts = require ( './opts' );
var colors = require ( './colors' );

//////////////////////////////////////////////////////////////////////////////////////////

opts.setDefault ( "--dev", "/dev/cu.SLAB_USBtoUART" );

//////////////////////////////////////////////////////////////////////////////////////////

var gDriver = null;

function main ( argv )
{
    opts.init ();

    gDriver = new zwDriver.Driver ( opts.get ( "--dev" ) );
}


main ( process.argv );
