
var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' ).Msg;

var serialport = require ( "SerialPort" );
var SerialPort = serialport.SerialPort;
var Util = require ( 'util' );
var log = require ( './log' ).log;

//////

Driver = function ( dev, openCb )
{
    this.sPort = null;
    this.queue = [];
    this.doQueue = true;
    this.openCb = openCb;
    this.state = Driver.Idle;
    
    this.initSerial ( dev, openCb );
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
    if ( this.state === Driver.Idle )
    {
        log ( "Driver: state === Idle, sending msg" );
        this._sendMsg ( msg );
    }
    else
    {
        log ( "Driver: state !== Idle, enqueueing msg" );
        this.queue.push ( msg );
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
//             this._sendMsg ( new Buffer ( [zwDefs.NAK] ) );
//             this._sendMsg ( new Buffer ( [0x01, 0x03, 0x00, 0x20,220] ) );
             if ( this.openCb )
                this.openCb ();
        }).bind ( this ) );
        
        serialPort.on ( "data", ( function ( data ) {
            console.log ( "data = ", data );
            this.dataCb ( data );

            // or
            // You can write to the serial port by sending a string or buffer to the write method as follows:
            //
            // serialPort.write("OMG IT WORKS\r");
        }).bind ( this ) );

    this.sPort = serialPort;
}

exports.Driver = Driver;