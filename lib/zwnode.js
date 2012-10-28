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

var log = require ( '../sharedsrv/log' ).log;
var opts = require ( '../sharedsrv/opts' );
var colors = require ( '../sharedsrv/colors' );

var Node = zwClass ( {
    initialize: function ( info )
    {
        this.info = undefined;
        this.setInfo ( info );
        this.state = Node.State.Initial;
    },
    
    setInfo: function ( info )
    {
            // TODO maybe other side effects like clearing related caches, etc.
    
        this.info = info;
    },
    
        // Use info block to determine if node is a controller
    isController: function ( info ) 
    {
        return this.info.controller;
    },
    
    init: function ()
    {
        // TODO Will move mgr code to init nodes here.
    }

    
} );

Node.State = {
    Initial: 0,                 /**< Initial state, needs to start query process */
    ProtocolInfo: 1,            /**< Retrieve protocol information */
    WakeUp: 2,                  /**< Start wake up process if a sleeping node*/
    ManufacturerSpecific1: 3,   /**< Retrieve manufacturer name and product ids if ProtocolInfo lets us */
    NodeInfo: 4,                /**< Retrieve info about supported, controlled command classes */
    ManufacturerSpecific2: 5,   /**< Retrieve manufacturer name and product ids */
    Versions: 6,                /**< Retrieve version information */
    Instances: 7,               /**< Retrieve information about multiple command class instances */
    Static: 8,                  /**< Retrieve static information (doesn't change) */
    Associations: 9,            /**< Retrieve information about associations */
    Neighbors: 10,              /**< Retrieve node neighbor list */
    Session: 11,                /**< Retrieve session information (changes infrequently) */
    Dynamic: 12,                /**< Retrieve dynamic information (changes frequently) */
    Configuration: 13,          /**< Retrieve configurable parameter information (only done on request) */
    Complete: 14,               /**< Query process is completed for this node */
    None: 15                    /**< Query process hasn't started for this node */
};


exports.Node = Node;

