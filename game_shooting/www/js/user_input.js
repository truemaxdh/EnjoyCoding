var user_x_ori, user_y_ori;
var user_x, user_y;
var user_pressing = false;
function init_user_input() {
    canv_game.onmousedown = function (e) {
        user_x_ori = e.screenX;
        user_y_ori = e.screenY;
        user_x = e.screenX;
        user_y = e.screenY;
        user_pressing = true;
        return false;
    }

    canv_game.onmouseup = function (e) {
        user_pressing = false;
        return false;
    }

    canv_game.onmousemove = function(e) {
        user_x = e.screenX;
        user_y = e.screenY;
        return false;
    }

    canv_game.ontouchstart = function (e) {
        alert(e.touches[0].screenX);
        user_x_ori = e.touches[0].screenX;
        user_y_ori = e.touches[0].screenY;
        user_x = e.touches[0].screenX;
        user_y = e.touches[0].screenY;
        user_pressing = true;
        return false;
    }

    canv_game.ontouchend = function (e) {
        user_pressing = false;
        return false;
    }

    canv_game.ontouchmove = function(e) {
        user_x = e.touches[0].screenX;
        user_y = e.touches[0].screenY;
        return false;
    }
}
