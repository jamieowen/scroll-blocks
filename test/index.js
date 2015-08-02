
var test 		= require( 'tape' );
var ScrollBlock = require( '../ScrollBlock' );


test( 'define blocks', function( t ){

	var block = new ScrollBlock( 'rootBlock', 500 );

	var subBlocks = 5;
	var subBlockSize = 500;

	var sub;
	for( var i = 1; i<=subBlocks; i++ ){

		sub = block.add( 'areaBlock' + i , subBlockSize );

		if( i === 1 ){
			for( var j = 1; j<=5; j++ ){
				sub.add( 'areaBlock' + i + '_sub' + j, 100 );
			}
		}

	}

	console.log( block.length() );

	t.equals( block.length(), 3000, 'Length to be set' );

	var current = block.setPosition(1110);
	console.log( 'intersects:', current.name );


	t.end();

});