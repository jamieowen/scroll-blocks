

var calcOffsetsAndSize = function( node, position ){

	position = typeof position === 'undefined' ? 0 : position;

	// calculate global starts, ends and child total sizes.
	var cnode;

	node._csize = 0;
	node._tsize = 0;

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

var calcBranchSizes = function( node ){

	// start from leaf nodes and work backwards
	if( node.children.length === 0 ){

		var p = node.parent;

		while( p ){
			p._tsize += p._csize;
			p = p.parent;
		}

	}else{

		for( var i = 0; i<node.children.length; i++ ){
			calcBranchSizes( node.children[i] );
		}
	}

};


var updateTree = function( node, position ){

	calcOffsetsAndSize( node );
	calcBranchSizes( node );

};

module.exports = updateTree;