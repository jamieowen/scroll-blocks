
var traverse = function( node, position, resultPass ){

	position = position === undefined ? 0 : position;

	var cnode;
	for( var i = 0; i<node.children.length; i++ ){

		cnode = node.children[i];

		traverse( cnode, position, resultPass );

		if( resultPass.entered && resultPass.ancestors.indexOf(cnode) === -1 ){
			// this node is in front of the scroll position
			cnode.entered = false;
			cnode.nodePosition = 0;
			cnode.treePosition = 0;
			cnode.parentPosition = 0;
		}else
		if( position >= cnode._gstart && position < cnode._gend ){
			// entered.
			resultPass.entered = cnode;
			cnode.entered = true;

			//console.log( 'entered ', cnode.name, position, cnode._gstart, cnode._gend, cnode.size );

			// calculate tree and parent positions.
			var p = cnode.parent;

			while( p ){
				// store a ref to all ancestors when traversing continues.
				resultPass.ancestors.push( p );

				if( cnode === resultPass.entered ){
					cnode.nodePosition = ( position - cnode._gstart ) / cnode.size;
				}else{
					cnode.nodePosition = 0;
				}

				var idx = p.children.indexOf( cnode );
				var pscroll = 0;
				for( var j = 0; j<idx; j++ ){
					pscroll+=p.children[j].size;
				}
				pscroll += cnode.size * cnode._nodePosition;
				p.parentPosition = pscroll / p._csize;

				/**
				if( p === cnode.parent ){
					var idx = p.children.indexOf( cnode );
					var pscroll = 0;
					for( var j = 0; j<idx; j++ ){
						pscroll+=p.children[j].size;
					}
					pscroll+=cnode.size * cnode._nodePosition;
					p.parentPosition = pscroll / p._csize;
				}else{
					p.parentPosition = 0;
				}**/

				// tree position
				//p.nodePosition = 0;
				p.treePosition = ( position - p.children[0]._tstart ) / p._tsize;
				//console.log( 'calc tree pos : ', p.name, p.treePosition, p._tsize, position, p.children[0]._tstart );
				cnode = p;
				p = p.parent;
			}

		}else
		if( !resultPass.entered ){
			// this node is behind the scroll position.
			cnode.entered = false;
			cnode.nodePosition = 1;
			cnode.treePosition = 1;
			cnode.parentPosition = 1;
		}
	}


};

var resultPass = {
	entered: null,
	ancestors: []
};

var positionTree = function( node, position ){

	resultPass.entered = null;
	resultPass.ancestors.splice(0);

	traverse( node, position, resultPass );

};


module.exports = positionTree;