let user_x_ori, user_y_ori;
let user_x, user_y;
let user_pressing = false;

function init_user_input() {
  let scale_fx = gameCanvas.w / gameCanvas.canvas.clientWidth;
  let scale_fy = gameCanvas.h / gameCanvas.canvas.clientHeight;
  
  gameCanvas.canvas.onmousedown = function (e) {
    user_x = e.layerX  * scale_fx;
    user_y = e.layerY * scale_fy;
    user_x_ori = user_x;
    user_y_ori = user_y;
    
    if (user_y_ori <= 60 && user_x_ori >= (gameCanvas.w - 60)) {
      showSubMenu();
    }
    
    user_pressing = true;
    return false;
  }

  gameCanvas.canvas.onmouseup = function (e) {
    user_pressing = false;
    return false;
  }

  gameCanvas.canvas.onmousemove = function(e) {
    user_x = e.layerX * scale_fx;
    user_y = e.layerY * scale_fy;
    return false;
  }

  gameCanvas.canvas.ontouchstart = function (e) {
    user_x = e.touches[0].clientX * scale_fx;
    user_y = e.touches[0].clientY * scale_fy;
    user_x_ori = user_x;
    user_y_ori = user_y;
    
    if (user_y_ori <= 60 && user_x_ori >= (gameCanvas.w - 60)) {
      showSubMenu();
    }
    
    user_pressing = true;
    return false;
  }

  gameCanvas.canvas.ontouchend = function (e) {
    user_pressing = false;
    return false;
  }

  gameCanvas.canvas.ontouchmove = function(e) {
    user_x = e.touches[0].clientX * scale_fx;
    user_y = e.touches[0].clientY * scale_fy;
    return false;
  }

  window.addEventListener("deviceorientation", handleOrientation);
}

function showSubMenu() {
  if (curPage == 'game') {
    gamePlay.pause = true;
    pauseBGM();
  }
  document.getElementById("Submenu").style.left = "0";
}

function hideSubMenu() {
  document.getElementById("Submenu").style.left = "-100%";
  gamePlay.pause = false;
  if (curPage == 'game') {
    playBGM();
    gamePlay.last_animation_time = 0;
    requestAnimationFrame(tick);
  }
}
