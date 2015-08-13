
var test 	   = require( 'tape' );
var ScrollTree = require( '../ScrollTree' );


test( 'basic demo', function( t ){


	t.end();
	return;

	var tree = new ScrollTree(); // root blocks do not have a size.

	var childDep1_1 = tree.add( 'childDep1_1', 250 );
	var childDep1_2 = tree.add( 'childDep1_2', 250 );

	// add children to second child block.
	var childDep2_1 = childDep1_2.add( 'childDep2_1', 125 );
	var childDep2_2 = childDep1_2.add( 'childDep2_2', 125 );

	var childDep3_1 = childDep2_2.add( 'childDep3_1', 500 );

	var childDep1_3 = tree.add( 'childDep1_3', 250 );

	//  --- 0
	// |   |
	// |   | child 1 - dep 1
	//  --- 250
	// |   | child 2 - sub 1 - dep2
	//  --- 375
	// |   |
	// |   |
	// |   | child 2 - sub 1 -  - - dep3 ( is child of next smaller one but comes first )
	// |   |
	//  --- 875
	// |   | child 2 - sub 2 - dep2
	//  --- 1000
	// |   |
	// |   | child 2 - dep 2 - ( above 2 blocks are children of this but come first )
	//  --- 1250
	// |   |
	// |   | child 3 - dep 1
	//  --- 1500


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
		lastScrolled.push( [ block.name, relativePosition ] );
	};

	// add listeners
	// order is traverse order - not necessarily event order
	[ tree, childDep1_1, childDep2_1, childDep2_2, childDep1_2, childDep1_3 ]
		.map( function( block ){
			block.onScroll.add( onScroll );
			block.onEnter.add( onEnter );
			block.onLeave.add( onLeave );
		}
	);

	var fullSize = 1500;
	t.equals( tree.size(), fullSize, 'Total size is ok' );
	tree.calc();

	t.equals( lastEntered, null, 'Default state' );
	t.equals( lastLeaved, null, 'Default state' );
	t.equals( lastScrolled, null, 'Default state' );

	clearScrolled();
	tree.setPosition( 450 );

	t.equals( lastEntered, 'childDep1_1', 'Entered child dep 1' );
	t.equals( lastLeaved, null, 'Left none' );
	t.equals( lastScrolled, [ 150 / fullSize, 0.5, 0, 0, 0 ] , 'Half way through child dep 1' );

	t.end();

});


test( 'basic single block', function( t ){

	var tree = new ScrollTree( 'root' );
	var child = tree.add( 'child', 500 );

	//t.plan( 6 );

	tree.onScroll.add( function( pos, posNorm ){
		t.equals( pos, 0 );
		t.equals( posNorm, 0 );
	});

	tree.onChildScroll.add( function( pos, posNorm ){
		t.equals( pos, 250 );
		t.equals( posNorm, 0.5 );
	});

	tree.onTreeScroll.add( function( pos, posNorm ){
		t.equals( pos, 250 );
		t.equals( posNorm, 0.5 );
	});

	tree.setPosition( 250 );

	tree.traverse( function( node ){
		console.log( 'node :', node.name, node.size, node._gstart, node._gend, node._csize, node._tsize );
	});

	t.end();

});