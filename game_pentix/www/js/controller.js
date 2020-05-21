var keyCode;

var user_x_ori, user_y_ori;
var user_x, user_y;
var user_pressing = false;
var do_rotate = false;
var keyPressed = false;
function addEvt() {
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
            keyPressed = true;
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
        if (e.clientY < 40) {
            showSubMenu();
            return true;
        }
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
        if (e.clientY < 40) {
            showSubMenu();
            return true;
        }
        user_x = e.clientX * scale_f;
        user_y = e.clientY * scale_f;
        return false;
    }

    document.body.ontouchstart = function (e) {
        if (e.touches[0].clientY < 40) {
            togglePause();
            return true;
        }
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
        if (e.touches[0].clientY < 40) {
            togglePause();
            return true;
        }
        user_x = e.touches[0].clientX * scale_f;
        user_y = e.touches[0].clientY * scale_f;
        return false;
    }
}

function removeEvt() {
    document.body.onkeydown = function( e ) {
    };

    document.body.onkeyup = function( e ) {
    }

    document.body.onmousedown = function (e) {
    }

    document.body.onmouseup = function (e) {
    }

    document.body.onmousemove = function(e) {
    }

    document.body.ontouchstart = function (e) {
    }

    document.body.ontouchend = function (e) {
    }

    document.body.ontouchmove = function(e) {
    }
}

function showSubMenu() {
  if (curPage == pageIDs[2]) {
    paused = true;
    document.getElementById( 'bgm' ).pause();
  }
  document.getElementById("Submenu").style.width = "100%";
}

function hideSubMenu() {
  document.getElementById("Submenu").style.width = "0%";
  if (curPage == pageIDs[2]) {
    paused = false;
    document.getElementById( 'bgm' ).play();
    tick();
  }
}

/*function togglePause() {
    paused = !paused;
    if (!paused) {
        document.getElementById( 'bgm' ).play();
        tick();
    } else {
        document.getElementById( 'bgm' ).pause();
        //showSubMenu();
    }
}*/
