

var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' ).Msg;
var zwClass = require ( './zwclass' ).Class;

var log = require ( './log' ).log;
var opts = require ( './opts' );
var colors = require ( './colors' );

//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////

commands = {};

function addCommand ( type, id )
{
    commands.id = type;
}

//////////////////////////////////////////////////////////////////////////////////////////

Handler = zwClass ( {

} );

BasicReportHandler = zwClass ( Handler, {
    
} );

addCommand ( BasicReportHandler, zwDefs.BASIC_REPORT );

/////////////////////////////////////////////

NodeTypeHandler = zwClass ( Handler, {
    
} );

addCommand ( NodeTypeHandler, 0x20 );

//////////////////////////////////////////////////////////////////////////////////////////

exports.getCommands = function ()
{
    return commands;
}

