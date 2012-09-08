
var zwDefs = require ( './zwdefs' );


exports.Msg = function ( nodeId, msgType, func, cb )
{
    this.nodeId = nodeId;
    this.msgType = msgType;
    this.func = func;
    this.cb = cb;
    this.finalized = false;
    this.len = 4;

    this.buff = [ zwDefs.SOF, 0x00, msgType, func ];    

}

exports.Msg.prototype.finalize = function ()
{
    if ( this.finalized )
        return;
    
    // TODO: encapsulate for multi-message
    
    // TODO: do something with callback (stuff cb ID in message?)
    
    this.buffer[ 1 ] = this.len - 1;    // - 1 ?
    
    // calc checksum
    var chk = 0xff;
    var ind = 0;
    for ( ind = 0; ind < this.len; ++ind )
        chk ^= this.buffer[ ind ];

    this.buffer[ this.len++ ] = chk;
        
    this.finalized = true;
}



