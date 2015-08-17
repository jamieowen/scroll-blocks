
var ScrollTree = require( '../ScrollTree' );

window.onload = function() {

	// Build the tree..
	var tree = new ScrollTree( 'treeRoot' );
	var winBlock,evenBlock,oddBlock;
	var id = 0;
	var childWidth = 600;
	var childHeight = 400;

	var parentBlocks = []; // listen and scroll these.
	parentBlocks.push( tree );

	for( var i = 0; i<10; i++ ){

		winBlock = tree.add( 'win_' + i + (id++), window.innerHeight );

		if( i % 2 === 0 ){
			parentBlocks.push( winBlock );
			for( var j = 0; j<10; j++ ){
				evenBlock = winBlock.add( 'even_' + j + (id++), childHeight );
			}
		}else{
			//oddBlock = winBlock.add( 'odd_' + (id++), childHeight );
		}

	}

	// traverse the tree and create the divs.
	var makeViews = function( domElement, node, childIndex, depth ){

		var ele;
		var ele2;
		ele = document.createElement( 'div' );

		if( node.name === 'treeRoot' ){
			ele.style.position = 'fixed';
			ele.style.width = ele.style.height = '100%';
			ele.style.backgroundColor = '#aaaaaa';

			ele.id = node.name;
			domElement.appendChild( ele );

			node.onParentScroll.add( function( scroll ){
				//console.log( ele.id, scroll );
				ele.style.top = -(scroll * node._csize ) + 'px';
			});

		}else
		if( node.name.indexOf( 'win' ) === 0 ){

			ele.style.position = 'relative';
			ele.style.width = ele.style.height = '100%';
			ele.style.backgroundColor = 'rgb(0,0,' + ( ( childIndex * 20 ) + 50 ) + ')';

			ele.id = node.name;
			domElement.appendChild( ele );

			if( node.children.length ){ // wrap in another div for scrolling center..

				ele2 = document.createElement( 'div' );
				ele.appendChild( ele2 );

				ele2.style.position = 'absolute';
				ele2.style.width = childWidth + 'px';
				ele2.style.height = childHeight + 'px';
				ele2.style.top = '50%';
				ele2.style.left = '50%';
				ele2.style.marginLeft = ( -(childWidth/2) ) + 'px';
				ele2.style.marginTop = ( -(childHeight/2) ) + 'px';
				ele2.style.overflow = 'hidden';

				node.onParentScroll.add( function( scroll ){

					var scroll = (scroll * node._csize );
					ele.scrollTop = scroll;
				});

				ele = ele2;
			}

		}else
		if( node.name.indexOf( 'even' ) === 0 ){
			//ele.style.position = 'absolute';
			ele.style.width = childWidth + 'px';
			ele.style.height = childHeight + 'px';
			ele.style.backgroundColor = 'rgb( ' + ( ( childIndex * 20 ) + 50 ) + ',0,0)';

			ele.id = node.name;
			domElement.appendChild( ele );
		}

		for( var i = 0; i<node.children.length; i++ ) {
			makeViews( ele, node.children[i], i, depth++ );
		}

	};

	makeViews( document.body, tree.root, 0, 0 );


	window.onscroll = function( ev ){
		var position = document.body.scrollTop;
		tree.setPosition( position );

	};
	// set the position at 0
	tree.setPosition( 0 );


	// Set some body stuff and scroll heights.
	document.body.style.margin = document.body.style.padding = '0px';
	document.body.style.height = tree.size + 'px';
};


