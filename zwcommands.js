

var zwDefs = require ( './zwdefs' ).Defs;
var zwDriver = require ( './zwdriver' );
var zwMsg = require ( './zwmsg' ).Msg;
var zwClass = require ( './zwclass' ).Class;

var log = require ( './log' ).log;
var opts = require ( './opts' );
var colors = require ( './colors' );

//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////

commands = {};

function addCommand ( id, type )
{
    commands[ id ] = type;
}

//////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdZwGetVersion = function ()
{
    zwDriver.get().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_ZW_GET_VERSION" ) );
}

addCommand ( zwDefs.FUNC_ID_ZW_GET_VERSION, function ( msg ) {
    log ( "command: FUNC_ID_ZW_GET_VERSION".magenta, arguments );
} );

//////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdZwMemoryGetId = function ()
{
    zwDriver.get().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_ZW_MEMORY_GET_ID" ) );
}

addCommand ( zwDefs.FUNC_ID_ZW_MEMORY_GET_ID, function ( msg ) {
    log ( "command FUNC_ID_ZW_MEMORY_GET_ID".magenta, arguments );
    
    var buff = msg.getBuffer ();
    
    var homeId = buff.readUInt32BE ( 0 );
    var controllerId = buff.readUInt8 ( 4 );
    
    log ( "command FUNC_ID_ZW_MEMORY_GET_ID, homeId, controllerId".blue, homeId.toString ( 16 ), controllerId );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdZwGetControllerCapabilities = function ()
{
    zwDriver.get().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES" ) );
}

addCommand ( zwDefs.FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES, function ( msg ) {
    log ( "command: FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES".magenta, arguments );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdSerialApiGetCapabilities = function ()
{
    zwDriver.get().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_SERIAL_API_GET_CAPABILITIES" ) );
}

addCommand ( zwDefs.FUNC_ID_SERIAL_API_GET_CAPABILITIES, function ( msg ) {
    log ( "command: FUNC_ID_SERIAL_API_GET_CAPABILITIES".magenta, arguments );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdZwGetSucNodeId = function ()
{
    zwDriver.get().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_ZW_GET_SUC_NODE_ID" ) );   
}

addCommand ( zwDefs.FUNC_ID_ZW_GET_SUC_NODE_ID, function ( msg ) {
    log ( "command: FUNC_ID_ZW_GET_SUC_NODE_ID".magenta, arguments );
} );

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

exports.requestBasicReport = function ()
{

}

addCommand ( zwDefs.BASIC_REPORT, function ( msg ) {
    log ( "handle response: BASIC_REPORT".magenta, arguments );
} );

//////////////////////////////////////////////////////////////////////////////////////////

exports.requestNodeType = function ( nodeId )
{

}

addCommand ( zwDefs.PRW_NODE_TYPE, function ( msg ) {
    log ( "handle response: PRW_NODE_TYPE".magenta, arguments );
} );

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


exports.getCommands = function ()
{
    return commands;
}

