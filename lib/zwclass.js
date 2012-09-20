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

// super simple class creation

"use strict";

exports.Class = ( function ()
{
	function shallowClone ( src, dst )
	{
		for ( var key in src )
		{
			if ( src.hasOwnProperty ( key ) )
				dst[ key ] = src[ key ];
		}
	}

	return function ()
	{
		var base, dstObj;
		if ( arguments.length == 1 )
		{
			dstObj = arguments[ 0 ];
		}
		else
		{
			base = arguments[ 0 ];
			dstObj = arguments[ 1 ];
		}

		var dst = function () 
		{
			if( base && base.initialize )
				base.initialize.apply(this, arguments);
		
			this.initialize.apply(this, arguments);
		};
		
		if ( base )
		{
			shallowClone ( base.prototype, dst.prototype );
		}
		shallowClone ( dstObj, dst.prototype );
		return dst;
	}
})();


function unitTest00 ()
{
	var Test = exports.Class ( 
	{
		initialize: function () {},
		
		val: 3
	});

	var test = new Test ();
	console.log ( test.val );

	var Test2 = exports.Class ( Test,
	{
		initialize: function () {},
		
		val2: 6
	});

	var test2 = new Test2 ();
	console.log ( test2.val );
	console.log ( test2.val2 );
}
