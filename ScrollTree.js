
var Signal = require( 'signals' );

var updateTree = require( './updateTree' );
var positionTree = require( './positionTree' );

var Instances = {
	id: 0,
	needsUpdate: {}
};

var ScrollTree = function(){

	Instances.id++;

	this._id = Instances.id;
	Instances.needsUpdate[ this._id ] = true;

	this.root = new Node('root',NaN);
	this.root._owner = this._id;

	this.onEnter  = new Signal();
	this.onLeave  = new Signal();
	this.onScroll = this.root.onScroll;
	this.onChildScroll = this.root.onChildScroll;
	this.onTreeScroll = this.root.onTreeScroll;
};


module.exports = ScrollTree;


ScrollTree.prototype = {

	constructor: ScrollTree,
	
	add: function( name, size ){
		return this.root.add( name, size );
	},

	remove: function( name, size ){
		return this.root.remove( name, size );
	},

	traverse: function( func ){
		this.root.traverse( func );
	},

	setPosition : function( position ){

		if( Instances.needsUpdate[this._id] ){
			updateTree( this.root );
			Instances.needsUpdate[this._id] = false;
		}

		var pass = {
			pos: 0,
			found: null
		};

		//positionTree( this.root, position );

	}
};


var Node = function( name, size ){

	this.onEnter  = new Signal();
	this.onLeave  = new Signal();
	
	this.onScroll = new Signal();
	this.onChildScroll = new Signal();
	this.onTreeScroll = new Signal();

	this.children = [];

	this.name  = name || '';
	this.size  = size === undefined ? 0 : size;

	this.parent = null;
	this.entered = false;

	this._owner = NaN; // tree owner

	this._cpos = NaN; // child pos
	this._tpos = NaN; // tree pos
	this._spos = NaN; // scroll pos

	this._gstart = NaN; // global start pos
	this._gend 	 = NaN; // global end pos

	this._csize = NaN; // children size;
	this._tsize = NaN; // tree size.
};



Node.prototype = {

	constructor: Node,

	/**sizeChildren : function( recursive, toIndex ){

		recursive = recursive === undefined ? true : recursive;
		toIndex = toIndex === undefined ? this.children.length : toIndex;

		var size = 0;

		for( var i = 0; i<toIndex; i++ ){
			size += this.children[i].size;
			if( recursive ){
				size += this.children[i].sizeChildren();
			}
		}

		return size;

	},**/

	add: function( name, size ){

		var node = new Node( name, size );
		node.parent = this;
		node._owner = this._owner;

		Instances.needsUpdate[this._owner] = true;

		this.children.push( node );
		return node;
	},

	remove: function(){
		throw new Error( 'TODO!' );
	},

	traverse: function(){

		var _traverse = function( node, func ){

			func( node );

			for( var i = 0; i<node.children.length; i++ ){
				_traverse( node.children[i], func );
			}

		};

		return function( func ){
			if( func === undefined ){
				return;
			}
			_traverse( this, func );
		}

	}()

};



