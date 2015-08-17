

var calcOffsetsAndSize = function( node, position ){

	position = typeof position === 'undefined' ? 0 : position;

	// calculate global starts, ends and child total sizes.
	var cnode;

	node._csize = 0;
	node._tsize = 0;
	node._tstart = 0;
	node._tend = 0;

	for( var i = 0; i<node.children.length; i++ ){
		cnode = node.children[i];

		position = calcOffsetsAndSize( cnode, position );

		cnode._gstart = position;
		cnode._gend = position + cnode.size;
		position = cnode._gend;

		//console.log( 'update : ', cnode.name, position, cnode.size, cnode._gstart, cnode._gend );

		node._csize += cnode.size;

	}

	return position;
};


var sizeRecursive = function( node ){

	// important not to include the supplied node size.
	// weird - but the root does not have a size.
	var size = 0;
	var cnode;
	for( var i = 0; i<node.children.length; i++ ){
		cnode = node.children[i];
		size += cnode.size;
		size += sizeRecursive( cnode );
	}
	return size;
};

var calcBranchSizes = function( node ){

	node._tsize = sizeRecursive( node );

	for( var i = 0; i<node.children.length; i++ ){
		calcBranchSizes( node.children[i] );
	}
};


var updateTree = function( node, position ){

	calcOffsetsAndSize( node );
	calcBranchSizes( node );

};

module.exports = updateTree;