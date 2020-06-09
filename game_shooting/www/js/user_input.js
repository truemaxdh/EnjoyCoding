var user_x_ori, user_y_ori;
var user_x, user_y;
var user_pressing = false;

function init_user_input() {
    var scale_f = canv_game.width / canv_game.clientWidth;
    
    canv_game.onmousedown = function (e) {
        user_x = e.clientX  * scale_f;
        user_y = e.clientY * scale_f;
        user_x_ori = user_x;
        user_y_ori = user_y;
        
        if (user_y_ori <= 60 && user_x_ori > 400) {
            showSubMenu();
        }
        
        user_pressing = true;
        return false;
    }

    canv_game.onmouseup = function (e) {
        user_pressing = false;
        return false;
    }

    canv_game.onmousemove = function(e) {
        user_x = e.layerX * scale_f;
        user_y = e.layerY * scale_f;
        return false;
    }

    canv_game.ontouchstart = function (e) {
        user_x = e.touches[0].clientX * scale_f;
        user_y = e.touches[0].clientY * scale_f;
        user_x_ori = user_x;
        user_y_ori = user_y;
        
        if (user_y_ori <= 60 && user_x_ori > 400) {
            showSubMenu();
        }
        
        user_pressing = true;
        return false;
    }

    canv_game.ontouchend = function (e) {
        user_pressing = false;
        return false;
    }

    canv_game.ontouchmove = function(e) {
        user_x = e.touches[0].clientX * scale_f;
        user_y = e.touches[0].clientY * scale_f;
        return false;
    }
}

function showSubMenu() {
  if (curPage == 'game') {
    paused = true;
    document.getElementById( 'bgm' ).pause();
    removeEvt();
  }
  document.getElementById("Submenu").style.width = "100%";
}

function hideSubMenu() {
  document.getElementById("Submenu").style.width = "0%";
  paused = false;
  if (curPage == 'game') {
    document.getElementById( 'bgm' ).play();
    addEvt();
    tick();
  }
}

/*function togglePause() {
    pause = !pause;
    if (!pause) {
        document.getElementById( 'bgm' ).play();
        last_animation_time = 0;
        requestAnimationFrame(tick);
    } else {
        document.getElementById( 'bgm' ).pause();
    }
}*/
