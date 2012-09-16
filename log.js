
var Util = require ( 'util' );

exports.enabled = true;
exports.sync = false;

exports.log = function ()
{
    if ( exports.enabled )
    {
        if ( exports.sync )
        {
            Util.print.apply ( Util.print, arguments );
            Util.print ( "\n" );
        }
        else
        {
            console.log.apply ( console.log, arguments );
        }
    }
}

exports.trace = function ( msg )
{
    console.trace ( msg );
}
