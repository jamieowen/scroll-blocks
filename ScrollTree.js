
var Signal = require( 'signals' );

var updateTree = require( './updateTree' );
var positionTree = require( './positionTree' );

var Instances = {
	id: 0,
	needsUpdate: {}
};

var ScrollTree = function( name ){

	name = name || 'root';
	Instances.id++;

	this._id = Instances.id;
	Instances.needsUpdate[ this._id ] = true;

	this.root = new Node(name,NaN);
	this.root._owner = this._id;

	this.onEnter  = new Signal();
	this.onLeave  = new Signal();
	this.onNodeScroll = this.root.onNodeScroll;
	this.onParentScroll = this.root.onParentScroll;
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

		positionTree( this.root, position );

	}
};

Object.defineProperties( ScrollTree.prototype, {

	size: {
		get: function(){
			return this.root._tsize;
		}
	}

});


var Node = function( name, size ){

	this.onEnter  = new Signal();
	this.onLeave  = new Signal();
	
	this.onNodeScroll = new Signal();
	this.onParentScroll = new Signal();
	this.onTreeScroll = new Signal();

	this.children = [];

	this.name  = name || '';
	this.size  = size === undefined ? 0 : size;

	this.parent = null;
	this._entered = null;

	this._owner = NaN; // node owner <ScrollTree>

	this._parentPosition = NaN;
	this._treePosition = NaN;
	this._nodePosition = NaN;

	this._gstart = NaN; // global start pos
	this._gend 	 = NaN; // global end pos
	this._tstart = NaN; // tree start
	this._tend   = NaN; // tree end

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


Object.defineProperties( Node.prototype, {

	nodePosition: {
		get: function(){
			return this._nodePosition;
		},

		set: function( value ){
			if( this._nodePosition === value ){
				return;
			}
			this._nodePosition = value;
			this.onNodeScroll.dispatch( this._nodePosition );
		}
	},

	treePosition: {
		get: function(){
			return this._treePosition;
		},

		set: function( value ){
			if( this._treePosition === value ){
				return;
			}
			this._treePosition = value;
			this.onTreeScroll.dispatch( this._treePosition );
		}
	},

	parentPosition: {
		get: function(){
			return this._parentPosition;
		},

		set: function( value ){
			if( this._parentPosition === value ){
				return;
			}
			this._parentPosition = value;
			this.onParentScroll.dispatch( this._parentPosition );
		}
	},

	entered: {

		get: function(){
			return this._entered;
		},

		set: function( value ){
			if( this._entered === value ){
				return;
			}
			this._entered = value;

			if( this.entered ){
				this.onEnter.dispatch();
			}else{
				this.onLeave.dispatch();
			}
		}
	}
});



