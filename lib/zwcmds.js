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

var zwDefs = require ( './zwdefs' ).Defs;
var zwDriver = require ( './zwdriver' );
var zwMsg = require ( './zwmsg' ).Msg;
var zwClass = require ( './zwclass' ).Class;

var log = require ( '../sharedsrv/log' ).log;
var opts = require ( '../sharedsrv/opts' );
var colors = require ( '../sharedsrv/colors' );

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var zwControllerTypes = 
[
	"Unknown",			        // library type 0
	"Static Controller",		// library type 1
	"Controller",       		// library type 2
	"Enhanced Slave",   		// library type 3
	"Slave",            		// library type 4
	"Installer",			    // library type 5
	"Routing Slave",		    // library type 6
	"Bridge Controller",    	// library type 7
	"Device Under Test",		// library type 8
];

var zwControllerCaps = 
{
    ControllerCaps_Secondary: 0x01,		/**< The controller is a secondary. */
    ControllerCaps_OnOtherNetwork: 0x02,		/**< The controller is not using its default HomeID. */
    ControllerCaps_SIS: 0x04,		/**< There is a SUC ID Server on the network. */
    ControllerCaps_RealPrimary: 0x08,		/**< Controller was the primary before the SIS was added. */
    ControllerCaps_SUC: 0x10		/**< Controller is a static update controller. */
};

var zwNumNodeBitfieldBytes = 29;    // 29 bytes = 232 bits, one for each possible node.

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/*

    // command send / recv template

exports.requestxxx = function ()
{

}

addCommand ( zwDefs.xxx, function ( msg ) {
    log ( "handle response: xxx".magenta );
} );


*/
//////////////////////////////////////////////////////////////////////////////////////////

var commands = {};

function addCommand ( id, type )
{
    commands[ id ] = type;
}

function readStringFromBuff ( startInd, buff )
{
    var ind = startInd;
    var out = "";
    for ( ; ind < buff.length; ++ind )
    {
        if ( buff[ ind ] != 0 )
            out += String.fromCharCode ( buff[ ind ] );
        else
            return out;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdZwGetVersion = function ()
{
    zwDriver.get ().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_ZW_GET_VERSION" ) );
}

addCommand ( zwDefs.FUNC_ID_ZW_GET_VERSION, function ( msg ) {
    log ( "  command: FUNC_ID_ZW_GET_VERSION".magenta );
    
    var buff = msg.getBuffer ();
    var libraryVersion = readStringFromBuff ( 0, buff );
    var libraryType = buff[ libraryVersion.length + 1 ];
    
    zwDriver.get ().responseIdZwGetVersion ( libraryVersion, libraryType );
    
    log ( "    command: FUNC_ID_ZW_GET_VERSION libraryVersion, libraryType = done".blue, libraryVersion, libraryType );
} );

//////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdZwMemoryGetId = function ()
{
    zwDriver.get ().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_ZW_MEMORY_GET_ID" ) );
}

addCommand ( zwDefs.FUNC_ID_ZW_MEMORY_GET_ID, function ( msg ) {
    log ( "  command FUNC_ID_ZW_MEMORY_GET_ID".magenta );
    
    var buff = msg.getBuffer ();
    
    var homeId = buff.readUInt32BE ( 0 );
    var controllerType = buff.readUInt8 ( 4 );
    
    if ( zwControllerTypes[ controllerType ] )
        controllerType = zwControllerTypes[ controllerType ];
    
    zwDriver.get ().responseIdZwMemoryGetId ( homeId, controllerType );
    
    log ( "    command FUNC_ID_ZW_MEMORY_GET_ID, homeId, controllerType done".blue, homeId.toString ( 16 ), controllerType );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdZwGetControllerCapabilities = function ()
{
    zwDriver.get ().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES" ) );
}

addCommand ( zwDefs.FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES, function ( msg ) {
    log ( "  command: FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES".magenta );
    
    var buff = msg.getBuffer ();
    
    var controllerCaps = buff[ 0 ];
    
    if ( controllerCaps & zwControllerCaps.ControllerCaps_SIS )
    {
        log ( "    command: FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES: there is SUC ID Server (SIS) in this network" );
        log ( "      The controller is an inclusion", 
                ( controllerCaps & zwControllerCaps.ControllerCaps_SUC ) ? "SUC" : "controller", 
                ( controllerCaps & zwControllerCaps.ControllerCaps_OnOtherNetwork ) ? "using another network's Home ID" : "",
                ( controllerCaps & zwControllerCaps.ControllerCaps_RealPrimary ) ? "was the original primary before the SIS was added." : "." );
    }
    else
    {
        log ( "    command: FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES: there is no SUC ID Server (SIS) in this network" );
        log ( "      The controller is a", 
                ( controllerCaps & zwControllerCaps.ControllerCaps_Secondary ) ? "secondary" : "primary", 
                ( controllerCaps & zwControllerCaps.ControllerCaps_SUC ) ? "SUC" : "controller", 
                ( controllerCaps & zwControllerCaps.ControllerCaps_OnOtherNetwork ) ? "using another network's Home ID." : "." );
    }

    zwDriver.get ().responseIdZwGetControllerCapabilities ( controllerCaps );

    log ( "    command: FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES done".blue );    
} );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdSerialApiGetCapabilities = function ()
{
    zwDriver.get ().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_SERIAL_API_GET_CAPABILITIES" ) );
}

addCommand ( zwDefs.FUNC_ID_SERIAL_API_GET_CAPABILITIES, function ( msg ) {
    log ( "  command: FUNC_ID_SERIAL_API_GET_CAPABILITIES".magenta );

    var buff = msg.getBuffer ();
    
    var serialApiVer = buff.readUInt8 ( 0 ).toString () + "." + buff.readUInt8 ( 1 ).toString ();
    var manufacturerId = buff.readUInt16BE ( 2 );
    var productType = buff.readUInt16BE ( 4 );
    var productId = buff.readUInt16BE ( 6 );
    var apiMask = buff.slice ( 8, 8 + 32 );

    log ( "    command: FUNC_ID_SERIAL_API_GET_CAPABILITIES: serialApiVer, manufacturerId, productType, productId, apiMask:",
        serialApiVer, manufacturerId, productType, productId, apiMask );

    zwDriver.get ().responseIdSerialApiGetCapabilities ( serialApiVer, manufacturerId, productType, productId, apiMask );

    log ( "    command: FUNC_ID_SERIAL_API_GET_CAPABILITIES done".blue );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdZwGetSucNodeId = function ()
{
    zwDriver.get ().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_ZW_GET_SUC_NODE_ID" ) );
}

addCommand ( zwDefs.FUNC_ID_ZW_GET_SUC_NODE_ID, function ( msg ) {
    log ( "  command: FUNC_ID_ZW_GET_SUC_NODE_ID".magenta );

    var buff = msg.getBuffer ();

    var sucNode = buff[ 0 ];
    
    log ( "    command: FUNC_ID_ZW_GET_SUC_NODE_ID: sucNode ID =", sucNode );
    
    zwDriver.get ().responseIdZwGetSucNodeId ( sucNode );

    log ( "    command: FUNC_ID_ZW_GET_SUC_NODE_ID done".blue );
} );

//////////////////////////////////////////////////////////////////////////////////////////

exports.requestIdSerialApiGetInitData = function ()
{
    zwDriver.get ().sendMsg ( new zwMsg ( 0xff, zwDefs.REQUEST, "FUNC_ID_SERIAL_API_GET_INIT_DATA" ) );
}

addCommand ( zwDefs.FUNC_ID_SERIAL_API_GET_INIT_DATA, function ( msg ) {
    log ( "  command: FUNC_ID_SERIAL_API_GET_INIT_DATA".magenta );

    var buff = msg.getBuffer ();

    var initVersion = buff[ 0 ];
    var initCaps = buff[ 1 ];
    var numNodeBitfieldBytes = buff[ 2 ];
    var byte = 0;
    var byteVal = 0;
    var bit = 0;
    var curNode = 1;    // 1-based. (?)
    var out = [];
    
    if ( numNodeBitfieldBytes == zwNumNodeBitfieldBytes )
    {
        log ( "    determining available nodes".yellow );
        
        for ( byte = 0; byte < numNodeBitfieldBytes; ++byte )
        {
            byteVal = buff[ byte + 3 ];
        
            for ( bit = 0; bit < 8; ++bit )
            {
                    // Node is present.
                if ( byteVal & 1 << bit )
                {
                        // TODO handle something about virtual nodes.
                    
                    out.push ( curNode );
                }
                else
                {
                        // TODO: Clear cache of any nodes that are no longer present...
                        //   or maybe we do that at a higher level.
                }
            
                ++curNode;
            }
        }
    }

    log ( "    !!!!! Nodes found:".green.bold, out );

    zwDriver.get ().responseIdSerialApiGetInitData ( out );

    log ( "    command: FUNC_ID_SERIAL_API_GET_INIT_DATA done".blue );
} );

//////////////////////////////////////////////////////////////////////////////////////////
// 0x01, 0x04, 0x00, 0x41, node id, checksum

exports.requestGetNodeProtocolInfo = function ( nodeId, cb )
{
    var msg = new zwMsg ( nodeId, zwDefs.REQUEST, "FUNC_ID_ZW_GET_NODE_PROTOCOL_INFO", cb );
    msg._appendBytes ( [ nodeId ] );
    zwDriver.get ().sendMsg ( msg );
}

// <Buffer 09  01 41 92 16 00 02 02 01 33>
// <Buffer           92 16 00 02 02 01 33> === buff
// b0 = flags
// b1 = flags
// b2 = 
// b3 = basic type
// b4 = generic type
// b5 = specific type
addCommand ( zwDefs.FUNC_ID_ZW_GET_NODE_PROTOCOL_INFO, function ( msg ) {
    log ( "  command: FUNC_ID_ZW_GET_NODE_PROTOCOL_INFO".magenta );
    
    var buff = msg.getBuffer ();
    
    log ( "  !!! msg.cb = " + msg.cb, buff );
    
        // TODO if generic type is 00, then we have bogus device
    
    var info = {};
    info[ "type" ] = buff[ 4 ];

    msg.doCb ( info );
    
    log ( "    command: FUNC_ID_ZW_GET_NODE_PROTOCOL_INFO done".blue );
} );

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


exports.getCommands = function ()
{
    return commands;
}

