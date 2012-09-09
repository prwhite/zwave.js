'use strict';

var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' ).Msg;
var zwClass = require ( './zwclass' ).Class;
var zwHandlers = require ( './zwhandlers' );

var serialport = require ( "SerialPort" );
var SerialPort = serialport.SerialPort;

var Util = require ( 'util' );
var log = require ( './log' ).log;
var opts = require ( './opts' );
var colors = require ( './colors' );

//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////

var Driver = zwClass ( {
    
    initialize: function ( dev )
    {
        this.sPort = null;
        this.queue = [];
        this.state = Driver.Idle;
        this.rbuff = new Buffer ( 0 );  // so we have something to concat with
        this.handlers = zwHandlers.getHandlers ();  // array of id to class.
        
        this.initSerial ( dev );
    },
    
    playInitSequence: function ()
    {
        this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_ZW_GET_VERSION" ) );
        this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_ZW_MEMORY_GET_ID" ) );
        this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES" ) );
        this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_SERIAL_API_GET_CAPABILITIES" ) );
        this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_ZW_GET_SUC_NODE_ID" ) );   
    },
    
    setState: function ( state )
    {
        this.state = state;
        
        this.serviceQueue ();
    },
    
    serviceQueue: function ()
    {
        log ( "Driver.serviceQueue: start, state =".yellow, this.state );

        var msg = null;
    
        if ( ( this.state === Driver.Idle ) && this.queue.length )
        {
            log ( "Driver.serviceQueue: Idle and not empty, really sending message".green );
    
            msg = this.queue.shift ();
            this._sendMsg ( msg );
        }
    },
    
    _enqueueMsg: function ( msg )
    {
        this.queue.push ( msg );
        this.serviceQueue ();
    },
    
    _sendMsg: function ( msg )
    {
            // TODO: use setTimeout to do retry logic in case ack or response doesn't come back.
            //  also need to keep state in driver about what message is current.
            //  also need to keep timeout ids in msg so they can be canceled.
    
        log ( "Driver._sendMsg: ".blue, msg );
        this.setState ( Driver.WaitingAck );
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
        
        while ( this.processRbuff () );
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
        
        switch ( cmd )
        {
            case zwDefs.ACK:
                this.handleAck ();
                good = true;
                break;
            case zwDefs.NAK:
                this.handleNak ();
                good = true;
                break;
            default:   // TODO: get more discerning so we can handle framing errors.
                cursor = this.handleResponse ();
                good = true;
                break;
        }
        
        this.rbuff = this.rbuff.slice ( cursor );
        
        return good && this.rbuff.length;
    },
    
    eatRbuff: function ( howMany )
    {
        this.rbuff = this.rbuff.slice ( howMany );
    },
    
    handleAck: function ()
    {
        this.setState ( Driver.WaitingResult );
    },

    handleNak: function ()
    {
            // TODO: Don't really know how to handle ack yet... might need to eat more
            // of the message, might not.
        log ( "Driver.handleNak: NAK received".red );
        this.setState ( Driver.Idle );
    },
    
    sendAck: function ()
    {
        log ( "Driver.sendAck".green );
        this.sPort.write ( new Buffer ( [ zwDefs.ACK ] ) );
        this.setState ( Driver.Idle );
    },
    
    handleResponse: function ()
    {
        log ( "Driver.handleResponse:".blue, this.rbuff );
        
            // TODO: Find right handler for response and invoke it.
        
        this.sendAck ();
        return this.rbuff.length;   // temp eat everything in the rbuff.
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
Driver.Idle = 0x00;
Driver.WaitingAck = 0x01;
Driver.WaitingResult = 0x02;

exports.Driver = Driver;