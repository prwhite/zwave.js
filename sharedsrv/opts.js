// (c) copyright 2012 Payton R White 

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

"use strict";

var fs = require ( "fs" );
var colors = require ( '../sharedsrv/colors' );
var path = require ( 'path' );

exports.dbg = false;
exports.opts = {};

/**
  * Read in a config file, if one exists, and use its contents to initialize
  * defaults.  The config file should be a well-formed JSON dictionary of option names
  * and values.
  * NOTE: This must come first in an application, or settings will not follow the
  * precedence order cli > config > defaults.
  * @arg name {String} The file name to read under the current user's home directory.
  */

exports.readConfig = function ( name )
{
    var home = process.env[ "HOME" ];
    var fname = path.resolve ( home, name );

    if ( fs.existsSync ( fname ) )
    {
        try {
            console.log ( "Reading config from ".blue + fname.blue );
            var cfg = JSON.parse ( fs.readFileSync ( fname ) );
            exports.opts = cfg;
            exports.cfgFile = fname;
        } catch ( ex ) {
            console.log ( "Could not load config file from $HOME/.zwavejs".red );
        }
    }
}

/**
  * Initialize the options module.
  * This method will evaluate all command line arguments and make their values available using
  * the opts.get method.  Any default that has not been overriden by a command line value will
  * assume the default value set with opts.setDefaults.
  * All calls to opts.setDefaults should be called before this method is called.
  *
  * The module will automatically print out all registered defaults if the command line
  * contains "--help".
  *
  * Usage pattern:
  * 
  * // Global scope.
  * var opts = require ( "opts" );
  * 
  * opts.setDefault ( "--dir", "./" );
  *
  * // Initialize anywhere when all setDefault calls have been made.
  * opts.init ();
  * // Now all opts values are set, combining defaults with overrides from command line.
  *
  * // Use opts values anywhere after init.
  * var directory = opts.get ( "--dir" );
  * 
  */

    // sd == stripDashes
function sd ( src )
{
    return src.replace ( /-/g, "" );
}

exports.init = function()
{
	if ( exports.dbg ) console.log ( "opts:");
	for ( var ind = 2; ind < process.argv.length; )
	{
		var opt = sd ( process.argv[ ind++ ] );
		var val = process.argv[ ind++ ];
		
		if ( ! isNaN ( val * 1 ) ) val = val * 1;		// try to convert to a number
		else if ( val == "true" ) val = true;			// convert to bool
		else if ( val == "false" ) val = false;			// convert to bool
		exports.opts[ opt ] = val;						// if it wasn't changed, it was a string.
		
		if ( exports.dbg ) console.log ( " " + opt + " = " + exports.opts[ opt ] );
		if ( opt == "help" ) exports.help( true );
	}
	
	if ( exports.opts[ "dbg" ] != undefined ) exports.dbg = exports.opts[ "dbg" ];
}

/**
  * Register the default value for an option.  This method will not override a default value that
  * is already set.
  * E.g:
  *    opts.setDefault ( "--numberOfWorkers", 20 ); 	// default is 20
  *    opts.setDefault ( "--numberOfWorkers", 25 ); 	// default is still 20
  */

exports.setDefault = function ( opt, val )
{
    opt = sd ( opt );
	if ( exports.dbg ) console.log ( "def opt: " + opt + " = " + val );
	
	// Only set default if it's not already set.
	if ( exports.opts[ opt ] == undefined ) exports.opts[ opt ] = val;
}


/**
  * Print all registered command line options with their defaults, then optionally exit the process.
  */
exports.help = function ( andExit )
{
	// Dump all of the registered switches with their default values.
	delete exports.opts[ "help" ];

  var argv0 = path.basename ( process.argv[ 1 ] );
  console.log ( argv0 + " command line options:" );
  console.log ( "  values are set with the following precedence:" );
  console.log ( "    command line options > " );
  if ( exports.cfgFile )
    console.log ( "    config options (from ~/" + path.basename ( exports.cfgFile ) + ") > " );
  console.log ( "    built-in defaults " );
  console.log ( "<option> : <currently configured value>" );

  for ( var opt in exports.opts )
  {
    var val = exports.opts[ opt ];

    console.log ( "  --" + opt + " : " + val );
  }

	if ( andExit )
		process.exit(0);
}

/**
  * Get the value of an option.  For this method, you can optionally include the "--" at the beginning
  * of the switch.  
  * E.g:
  *    opts.get ( "--numberOfRetries" );
  */

exports.get = function ( what )
{
	return exports.opts[ sd ( what ) ];
}
