exports.dbg = false;
exports.opts = {};


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
exports.init = function()
{
	if ( exports.dbg ) console.log ( "opts:");
	for ( var ind = 2; ind < process.argv.length; )
	{
		var opt = process.argv[ ind++ ];
		var val = process.argv[ ind++ ];
		
		if ( ! isNaN ( val * 1 ) ) val = val * 1;		// try to convert to a number
		else if ( val == "true" ) val = true;			// convert to bool
		else if ( val == "false" ) val = false;			// convert to bool
		exports.opts[ opt ] = val;						// if it wasn't changed, it was a string.
		
		if ( exports.dbg ) console.log ( " " + opt + " = " + exports.opts[ opt ] );
		if ( opt == "--help" ) exports.help();
	}
	
	if ( exports.opts[ "--dbg" ] != undefined ) exports.dbg = exports.opts[ "--dbg" ];
}

/**
  * Register the default value for a switch.  This method will not override a default value that
  * is already set.
  * E.g:
  *    opts.setDefault ( "--numberOfWorkers", 20 ); 	// default is 20
  *    opts.setDefault ( "--numberOfWorkers", 25 ); 	// default is still 20
  */

exports.setDefault = function ( opt, val )
{
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
	console.log(exports.opts);
	if ( andExit )
		process.exit(0);
}

/**
  * Get the value of an option.  For this method, you should include the "--" at the beginning
  * of the switch.  
  * E.g:
  *    opts.get ( "--numberOfRetries" );
  */

exports.get = function ( what )
{
	return exports.opts[ what ];
}
