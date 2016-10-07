var user_x_ori, user_y_ori;
var user_x, user_y;
var user_pressing = false;
function init_user_input() {
    canv_game.onmousedown, canv_game.ontouchstart = function (e) {
        user_x_ori = e.screenX;
        user_y_ori = e.screenY;
        user_x = e.screenX;
        user_y = e.screenY;
        user_pressing = true;
    }

    canv_game.onmouseup, canv_game.ontouchend = function (e) {
        user_pressing = false;
    }

    canv_game.onmousemove, canv_game.ontouchmove = function(e) {
        user_x = e.screenX;
        user_y = e.screenY;
    }
}
