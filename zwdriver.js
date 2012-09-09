
var zwDefs = require ( './zwdefs' ).Defs;
var zwMsg = require ( './zwmsg' ).Msg;

var serialport = require ( "SerialPort" );
var SerialPort = serialport.SerialPort;
var Util = require ( 'util' );


//////

Driver = function ( dev, openCb )
{
    this.sPort = null;
    this.queue = [];
    this.doQueue = true;
    this.openCb = openCb;
    
    this.initSerial ( dev, openCb );
}


Driver.prototype.enqueueMsg = function ( val )
{
    if ( this.doQueue )
        this.queue.push ( val );
    else
        this.sPort.write ( val );
}

Driver.prototype._sendMsg = function ( val )
{
    console.log ( "sendMsg: ", val );
    this.enqueueMsg ( val );
}

Driver.prototype.sendMsg = function ( msg )
{
    if ( ! msg )
    {
        log ( "Driver.sendMsg: null message" );
        return;
    }
    
    msg.finalize ();
    
    this._sendMsg ( msg.getBuffer () );
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