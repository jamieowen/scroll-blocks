
var Signal = require( 'signals' );

var ScrollBlock = function( name, size ){

	this.onEnter  = new Signal();
	this.onLeave  = new Signal();
	this.onScroll = new Signal(); // handler( globalPosition, innerPosition, localPosition ) ??

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
			if( block.size ){
				block._start = pos;
				block._end = pos + block.size;
				pos = block._end;
			}

			return pos;
		};

		return function(){

			var root = this;
			while( root.parent ){
				root = root.parent;
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
	length : function(){

		var length = this.size;

		for( var i = 0; i<this.blocks.length; i++ ){
			length += this.blocks[i].length();
		}

		return length;

	},

	/**
	 * Set the scroll position of the tree.
	 *
	 * @param position
	 */
	setPosition : function( position ) {

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
			prevBlock.onLeave.dispatch();
			blockChanged = true;
			console.log( 'LEAVE : ', prevBlock.name );
		}

		if( blockChanged && currentBlock ){
			currentBlock.onEnter.dispatch();
			console.log( 'ENTER : ', currentBlock.name );
		}

		if( currentBlock ){
			var local = position - currentBlock._start;
			var global = position;
			currentBlock.onScroll.dispatch( local, global );
		}
		// dispatch scroll

		//console.log( 'SCROLL UPDATE : ', position );
		root._currentBlock = currentBlock;
		root._currentPosition = position;

	},

	getPosition : function(){

	},

	contains: function( position ){

		if( this.size > 0 && position >= this._start && position < this._end ){
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



