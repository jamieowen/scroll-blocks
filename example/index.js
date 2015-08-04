
var ScrollBlock = require( '../ScrollBlock' );

window.onload = function(){

	console.log( 'load' );

	document.body.style.margin = '0px';
	document.body.style.padding = '0px';
	document.body.style.width = '100%';
	document.body.style.height = '100%';

	var rootBlock = new ScrollBlock( 'rootBlock' );
	var subBlock,block;

	var html = '<div style="width:100%; height:100%; position: absolute;">';

	for( var i = 0; i<5; i++ ){

		subBlock = new ScrollBlock( 'subBlock_' + i, window.innerHeight );
		rootBlock.add( subBlock );

		if( i % 2 === 0 ){

			html += '<div style="position: relative; background-color: #0086b3; width: 100%; height: 100%;">' +
				'<div style="position: absolute; width: 400px; height: 300px; left: 50%; top: 50%; margin-left:-200px; margin-top: -150px; overflow: hidden;">';

			for( var j = 0; j<10; j++ ){
				var color = j % 2 === 0 ? '#fff' : '#fee';
				html += '<div style="width: 400px; height: 300px; background-color: ' + color + '"></div>';

				//block = new ScrollBlock( 'subBlock_' + i + '_' + j, 300 );
				//subBlock.add( block );
				subBlock.add( 'subBlock_' + i + '_' + j, 300 );
			}

			html += '</div></div>';
		}else{
			html +=
				'<div style="background-color: #0055aa; width: 100%; height: 100%;">' +
				'' +

				'</div>';

		}

	}
	html += '</div>';


	rootBlock.calc();
	console.log( 'ROOT:', rootBlock, rootBlock.length() );
	document.body.innerHTML = html;

	document.body.style.height = rootBlock.length() + 'px';

	/**

	var update = function( ele, x, y, w, h ){
		ele.style.width = w + 'px';
		ele.style.height = h + 'px';
		ele.style.left = x + 'px';
		ele.style.top = y + 'px';
	};

	var create = function( parent, mod ){
		var ele = document.createElement( 'div' );
		ele.style.display = 'block';
		ele.style.position = 'absolute';
		ele.style.backgroundColor = mod ? '#333333' : '#666666';
		parent.appendChild( ele );
		return ele;
	};

	var createSub = function( parent, mod ){
		var ele = document.createElement( 'div' );
		//ele.style.display = 'block';
		//ele.style.position = 'absolute';
		ele.style.backgroundColor = mod ? '#999999' : '#AAAAAA';
		parent.appendChild( ele );
		return ele;
	};

	var block,subBlock;

	var eleBlocks = [];
	var subBlocks = [];
	var cenBlocks = [];

	//var rootContainer = document.createElement( 'div' );
	//rootContainer.style.position = 'fixed';
	//document.body.appendChild( rootContainer );
	**/
	/**
	for( var i = 0; i<5; i++ ){

		block = create( rootContainer, i % 2 );
		eleBlocks.push( block );

		if( i % 2 === 0 ){
			block = create( block, 0 );
			block.style.top = '50%';
			block.style.left = '50%';
			//update( block, 0,0, '30%', '')
			subBlocks.push( block );
			for( var j = 0; j<10; j++ ){
				subBlock = createSub( block, j % 2 );
				subBlocks.push( subBlock );
			}
		}
	}**/
	/**
	var resize = function(){

		var i;
		for( i = 0; i<eleBlocks.length; i++ ){
			update( eleBlocks[i], 0, i * window.innerHeight, window.innerWidth, window.innerHeight );
		}
		for( i = 0; i<subBlocks.length; i++ ){
			update( subBlocks[i], 100, 100, window.innerWidth * 0.3, window.innerHeight * 0.3 );
		}
	};



	resize();
	window.addEventListener( 'resize', resize );**/

};