
var Signal = require( 'signals' );

var ScrollBlock = function( name, size ){

	this.onEnter  = new Signal();
	this.onLeave  = new Signal();
	this.onScroll = new Signal();

	this.blocks = [];

	this.name  = name || '';
	this._size  = size || 0;

	this.parent = null;

	this.entered = false;

	// positions, calculated
	this._start   = 0;
	this._end 	  = this._size;
};

module.exports = ScrollBlock;

ScrollBlock.prototype = {

	constructor: ScrollBlock,

	add : function( name, size ){

		var block = name instanceof ScrollBlock ? name : null;

		if( !block ){
			block = new ScrollBlock( name, size );
		}

		this.blocks.push( block );
		block.parent = this;

		return block;
	},

	calc : function(){

		var calcOffsets = function( block, start ){

			// traverse children first.
			// scrolling begins with deepest child.

			//console.log( 'calc :', block.name, block._start, block._end );
			var pos = start;
			for( var i = 0; i<block.blocks.length; i++ ){
				pos = calcOffsets( block.blocks[i], pos );
			}

			// then add parent.
			if( block._size ){
				block._start = pos;
				block._end = pos + block._size;
				pos = block._end;
			}

			return pos;
		};

		return function(){

			var root = this;
			while( root.parent ){
				root = root.parent;
			}

			if( root._size !== 0 ){
				root._size = 0;
				console.log( '[ScrollBlocks] root block cannot have a size set' );
			}

			calcOffsets( root, 0 );
		};

	}(),

	/**
	 * Traverses the block tree and calculates the length
	 * of all blocks.
	 *
	 * @returns {*|number}
	 */
	size : function( recursive, toIndex ){

		recursive = recursive === undefined ? true : recursive;
		toIndex = toIndex === undefined ? this.blocks.length : toIndex;

		var size = 0;

		for( var i = 0; i<toIndex; i++ ){
			size += this.blocks[i]._size;
			if( recursive ){
				size += this.blocks[i].size();
			}
		}

		return size;

	},

	sizeChildren: function(){

		var size = 0;

		for( var i = 0; i<this.blocks.length; i++ ){
			size += this.blocks[i]._size;
		}

		return size;
	},


	setPosition : function( position ){

		var pass = {
			pos: 0,
			found: null
		};

		var traverse = function( block, position ){

			var b;

			for( var i = 0; i<block.blocks.length; i++ ){
				b = block.blocks[i];

				// traverse children straight away.
				// they are scrolled first.
				traverse( b, position );

				console.log( 'PASS:', b.name,  position, 's/e', pass.pos, pass.pos + b._size );
				// if we already have found a block, the scroll position is before us.
				// so all blocks would be scroll position = 0
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

					// position relative to parent.
					// calculate down to the root...
					var flatSize = b.parent.size(false);
					var preSize = b.parent.size(false, b.parent.blocks.indexOf(b) );
					var pPos = preSize / flatSize;

					console.log( 'PARENT : ', b.parent.blocks.indexOf(b), preSize, flatSize, pPos );
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

		return function( position ){

			// for now, only set position on root block.
			var root = this;
			while( root.parent ){
				root = root.parent;
			}

			if( root._size !== 0 ){
				root._size = 0;
				console.log( '[ScrollBlocks] root block cannot have a size set' );
			}

			// reset pass.
			pass.pos = 0;
			pass.found = null;

			// traverse
			traverse( root, position );
			console.log( 'END POS : ', pass.pos );
		}
	}(),

	/**
	 * Set the scroll position of the tree.
	 *
	 * @param position
	 */
	/**setPosition : function( position ) {

		// find the root.
		var root = this;
		while( root.parent ){
			root = root.parent;
		}

		var prevBlock = root._currentBlock;
		var prevPosition = root._currentPosition;

		if( prevPosition === position ){
			return;
		}

		var currentBlock = root.contains( position );
		var blockChanged = prevBlock ? false : true;

		//console.log( 'CURRENT BLOCK :', currentBlock );

		if( prevBlock && prevBlock !== currentBlock ){
			prevBlock.onLeave.dispatch( prevBlock );
			blockChanged = true;
			console.log( 'LEAVE : ', prevBlock.name );
		}

		if( blockChanged && currentBlock ){
			currentBlock.onEnter.dispatch( currentBlock );
			console.log( 'ENTER : ', currentBlock.name );
		}

		if( currentBlock ){

			var parent = NaN;
			if( currentBlock.parent ){
				var p = currentBlock.parent;

				// need to subtract sub children
				var childSize = p.sizeChildren();
				var deepSize = p.size();

				parent = ( position - p.blocks[0]._start );
			}

			var data = {
				local: position - currentBlock._start,
				parent: parent,
				global: position
			};

			var dataNorm = {
				local: data.local / currentBlock._size,
				parent: parent,
				global: position / root.size()
			};

			currentBlock.onScroll.dispatch( currentBlock, data, dataNorm );
		}
		// dispatch scroll

		//console.log( 'SCROLL UPDATE : ', position );
		root._currentBlock = currentBlock;
		root._currentPosition = position;

	},**/

	getPosition : function(){

	},

	contains: function( position ){

		if( this._size > 0 && position >= this._start && position < this._end ){
			return this;
		}else{
			var block;

			for( var i = 0; i<this.blocks.length && !block; i++ ){
				block = this.blocks[i].contains( position );
			}
			return block;
		}

	}

};



