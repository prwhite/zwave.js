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

'use strict';

var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' ).Msg;
var zwClass = require ( './zwclass' ).Class;
var zwCommands = require ( './zwcmds' );

var serialport = require ( "SerialPort" );
var SerialPort = serialport.SerialPort;

var Util = require ( 'util' );
var Events = require ( 'events' );

var log = require ( '../sharedsrv/log' ).log;
var opts = require ( '../sharedsrv/opts' );
var colors = require ( '../sharedsrv/colors' );

//////////////////////////////////////////////////////////////////////////////////////////

opts.setDefault ( "dev", "/dev/ttyUSB0" );

//////////////////////////////////////////////////////////////////////////////////////////

var Driver = zwClass ( {
    
    initialize: function ( dev )
    {
        this.emitter = new Events.EventEmitter ();
    
        this.sPort = null;
        this.queue = [];
        this.curMsg = null;
        this.state = Driver.State.Idle;
        this.rbuff = new Buffer ( 0 );              // so we have something to concat with
        this.commands = zwCommands.getCommands ();  // array of id to class.
        this.homeId = undefined;
        this.controllerType = undefined;
        
        this.initSerial ( dev );
    },
    
    on: function ()
    {
        return this.emitter.on.apply ( this.emitter, arguments );
    },
    
    playInitSequence: function ()
    {
        zwCommands.requestIdZwGetVersion ();
        zwCommands.requestIdZwMemoryGetId ();
        zwCommands.requestIdZwGetControllerCapabilities ();
        zwCommands.requestIdSerialApiGetCapabilities ();
        zwCommands.requestIdZwGetSucNodeId ();
    },
    
    setState: function ( state )
    {
        this.state = state;
        
        this.serviceQueue ();
    },
    
    _setCurMsg: function ( msg ) { this.curMsg = msg; },
    _clearCurMsg: function () { this.curMsg = null; },
    
    serviceQueue: function ()
    {
//         log ( "Driver.serviceQueue: start, state =".yellow, this.state );

        var msg = null;
    
            // If we are not waiting for a response and there's something in the queue, 
            // fire the front of the queue off.
        if ( ( this.state === Driver.State.Idle ) && this.queue.length )
        {
//             log ( "Driver.serviceQueue: Idle and not empty, really sending message".green );
    
            msg = this.queue.shift ();
            this._sendMsg ( msg );
        }
    },
    
    _enqueueMsg: function ( msg )
    {
        // this.queue.push ( msg );

            // Do a stable sort on priority with new commands going to the back.
        var end = this.queue.length;
        var target = msg.getPriority ();
        for ( var ind = 0; ind < end; ++ind )
        {
            if ( target < this.queue[ ind ].getPriority () )
            {
                this.queue.splice ( ind, 0, msg );
                msg = null;
                break;
            }
        }

            // If we didn't do an insert above, then we got to the end, so push the msg.
        if ( msg )
                this.queue.push ( msg );

        this.serviceQueue ();
    },
    
    _sendMsg: function ( msg )
    {
            // TODO: use setTimeout to do retry logic in case ack or response doesn't come back.
            //  also need to keep state in driver about what message is current.
            //  also need to keep timeout ids in msg so they can be canceled.
    
        log ( ">>>>> Driver._sendMsg: ".blue, msg );
        this.setState ( Driver.State.WaitingAck );
        this._setCurMsg ( msg );
        this.sPort.write ( msg.getBuffer () );
    },
    
    sendMsg: function ( msg )
    {
        if ( msg )
        {
            msg.finalize ();
            
            this._enqueueMsg ( msg );
        }
        else
            log ( "Driver.sendMsg: null message".red );
    },
    
    dataCb: function ( data )
    {
        this.rbuff = Buffer.concat ( [ this.rbuff, data ] );
        
//        log ( "Driver.dataCb:".magenta, this.rbuff.length );
    
        while ( this.rbuff.length && this.processRbuff () );
    },
    
    processRbuff: function ()
    {
        if ( ! this.rbuff.length )
        {
            console.log ( "Driver.processRbuff: called with empty rbuff".red );
            return false;   // hate this early return
        }
        
        var cursor = 0;
        var good = false;
        var cmd = this.rbuff[ 0 ];
        this.eatRbuff ( 1 );    // TODO: make this more fault tolerant.
        
//        console.log ( "Driver.processRbuff:".magenta, cmd, this.rbuff.length );
        
        switch ( cmd )
        {
            case zwDefs.ACK:
                this.handleAck ();
                good = true;
                break;
            case zwDefs.SOF:
                cursor = this.handleSof ();
                good = true;
                break;
            case zwDefs.NAK:
                this.handleNak ();
                good = true;
                break;
            case zwDefs.CAN:
                this.handleCan ();
                good = true;
                break;
            default:
                good = false;
                break;
        }
        
        if ( cursor !== 0 )  // optimization to avoid redundant slice at 0 and assignment.
            this.rbuff = this.rbuff.slice ( cursor );
        
        return good;
    },
    
    eatRbuff: function ( howMany )
    {
        this.rbuff = this.rbuff.slice ( howMany );
    },
    
    handleSof: function ()
    {
            // TODO: Don't really know how to handle SOF yet... might need to eat more
            // of the message, might not.
        log ( "<<<<< Driver.handleSof: SOF received".blue );
        this.handleResponse ();
//        this.setState ( Driver.State.Idle );
    },

    handleAck: function ()
    {
        log ( "Driver.handleAck: ACK received".magenta );
        this.setState ( Driver.State.WaitingResult );
    },

    handleNak: function ()
    {
            // TODO: Don't really know how to handle NAK yet... might need to eat more
            // of the message, might not.
        log ( "Driver.handleNak: NAK received".red );
        this.setState ( Driver.State.Idle );
    },

    handleCan: function ()
    {
            // TODO: Don't really know how to handle CAN yet... really need to re-sub
            // whatever command was interrupted.
        log ( "Driver.handleCan: CAN received".red );
        this.setState ( Driver.State.Idle );
    },
    
    sendAck: function ()
    {
        log ( ">>>>> Driver.sendAck".green );
        this.sPort.write ( new Buffer ( [ zwDefs.ACK ] ) );
        this.setState ( Driver.State.Idle );
    },
    
    handleResponse: function ()
    {
        log ( "  Driver.handleResponse:".blue, this.rbuff );
        
        var cursor = 0; // rbuff[ 0 ] is always RESPONSE
        var curMsg = this.curMsg;
        
        var len = this.rbuff.readUInt8 ( [ cursor++ ] );
        var type = this.rbuff.readUInt8 ( [ cursor++ ] );
        var func = this.rbuff.readUInt8 ( [ cursor++ ] );
        
            // Clear curMsg if this response matches it.
        if ( type == zwDefs.REQUEST )
        {
            // TODO Need to handle unsolicited requests here, such as
            // FUNC_ID_ZW_APPLICATION_UPDATE: 0x49 which includes things like
            // UPDATE_STATE_NODE_INFO_RECEIVED (and the rest of the update funcs).
        }
        else if ( func === zwDefs [ this.curMsg.getFunc () ] )
            this._clearCurMsg ();
        else
            log ( "Driver.handleResponse: curMsg.getFunc != response func", this.curMsg.getFunc (), func );
        
//         log ( "Driver.handleResponse: parsed:".blue, len, type, func );
        
        var nodeId = 0x00;  // TODO figure this out
        var msg = new zwMsg ( nodeId, type, func, this.rbuff, curMsg ? curMsg.cb : null );
        
            // find right handler for response and invoke it.
            // turn this into a real message before invoking handler.
        var handler = this.commands[ func ];
        
        if ( handler )
        {
            handler ( msg );
        }
        else
            log ( "Could not find handler func for".red, func.toString ( 16 ) );
        
        this.sendAck ();
        return len;   // temp eat everything in the rbuff.
    },
    
    responseIdZwMemoryGetId: function ( homeId, controllerType )
    {
        this.homeId = homeId;
        this.controllerType = controllerType;
    },

    responseIdZwGetVersion: function ( libraryVersion, libraryType )
    {
        // TODO store args in member variables
    },


    responseIdZwGetControllerCapabilities: function ( controllerCaps )
    {
        // TODO store args in member variables
    },
    
    responseIdSerialApiGetCapabilities: function ( serialApiVer, manufacturerId, productType, productId, apiMask )
    {
        // TODO store args in member variables
        // TODO: send FUNC_ID_SERIAL_API_GET_INIT_DATA
        zwCommands.requestIdSerialApiGetInitData ();
    },
    
    responseIdZwGetSucNodeId: function ( sucNode )
    {
        // TODO store args in member variables
    },
    
    responseIdSerialApiGetInitData: function ( nodeList )
    {
        // TODO store args in member variables
        this.emitter.emit ( 'driverReady', nodeList );
    },
    
    initSerial: function ( dev )
    {
            Util.debug ( "opening dev: ".yellow + dev );
    
            var serialPort = new SerialPort( dev,  { 
                parser: serialport.parsers.raw,
                baudrate: 115200
            });
            
            serialPort.on ( "open", ( function () {
                console.log ( "serial port is open".green );
                this.playInitSequence ();
            }).bind ( this ) );
            
            serialPort.on ( "data", ( function ( data ) {
                this.dataCb ( data );
            }).bind ( this ) );
    
        this.sPort = serialPort;
    }
} );

// Silly zwClass system can't define these in the body of the class above.  :(
Driver.State = {
    Idle: 0x00,
    WaitingAck: 0x01,
    WaitingResult: 0x02
};

exports.Driver = Driver;

exports.init = function ()
{
    exports.sDriver = new Driver ( opts.get ( "--dev" ) );
};

exports.get = function ()
{
    return exports.sDriver;
};
