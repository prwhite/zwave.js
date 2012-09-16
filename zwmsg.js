
var zwDefs = require ( './zwdefs' ).Defs;
var zwClass = require ( './zwclass' ).Class;

var log = require ( './log' ).log;
var opts = require ( './opts' );
var colors = require ( './colors' );

var Msg = zwClass ( {
    initialize: function ()
    {
        this.nodeId = undefined;
        this.msgType = arguments[ 1 ];
        this.func = undefined;
        this.cb = undefined;
        this.finalized = false;
        this.len = undefined;
        this.buff = undefined;

            // this is silly... fake overloading the constructor based on whether it's 
            // a request or response.
        if ( this.msgType == zwDefs.REQUEST )
            this.initializeRequest.apply ( this, arguments );
        else if ( this.msgType == zwDefs.RESPONSE )
            this.initializeResponse.apply ( this, arguments );
        else
        {
            log ( "Msg.initialize: Error, unknown msg type =", this.msgType.toString ( 16 ) );
            require ( "./log" ).trace ( "Msg.initialize" );
        }
    },

    initializeRequest: function ( nodeId, msgType, func, cb )
    {
        this.nodeId = nodeId;
//        this.msgType = msgType;   // redundant from real constructor
        this.func = func;
        this.cb = cb;
        this.len = 4;
        this.buff = [];
    
            // switch the string msgType and func to their associated IDs.
            // we keep things as strings for as long as possible to help with logging.
        msgType = zwDefs[ msgType ];
        func = zwDefs[ func ];
    
        this._appendBytes ( zwDefs.SOF, 0x00, msgType, func );
    
    //    log ( "Msg.Msg:", this.buff );
    },
    
    initializeResponse: function ( len, msgType, func, buff )
    {
        log ( "Msg.initializeResponse called!".red );
        
        this.nodeId = undefined;
//        this.msgType = msgType;   // redundant from real constructor
        this.func = func;
        this.len = len;
        this.buff = buff;
    },
    
    finalize: function ()
    {
        if ( this.finalized )
            return;
        
        // TODO: encapsulate for multi-message
        
        // TODO: do something with callback (stuff cb ID in message?)
        
        this.buff[ 1 ] = this.len - 1;    // - 1 ?
        
        // calc checksum
        var chk = 0xff;
        var ind = 1;
        for ( ind = 1; ind < this.len; ++ind )
            chk ^= this.buff[ ind ];
    
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

