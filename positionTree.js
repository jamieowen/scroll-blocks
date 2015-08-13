var traverse = function( block, position ){

	var b;

	for( var i = 0; i<block.children.length; i++ ){
		b = block.children[i];

		// traverse children straight away.
		// they are scrolled first.
		traverse( b, position );

		console.log( 'PASS:', b.name,  position, 's/e', pass.pos, pass.pos + b._size );
		// if we already have found a block, the scroll position is before us.
		// so all children would be scroll position = 0
		if( pass.found ){
			b.position = 0;
			b.onScroll.dispatch( b, b.position );
		}else
		if( position >= pass.pos && position < (pass.pos + b._size) ){
			// this is the containing block of the scroll position
			// calculate the local offset.
			pass.found = b;
			// position relative to block
			b.position = ( position - pass.pos ) / b._size;

			// NEED TO DISPATCH 3 POSITIONS.
			// 1. The relative position to the current block.
			// 2. The relative position to the parent block at the length of its immediate children
			// 3. The relative position to the parent block at the length of every child recursively.

			console.log( 'FOUND : ', b.name );
			var p = b.parent;
			var childScroll,treeScroll;
			while( p ){

				treeScroll = p.size( true );
				childScroll = p.size( false );

				// NEED TO HANDLE THE POSITION ON PARENT BRANCHES
				// WHERE THE treeScroll value is greater than the child scroll
				// which means there is nested trees
				console.log( 'PARENT : ', p.name, treeScroll, childScroll );

				p = p.parent;
			}
			// position relative to parent.
			// calculate down to the root...
			var flatSize = b.parent.size(false);
			var preSize = b.parent.size(false, b.parent.children.indexOf(b) );
			var pPos = preSize / flatSize;


			console.log( 'PARENT : ', b.parent.children.indexOf(b), preSize, flatSize, pPos );
			b.onScroll.dispatch( b, b.position );

		}else{
			// we haven't found a block and this block is not the one.
			// so the block is in front of us.
			b.position = 1;
			b.onScroll.dispatch( b, b.position );
		}

		pass.pos += b._size;

	}

	return pass;
};


module.exports = traverse;