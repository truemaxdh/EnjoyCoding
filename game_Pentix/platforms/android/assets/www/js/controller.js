var keyCode;
function keyEvtLink() {
    document.body.onkeydown = function( e ) {
        var keys = {
            37: 'left',
            39: 'right',
            40: 'down',
            38: 'rotate'
        };
        if ( typeof keys[ e.keyCode ] != 'undefined' ) {
            //keyPress( keys[ e.keyCode ] );
            keyCode=keys[ e.keyCode ];
            //render();
        }
    };

    document.body.onkeyup = function( e ) {
        keyCode = '';
        rotBlTmr = 0;
    }
}

