var user_x_ori, user_y_ori;
var user_x, user_y;
var user_pressing = false;

function init_user_input() {
    var scale_f = canv_game.width / canv_game.clientWidth;
    //alert(scale_f);
    canv_game.onmousedown = function (e) {
        user_x_ori = e.layerX * scale_f;
        user_y_ori = e.layerY * scale_f;
        user_x = e.layerX  * scale_f;
        user_y = e.layerY * scale_f;
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
        user_x_ori = e.touches[0].offsetX * scale_f;
        user_y_ori = e.touches[0].clientY * scale_f;
        user_x = e.touches[0].offsetX * scale_f;
        user_y = e.touches[0].clientY * scale_f;
        user_pressing = true;
        return false;
    }

    canv_game.ontouchend = function (e) {
        user_pressing = false;
        return false;
    }

    canv_game.ontouchmove = function(e) {
        user_x = e.touches[0].offsetX * scale_f;
        user_y = e.touches[0].clientY * scale_f;
        return false;
    }
}
