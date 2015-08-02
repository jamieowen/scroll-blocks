
var Signal = require( 'signals' );

var ScrollBlock = function( name, size ){

	this.onEnter  = new Signal();
	this.onLeave  = new Signal();
	this.onScroll = new Signal();

	this.blocks = [];

	this.name  = name || '';
	this.size  = size || 0;

	this.parent = null;

	// positions, calculated
	this._start   = 0;
	this._end 	  = this.size;
};

module.exports = ScrollBlock;

ScrollBlock.prototype = {

	constructor: ScrollBlock,

	add : function( name, size ){

		var block = new ScrollBlock( name, size );
		this.blocks.push( block );
		block.parent = this;
		return block;
	},

	calc : function(){

		var calcOffsets = function( block, start ){

			block._start = start;
			block._end = start + block.size;

			start = block._end;
			for( var i = 0; i<block.blocks.length; i++ ){
				calcOffsets( block.blocks[i], start );
				start += block.blocks[i].size;
			}
		};

		return function(){
			var root = this;
			while( root.parent ){
				root._invalid = true;
				root = root.parent;
			}

			calcOffsets( root, 0 );
		};

	},

	/**
	 * Traverses the block tree and calculates the length
	 * of all blocks.
	 *
	 * @returns {*|number}
	 */
	length : function(){

		var length = this.size;

		for( var i = 0; i<this.blocks.length; i++ ){
			length += this.blocks[i].length();
		}

		return length;

	},

	setPosition : function(){

		var intersects = function( offset, block, position ){

			var start = offset;
			var end = offset + block.size;

			if( block.size > 0 && position >= start && position <= end ){
				// within this block.
				// calculate relative offsets ( and up the tree? )
				return block;
			}else{
				// search children.
				var found = null;
				var l = block.blocks.length;

				for( var i = 0; i<l && found===null; i++ ){
					found = intersects( end, block.blocks[i], position );
					end += block.blocks[i].length();
				}

				return found;
			}

		};

		return function( position ){
			// if not root block, find root block??
			var root = this;
			while( root.parent ){
				root = root.parent;
			}

			// set position.
			var prevPosition = root._position;
			var prevBlock    = root._block;

			if( position === prevPosition ){
				return;
			}

			var currentBlock = intersects( 0, this, position );

			if( currentBlock !== prevBlock ){

				prevBlock.onLeave.dispatch();
				currentBlock.onEnter.dispatch();
			}

			return currentBlock;
			// emit the scroll position with easing introduced?

		}

	}(),

	getPosition : function( local ){

	}

};



