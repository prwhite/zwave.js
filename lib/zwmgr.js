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
var zwClass = require ( './zwclass' ).Class;
var zwDriver = require ( './zwdriver' );
var zwCommands = require ( './zwcmds' );
var zwNode = require ( './zwnode' ).Node;

var Util = require ( 'util' );
var Events = require ( 'events' );

var async = require ( 'async' );

var log = require ( '../sharedsrv/log' ).log;
var opts = require ( '../sharedsrv/opts' );
var colors = require ( '../sharedsrv/colors' );

opts.setDefault ( "log", true );

var Mgr = zwClass ( {
    initialize: function ()
    {
        this.nodes = [];
        this.emitter = new Events.EventEmitter ();

        zwDriver.init ();
        
        zwDriver.get ().on ( 'driverReady', this._driverReady.bind ( this ) );
    },
    
    on: function ()
    {
        return this.emitter.on.apply ( this.emitter, arguments );
    },
    
    _driverReady: function ( nodeList )
    {
        log ( "Mgr._driverReady: Received driverReady".green );
        this.emitter.emit ( "driverReady", nodeList );
        this.initNodes ( nodeList );
    },

    initNodes: function ( nodeList )
    {
        log ( "*** Starting Mgr.initNodes ***".yellow, nodeList.length );

            // Create Node instances for each id returned in _driverReady.  Don't
            // create new nodes if they already exist in the node list though due
            // to caching or re-initializing.
        for ( var ind = 0; ind < nodeList.length; ++ind )
        {
            var id = nodeList[ ind ];

            if ( ! this.findNodeById ( id ) )
                this.nodes.push ( new zwNode ( id ) );
        }
        
            // Now cue each node to do its init sequence.
        async.forEachSeries ( this.nodes, function ( node, cb ) {
            node.init ( cb );
        }, this._requestGetNodeProtocolInfoCb.bind ( this ) );
    },

    findNodeById: function ( id )
    {
        for ( var ind = 0; ind < this.nodes.length; ++ind )
            if ( this.nodes[ ind ].getId () == id )
                return this.nodes[ ind ];
        return null;
    },
    
    _requestGetNodeProtocolInfoCb: function ( err )
    {
        if ( err )
        {
            log ( "_requestGetNodeProtocolInfoCb ERROR".red, err );
            throw new Error ( err );
        }
        else
        {
            log ( "_requestGetNodeProtocolInfoCb FINISHED".yellow );
        }
    
        log ( "Mgr._requestGetNodeProtocolInfoCb has".magenta, this.nodes.length, "nodes" );
    }
} );

exports.Mgr = Mgr;

exports.init = function ()
{
        // Temporary place for en/disable logging.
    require ( "../sharedsrv/log" ).enabled = opts.get ( "log" );
    
    exports.sMgr = new Mgr ();
}

exports.get = function ()
{
    return exports.sMgr;
}
