
// super simple class creation

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
