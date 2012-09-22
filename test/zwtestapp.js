#!/usr/bin/env node

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

// var Util = require ( 'util' );

// var zwDefs = require ( './zwdefs' ).Defs;
// var zwMsg = require ( './zwmsg' );
var zwMgr = require ( '../lib/zwmgr' );

var log = require ( '../sharedsrv/log' ).log;
var opts = require ( '../sharedsrv/opts' );
var colors = require ( '../sharedsrv/colors' );

//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////

function main ( argv )
{
    opts.init ();
    
    zwMgr.init ();
}

main ( process.argv );
