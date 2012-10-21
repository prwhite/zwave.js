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

var Mgr = zwClass ( {
    initialize: function ()
    {
        this.nodes = [];
        this.emitter = new Events.EventEmitter ();
        this.nodeCmdQueue = [];
        this.nodeCmdCur = null;

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
        log ( "*** Starting Mgr.initNodes ***".yellow );
        
        var self = this;

        this._enqueueNodeCmd ( function () {
            async.forEachSeries ( nodeList, function ( item, cb ) {
                zwCommands.requestGetNodeProtocolInfo ( item, ( function ( nodeId, info ) {
                        log ( "Mgr.initNodes got node result:".magenta );

                        info.id = nodeId;

                        self._addNode ( info )

                        cb ();
                } ).bind ( zwCommands, item ) );
            }, this._requestGetNodeProtocolInfoCb.bind ( self ) );
        } );
    },
    
    _enqueueNodeCmd: function ( func )
    {
        log ( "Mgr._enqueueNodeCmd: added new command".magenta );
        this.nodeCmdQueue.push ( func );
        this._serviceNodeCmds ();
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

        this._finishedNodeCmd ();
    
        log ( "Mgr._requestGetNodeProtocolInfoCb has".magenta, this.nodes.length, "nodes" );
    },

    _addNode: function ( info )
    {
        log ( "Mgr._addNode:".blue, info );

        var node = null;
        if ( ! this.nodes[ info.id ] )
        {
            node = new zwNode ( info );
            this.nodes.push ( node )
        }
        else
        {
            node = this.nodes[ info.id ];
            node.setInfo ( info );
        }
    },
    
    _serviceNodeCmds: function ()
    {
        if ( ! this.nodeCmdCur && this.nodeCmdQueue.length )
        {
            log ( "Mgr._serviceNodeCmds: submitting new command".magenta );
            this.nodeCmdCur = this.nodeCmdQueue.shift ();
            this.nodeCmdCur ();
        }
        else
        {
            log ( "Mgr._serviceNodeCmds: no more commands for now".magenta );
        }
    },
    
    _finishedNodeCmd: function () {
        this.nodeCmdCur = null;
        this._serviceNodeCmds ();
    }

} );

exports.Mgr = Mgr;

exports.init = function ()
{
    exports.sMgr = new Mgr ();
}

exports.get = function ()
{
    return exports.sMgr;
}
