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
    ctx.drawImage(imgs[tile_id], 0, 0, 50, 50, BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1);
}

// draws the board and the moving shape
function render_board() {
    ctx.clearRect( 0, 0, W, H );
        
    //ctx.strokeStyle = 'black';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                drawBlock( x, y, (board[ y ][ x ] - 1) % 12 );
            }
        }
    }
}

function render_current() {
    for ( var y = 0; y < BLOCK_WH; ++y ) {
        for ( var x = 0; x < BLOCK_WH; ++x ) {
            if ( current[ y ][ x ] ) {
                drawBlock( currentX + x, currentY + y, (current[ y ][ x ] - 1) % 12 );
            }
        }
    }
}

function render_boarder() {
    ctx.drawImage(img_bg, 0, 0, 700, 1000, 0, 0, W, H);
    // ctx.fillStyle = '#ffa500';
    // ctx.font = '35px Sniglet-Regular';
    // ctx.fillText('Usery : ' + user_y + ',UserX : ' + Math.floor(user_x), 20, 50);
}
function render_gameover() {
    var c_x = ctx.canvas.width / 2;
    var c_y = ctx.canvas.height / 2;
    
    // create radial gradient
    var grd = ctx.createRadialGradient(c_x, c_y, 10, c_x, c_y, 150);
    // light blue
    //grd.addColorStop(0, 'yellow');
    grd.addColorStop(0, '#d54d7b');
    // dark blue
    grd.addColorStop(1, '#004CB3');
    ctx.fillStyle = grd;
    ctx.font = '50px Sniglet-ExtraBold';
    ctx.fillText('GameOver', c_x - 130, c_y - 25);
}

function render_init() {
    canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
    ctx = canvas.getContext( '2d' );
}
