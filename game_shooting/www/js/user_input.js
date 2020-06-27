var user_x_ori, user_y_ori;
var user_x, user_y;
var user_pressing = false;

function init_user_input() {
  var scale_fx = canv_game.width / canv_game.clientWidth;
  var scale_fy = canv_game.height / canv_game.clientHeight;
  
  canv_game.onmousedown = function (e) {
    user_x = e.layerX  * scale_fx;
    user_y = e.layerY * scale_fy;
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
    user_x = e.layerX * scale_fx;
    user_y = e.layerY * scale_fy;
    return false;
  }

  canv_game.ontouchstart = function (e) {
    user_x = e.touches[0].clientX * scale_fx;
    user_y = e.touches[0].clientY * scale_fy;
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
    user_x = e.touches[0].clientX * scale_fx;
    user_y = e.touches[0].clientY * scale_fy;
    return false;
  }
}

function showSubMenu() {
  if (curPage == 'game') {
    frame.pause = true;
    document.getElementById( 'bgm' ).pause();
  }
  document.getElementById("Submenu").style.width = "100%";
}

function hideSubMenu() {
  document.getElementById("Submenu").style.width = "0%";
  frame.pause = false;
  if (curPage == 'game') {
    document.getElementById( 'bgm' ).play();
    frame.last_animation_time = 0;
    requestAnimationFrame(tick);
  }
}
