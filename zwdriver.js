
var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' ).Msg;

var serialport = require ( "SerialPort" );
var SerialPort = serialport.SerialPort;
var Util = require ( 'util' );
var log = require ( './log' ).log;
var opts = require ( './opts' );

//////////////////////////////////////////////////////////////////////////////////////////

opts.setDefault ( "--doQueue", true );

//////////////////////////////////////////////////////////////////////////////////////////

Driver = function ( dev )
{
    this.sPort = null;
    this.queue = [];
    this.doQueue = opts.get ( "--doQueue" );
    this.state = Driver.Idle;
    this.rbuff = new Buffer ( 0 );  // so we have something to concat with
    
    this.initSerial ( dev );
}

Driver.Idle = 0x00;
Driver.WaitingAck = 0x01;
Driver.WaitingResult = 0x02;

Driver.prototype.playInitSequence = function ()
{
    this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_ZW_GET_VERSION" ) );
    this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_ZW_MEMORY_GET_ID" ) );
    this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES" ) );
    this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_SERIAL_API_GET_CAPABILITIES" ) );
    this.sendMsg ( new zwMsg ( 0xff, "REQUEST", "FUNC_ID_ZW_GET_SUC_NODE_ID" ) );   
}

Driver.prototype.setState = function ( state )
{
    this.state = state;
    
        // pop next command off the queue if there is one.
    if ( state === Driver.Idle )
    {
        log ( "Driver.setState: state === Idle, servicing queue" );
        this.serviceQueue ();
    }
}

Driver.prototype.serviceQueue = function ()
{
    var msg = null;

    if ( this.queue.length )
    {
        msg = this.queue.shift ();
        this._sendMsg ( msg );
    }
}

Driver.prototype.enqueueMsg = function ( msg )
{
    if ( this.doQueue )
        this._enqueueMsg ( msg );
    else
        this._sendMsg ( msg );
}

Driver.prototype._enqueueMsg = function ( msg )
{
    this.queue.push ( msg );

    if ( this.state === Driver.Idle )
    {
        log ( "Driver: state === Idle, servicing queue" );
        this.serviceQueue ();
    }
    else
    {
        log ( "Driver: state !== Idle, enqueueing msg" );
    }
}

Driver.prototype._sendMsg = function ( msg )
{
    log ( "sendMsg: ", msg );
    this.setState ( Driver.WaitingAck );
    this.sPort.write ( msg.getBuffer () );
}

Driver.prototype.sendMsg = function ( msg )
{
    if ( ! msg )
    {
        log ( "Driver.sendMsg: null message" );
        return;
    }
    
    msg.finalize ();
    
    this.enqueueMsg ( msg );
}

Driver.prototype.dataCb = function ( data )
{
    this.rbuff = Buffer.concat ( [ this.rbuff, data ] );
    
    while ( this.processRbuff () );
}

Driver.prototype.processRbuff = function ()
{
    if ( ! this.rbuff.length )
    {
        console.log ( "Driver.processRbuff: called with empty rbuff" );
        return false;   // hate this early return
    }
    
    var cursor = 0;
    var good = false;
    var cmd = this.rbuff[ 0 ];
    this.eatRbuff ( 1 );
    
    switch ( cmd )
    {
        case zwDefs.ACK:
            this.handleAck ();
            good = true;
            break;
        default:   // TODO: get more discerning so we can handle framing errors.
            cursor = this.handleResponse ();
            good = true;
            break;
    }
    
    this.rbuff = this.rbuff.slice ( cursor );
    
    return good && this.rbuff.length;
}

Driver.prototype.eatRbuff = function ( howMany )
{
    this.rbuff = this.rbuff.slice ( howMany );
}

Driver.prototype.handleAck = function ()
{
    this.setState ( Driver.WaitingResult );
}

Driver.prototype.sendAck = function ()
{
    log ( "Driver.sendAck" );
    this.sPort.write ( new Buffer ( [ zwDefs.ACK ] ) );
    this.setState ( Driver.Idle );
}

Driver.prototype.handleResponse = function ()
{
    log ( "Driver.handleResponse:", this.rbuff );
    this.sendAck ();
    return this.rbuff.length;   // temp eat everything in the rbuff.
}

Driver.prototype.initSerial = function ( dev )
{
        Util.debug ( "opening dev: " + dev );

        var serialPort = new SerialPort( dev,  { 
            parser: serialport.parsers.raw,
            baudrate: 115200
        });
        
        serialPort.on ( "open", ( function () {
            console.log ( "serial port is open" );
            this.playInitSequence ();
        }).bind ( this ) );
        
        serialPort.on ( "data", ( function ( data ) {
            this.dataCb ( data );
        }).bind ( this ) );

    this.sPort = serialPort;
}

exports.Driver = Driver;