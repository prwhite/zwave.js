

var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' ).Msg;
var zwClass = require ( './zwclass' ).Class;

var log = require ( './log' ).log;
var opts = require ( './opts' );
var colors = require ( './colors' );

//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////

handlers = {};

function addHandler ( type, id )
{
    handlers.id = type;
}

//////////////////////////////////////////////////////////////////////////////////////////

Handler = zwClass ( {

} );

BasicReportHandler = zwClass ( Handler, {
    
} );

addHandler ( BasicReportHandler, zwDefs.BASIC_REPORT );

/////////////////////////////////////////////

NodeTypeHandler = zwClass ( Handler, {
    
} );

addHandler ( NodeTypeHandler, 0x20 );

//////////////////////////////////////////////////////////////////////////////////////////

exports.getHandlers = function ()
{
    return handlers;
}

