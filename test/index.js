
var test 		= require( 'tape' );
var ScrollBlock = require( '../ScrollBlock' );


test( 'basic demo', function( t ){

	var rootBlock = new ScrollBlock( 'rootBlock' ); // root blocks do not have a size.

	var childDep1_1 = rootBlock.add( 'childDep1_1', 300 );
	var childDep1_2 = rootBlock.add( 'childDep1_2', 300 );

	// add children to second child block.
	var childDep2_1 = childDep1_2.add( 'childDep2_1', 100 );
	var childDep2_2 = childDep1_2.add( 'childDep2_2', 100 );

	var childDep1_3 = rootBlock.add( 'childDep1_3', 300 );

	var lastEntered = null;
	var lastLeaved = null;
	var lastScrolled = null;

	// will capture positions of all scrolled blocks.
	// a setPosition call should trigger onScroll on all blocks.
	var clearScrolled = function(){
		lastScrolled = [];
	};

	var onEnter = function( block ){
		lastEntered = block.name;
	};

	var onLeave = function( block ) {
		lastLeaved = block.name;
	};

	var onScroll = function( block, relativePosition, globalPosition ){
		lastScrolled.push( relativePosition );
	};

	// add listeners
	// order is traverse order - not necessarily event order
	[ rootBlock, childDep1_1, childDep2_1, childDep2_2, childDep1_2, childDep1_3 ]
		.map( function( block ){
			block.onScroll.add( onScroll );
			block.onEnter.add( onEnter );
			block.onLeave.add( onLeave );
		}
	);

	var fullSize = 1100;
	t.equals( rootBlock.size(), fullSize, 'Total size is ok' );
	rootBlock.calc();

	t.equals( lastEntered, null, 'Default state' );
	t.equals( lastLeaved, null, 'Default state' );
	t.equals( lastScrolled, null, 'Default state' );

	clearScrolled();
	rootBlock.setPosition( 450 );

	t.equals( lastEntered, 'childDep1_1', 'Entered child dep 1' );
	t.equals( lastLeaved, null, 'Left none' );
	t.equals( lastScrolled, [ 150 / fullSize, 0.5, 0, 0, 0 ] , 'Half way through child dep 1' );

	t.end();

});