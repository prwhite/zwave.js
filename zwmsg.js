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

var log = require ( './log' ).log;
var opts = require ( './opts' );
var colors = require ( './colors' );

var Msg = zwClass ( {
    initialize: function ()
    {
        this.nodeId = 0xff;
        this.msgType = arguments[ 1 ];
        this.func = undefined;
        this.cb = undefined;
        this.finalized = false;
        this.buff = undefined;

            // this is silly... fake overloading the constructor based on whether it's 
            // a request or response.
        if ( this.msgType == zwDefs.REQUEST )
            this._initializeRequest.apply ( this, arguments );
        else if ( this.msgType == zwDefs.RESPONSE )
            this._initializeResponse.apply ( this, arguments );
        else
        {
            log ( "Msg.initialize: Error, unknown msg type =", this.msgType.toString ( 16 ) );
            require ( "./log" ).trace ( "Msg.initialize" );
        }
    },

    _initializeRequest: function ( nodeId, msgType, func, cb )
    {
        this.nodeId = nodeId;
//        this.msgType = msgType;   // redundant from real constructor
        this.func = func;
        this.cb = cb;
        this.buff = [];
    
            // switch the string msgType and func to their associated IDs.
            // we keep things as strings for as long as possible to help with logging.
//        msgType = zwDefs[ msgType ];
        func = zwDefs[ func ];
    
        this._appendBytes ( zwDefs.SOF, 0x00, msgType, func );
    
    //    log ( "Msg.Msg:", this.buff );
    },
    
    _initializeResponse: function ( len, msgType, func, buff )
    {
//        log ( "Msg._initializeResponse called!".red );

            // make sure checksum is cool
        var chk = this._calcChecksum ( buff.slice ( 0, buff.length - 1 ) );
        var msgChk = buff[ buff.length - 1 ];
        
        if ( chk != msgChk )
            log ( "Msg._initializeResponse: Message failed checksum:".red, chk, msgChk, buff );
        
//        this.msgType = msgType;   // redundant from real constructor
        this.func = func;
        this.buff = buff.slice ( 3 );
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
        var ind = 0;
        for ( ind = 0; ind < arguments.length; ++ind )
            this.buff.push ( arguments[ ind ] );
    },
    
    getBuffer: function ()
    {
        return new Buffer ( this.buff );
    },
    
    getFunc: function ()
    {
        return this.func;
    },
    
    dbg: function ( txt )
    {
        log ( "Mgs.dbg: ".magenta, this.nodeId, this.msgType, this.func, txt );
    }
} );

exports.Msg = Msg;

