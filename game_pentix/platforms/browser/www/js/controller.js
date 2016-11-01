var keyCode;

var user_x_ori, user_y_ori;
var user_x, user_y;
var user_pressing = false;
var do_rotate = false;
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

            return false;
        }
    };

    document.body.onkeyup = function( e ) {
        keyCode = '';
        rotBlTmr = 0;
        return false;
    }

    var scale_f = canvas.width / canvas.clientWidth;
    document.body.onmousedown = function (e) {
        user_x = e.clientX  * scale_f;
        user_y = e.clientY * scale_f;
        user_x_ori = user_x;
        user_y_ori = user_y;
        
        user_pressing = true;
        do_rotate = true;
        return false;
    }

    document.body.onmouseup = function (e) {
        user_pressing = false;
        return false;
    }

    document.body.onmousemove = function(e) {
        user_x = e.layerX * scale_f;
        user_y = e.layerY * scale_f;
        return false;
    }

    document.body.ontouchstart = function (e) {
        user_x = e.touches[0].clientX * scale_f;
        user_y = e.touches[0].clientY * scale_f;
        user_x_ori = user_x;
        user_y_ori = user_y;
                
        user_pressing = true;
        do_rotate = true;
        return false;
    }

    document.body.ontouchend = function (e) {
        user_pressing = false;
        return false;
    }

    document.body.ontouchmove = function(e) {
        user_x = e.touches[0].clientX * scale_f;
        user_y = e.touches[0].clientY * scale_f;
        return false;
    }
}

