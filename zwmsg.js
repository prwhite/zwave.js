
var zwDefs = require ( './zwdefs' ).Defs;
var log = require ( './log' ).log;


Msg = function ( nodeId, msgType, func, cb )
{
    this.nodeId = nodeId;
    this.msgType = msgType;
    this.func = func;
    this.cb = cb;
    this.finalized = false;
    this.len = 4;
    this.buff = [];

        // switch the string msgType and func to their associated IDs.
        // we keep things as strings for as long as possible to help with logging.
    msgType = zwDefs[ msgType ];
    func = zwDefs[ func ];

    this._appendBytes ( zwDefs.SOF, 0x00, msgType, func );

//    log ( "Msg.Msg:", this.buff );
}

Msg.prototype.finalize = function ()
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
}

Msg.prototype._appendBytes = function ()
{
    var ind = 0;
    for ( ind = 0; ind < arguments.length; ++ind )
        this.buff.push ( arguments[ ind ] );
}

Msg.prototype.getBuffer = function ()
{
    return new Buffer ( this.buff );
}

Msg.prototype.dbg = function ( txt )
{
    log ( "msg: ".magenta, this.nodeId, this.msgType, this.func, txt );
}


exports.Msg = Msg;

