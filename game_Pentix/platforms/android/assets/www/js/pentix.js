var COLS = 14, ROWS = 20;
var BLOCK_WH = 5;
var board = [];
var score;
var lose;
var interval;
var objInterval;
var current; // current moving shape
var currentX, currentY; // position of current shape
// var shapes = [
//     [ 0, 0, 0, 0,
//       1, 1, 1, 1 ],
//     [ 0, 0, 0, 0,
//       1, 1, 1, 0,
//       1 ],
//     [ 0, 0, 0, 0,
//       1, 1, 1, 0,
//       0, 0, 1 ],
//     [ 0, 0, 0, 0,
//       1, 1, 0, 0,
//       1, 1 ],
//     [ 0, 0, 0, 0,
//       1, 1, 0, 0,
//       0, 1, 1 ],
//     [ 0, 0, 0, 0,
//       0, 1, 1, 0,
//       1, 1 ],
//     [ 0, 0, 0, 0,
//       0, 1, 0, 0,
//       1, 1, 1 ]
// ];

var shapes = [
    // 5
    [ 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      1, 1, 1, 1, 1 ],
    // 4
    [ 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0,
      1 ],
    [ 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0,
      0, 1 ],
    [ 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0,
      0, 0, 1 ],
    [ 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0,
      0, 0, 0, 1 ],
    // 3
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      1, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      0, 1, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      0, 0, 1, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      0, 0, 0, 1, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      0, 1, 0, 0, 0,
      0, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      0, 0, 1, 0, 0,
      0, 0, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      0, 0, 0, 1, 0, 
      0, 0, 0, 1 ],
    // 2
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 0, 0,
      0, 1, 0, 0, 0,
      0, 1, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 0, 1, 1, 0,
      0, 1, 1, 0, 0,
      0, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 0, 1, 1, 0,
      0, 1, 1, 0, 0,
      0, 0, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 0, 0,
      0, 0, 1, 1, 0,
      0, 0, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 1, 1, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 1, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 0, 1, 1, 0,
      0, 0, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 0, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 1, 1, 1, 0,
      0, 0, 1 ]
];


var colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple',
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple',
    'cyan', 'orange', 'blue', 'yellow', 'red'
];

// creates a new 5x5 shape in global variable 'current'
// 5x5 so as to cover the size when the shape is rotated
function newShape() {
    var id = Math.floor( Math.random() * shapes.length );
    var shape = shapes[ id ]; // maintain id for color filling

    current = [];
    // for ( var y = 0; y < 4; ++y ) {
    for ( var y = 0; y < BLOCK_WH; ++y ) {
        current[ y ] = [];
        // for ( var x = 0; x < 4; ++x ) {
        for ( var x = 0; x < BLOCK_WH; ++x ) {
            // var i = 4 * y + x;
            var i = BLOCK_WH * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
        }
    }
    // position where the shape will evolve
    currentX = 2;
    currentY = -1;
}

// clears the board
function init() {
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
}

// keep the element moving down, creating new shapes and clearing lines
function tick() {
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
    // if the element settled
    else {
        freeze();
        clearLines();
        if (lose) {
            alert("LOSE");
            gameOver();
            return false;
        }
        newShape();
    }
}

function gameOver() {
    clearInterval(objInterval);
    location.href="index.html";
}

// stop shape at its position and fix it to board
function freeze() {
    // for ( var y = 0; y < 4; ++y ) {
    for ( var y = 0; y < BLOCK_WH; ++y ) {
        // for ( var x = 0; x < 4; ++x ) {
        for ( var x = 0; x < BLOCK_WH; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
}

// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate( current ) {
    var newCurrent = [];
    // for ( var y = 0; y < 4; ++y ) {
    for ( var y = 0; y < BLOCK_WH; ++y ) {
        newCurrent[ y ] = [];
        // for ( var x = 0; x < 4; ++x ) {
        for ( var x = 0; x < BLOCK_WH; ++x ) {
            // newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
            newCurrent[ y ][ x ] = current[ BLOCK_WH - 1 - x ][ y ];
        }
    }

    return newCurrent;
}

// check if any lines are filled and clear them
function clearLines() {
    var combo = 0;
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var rowFilled = true;
        //var unfilledCnt = 0;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                //unfilledCnt++;
                //if (unfilledCnt > 2) {
                    rowFilled = false;
                    break;
                //}
            } 
        }
        if ( rowFilled ) {
            score += ++combo * 10; 
            document.getElementById( 'score_board' ).innerHTML = 'Score : ' + score;
            document.getElementById( 'clearsound' ).play();
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            clearInterval(objInterval);
            interval -= 10;
            objInterval = setInterval( tick, interval );
            ++y;
        }
    }
}

var rotBlTmr = 0;
function procKeyEvent() {
    switch ( keyCode ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX;
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
            }
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                ++currentY;
            }
            break;
        case 'rotate':
            if (rotBlTmr--==0) {
                var rotated = rotate( current );
                if ( valid( 0, 0, rotated ) ) {
                    current = rotated;
                }
                rotBlTmr = 1;
            }
            break;
    }
}

// checks if the resulting position of current shape will be feasible
function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;



    // for ( var y = 0; y < 4; ++y ) {
    for ( var y = 0; y < BLOCK_WH; ++y ) {
        // for ( var x = 0; x < 4; ++x ) {
        for ( var x = 0; x < BLOCK_WH; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                    // if (offsetY == 1) lose = true; // lose if the current shape at the top row when checked
                    if (offsetY < 1) lose = true; // lose if the current shape at the top row when checked
                    return false;
                }
            }
        }
    }
    return true;
}

function newGame() {
    clearInterval(objInterval);
    init();
    score = 0;
    newShape();
    lose = false;
    interval = 500;
    objInterval = setInterval( tick, interval );

    keyEvtLink();

    render_init();
}
