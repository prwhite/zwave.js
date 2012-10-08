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
var zwNode = require ( './zwnode' );

var Util = require ( 'util' );
var Events = require ( 'events' );

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
        var self = this;
        var ind = 0;
        for ( ; ind < nodeList.length; ++ind )
        {
            ( function ( nodeId )
                {
                    self._enqueueNodeCmd ( function () 
                    {
                        zwCommands.requestGetNodeProtocolInfo ( nodeId, function ( info ) 
                        {
                                // TODO clean this boomerang stuff up
                                // TODO do something with the result
                            log ( "Mgr.initNodes: called back!!!".red );
                            log ( "  node", nodeId, info );

                            self._finishedNodeCmd ();
                        } );
                    } );
                } 
            )( nodeList[ ind ] );
        }
    },
    
    _enqueueNodeCmd: function ( func )
    {
        log ( "Mgr._enqueueNodeCmd: added new command".magenta );
        this.nodeCmdQueue.push ( func );
        this._serviceNodeCmds ();
    },

    _finishedNodeCmd: function ()
    {
        this.nodeCmdCur = null;
        this._serviceNodeCmds ();
    },
    
    _serviceNodeCmds: function ()
    {
        if ( ! this.nodeCmdCur && this.nodeCmdQueue.length )
        {
            log ( "Mgr._serviceNodeCmds: submitting new command".magenta );
            this.nodeCmdCur = this.nodeCmdQueue.shift ();
            this.nodeCmdCur ();
        }
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
