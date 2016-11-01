var canvas;
var ctx;
var W = 700, H = 1000;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
var render_interval;
var imgs=[];
var img_bg = new Image();

img_bg.src = 'img/bg.png';
for (var i = 0; i < 12; i++) {
    imgs[i] = new Image();
    imgs[i].src = 'img/rect' + (i + 1) + '.png';
}

// draw a single square at (x, y)
function drawBlock( x, y, tile_id ) {
    //ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    //ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    ctx.drawImage(imgs[tile_id], 0, 0, 50, 50, BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1);
}

// draws the board and the moving shape
function render() {
    ctx.clearRect( 0, 0, W, H );
    
    procTouchEvent();

    procKeyEvent();

    ctx.strokeStyle = 'black';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                //ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
                drawBlock( x, y, (board[ y ][ x ] - 1) % 12 );
            }
        }
    }

    //ctx.fillStyle = 'red';
    //ctx.strokeStyle = 'black';
    // for ( var y = 0; y < 4; ++y ) {
    for ( var y = 0; y < BLOCK_WH; ++y ) {
        // for ( var x = 0; x < 4; ++x ) {
        for ( var x = 0; x < BLOCK_WH; ++x ) {
            if ( current[ y ][ x ] ) {
                //ctx.fillStyle = colors[ current[ y ][ x ] - 1 ];
                drawBlock( currentX + x, currentY + y, (current[ y ][ x ] - 1) % 12 );
            }
        }
    }

    ctx.drawImage(img_bg, 0, 0, 700, 1000, 0, 0, W, H);

}

function render_init() {
    canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
    ctx = canvas.getContext( '2d' );
}
