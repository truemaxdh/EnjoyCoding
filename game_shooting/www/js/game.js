var objInterval;
var score;
var missile_first = null, missile_last = null;
var missile_interval_cnt = 0;
function game_init() {
    score = 0;
}

function newGame() {
    clearInterval(objInterval);
    game_init();
    
    objInterval = setInterval(tick, 50);
}

function tick() {
    proc_user_input();
    render();
}

function proc_user_input() {
    if (user_pressing) {
        var dx = user_x - user_x_ori;
        var dy = user_y - user_y_ori;
        user_x_ori = user_x;
        user_y_ori = user_y;

        o_jet.x += dx;
        o_jet.y += dy;

        if (missile_interval_cnt++==0) {
            var o_missile = new objMissile();
            o_missile.x = o_jet.x;
            o_missile.y = o_jet.y;

            if (missile_first==null) {
                missile_first = o_missile;
                missile_last = o_missile;
            } else {
                o_missile.prev = missile_last;
                missile_last.next = o_missile;
                missile_last = o_missile;
            }
        } else if (missile_interval_cnt == 5) {
            missile_interval_cnt = 0;
        }
    } else {
        missile_interval_cnt = 0;
    }
}
