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

var Msg = zwClass ( {
    initialize: function ( nodeId, msgType, func, buff, cb )
    {
        log ( "Msg.initialize called!".cyan );

        this.nodeId = nodeId;
        this.msgType = msgType;
        this.func = func;
        this.cb = cb;
        this.finalized = buff ? true : false;
        this.buff = buff || new Buffer ( 0 );

            // switch the string msgType and func to their associated IDs.
            // we keep things as strings for as long as possible to help with logging.
            // sometimes, IDs are passed in, like when we receive a request from a
            // node, so we sniff the type with isNaN.
        if ( isNaN ( func ) )
            func = zwDefs[ func ];

            // if a valid buff is passed in, we assume this is a received message and
            // needs to be parsed, etc.  So, we'll do the checksum
        if ( buff )
        {
                // make sure checksum is cool
            var chk = this._calcChecksum ( buff.slice ( 0, buff.length - 1 ) );
            var msgChk = buff[ buff.length - 1 ];
            
            if ( chk != msgChk )
                log ( "Msg._initializeResponse: Message failed checksum:".red, chk, msgChk, buff );

            this.buff = buff.slice ( 3 );
        }
        else
            this._appendBytes ( zwDefs.SOF, 0x00, msgType, func );
    },

    _calcChecksum: function ( buff )
    {
        var chk = 0xff;
        var ind = 0;
        for ( ; ind < buff.length; ++ind )
            chk ^= buff[ ind ];
        return chk;
    },
    
    finalize: function ()
    {
        if ( this.finalized )
            return;

        // TODO: encapsulate for multi-message
        
        // TODO: do something with callback (stuff cb ID in message?)
        
        this.buff[ 1 ] = this.buff.length - 1;
        
        // calc checksum
        var chk = this._calcChecksum ( this.buff.slice ( 1 ) );
    
        this._appendBytes ( chk );
           
        this.dbg ( this.getBuffer () );
         
        this.finalized = true;
    },
    
    _appendBytes: function ()
    {
        var tbuff = new Buffer ( arguments.length );

        var ind = 0;
        for ( ind = 0; ind < arguments.length; ++ind )
            tbuff.writeUInt8 ( arguments[ ind ], ind );

        this.buff = Buffer.concat ( [this.buff, tbuff] );
    },
    
    getBuffer: function ()
    {
        return new Buffer ( this.buff );
    },
    
    getFunc: function ()
    {
        return this.func;
    },
    
    doCb: function ()
    {
        if ( this.cb ) this.cb.apply ( this, arguments );
    },
    
    dbg: function ( txt )
    {
        log ( "Mgs.dbg: ".magenta, this.nodeId, this.msgType, this.func, txt );
    }
} );

exports.Msg = Msg;

