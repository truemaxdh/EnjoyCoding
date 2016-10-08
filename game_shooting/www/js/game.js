var objInterval;
var score;

var o_jet;
var missile_first, missile_last;
var missile_interval_cnt;

var coin_first, coin_last;
var coin_interval_cnt;

function game_init() {
    score = 0;
    missile_interval_cnt = 0;
    coin_interval_cnt = 0;

    missile_first = null, missile_last = null;
    coin_first = null, coin_last = null;

    o_jet = new objJet(310, 750); 
}

function newGame() {
    clearInterval(objInterval);
    game_init();
    
    objInterval = setInterval(tick, 50);
}

function gameOver() {
    alert("game over");
}

function tick() {
    proc_user_input();
    if (collision_check()) {
        gameOver();
    }
    new_coin();
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
            var o_missile = new objMissile(o_jet.x, o_jet.y);

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

function new_coin() {
    if (coin_interval_cnt++ == 35) {
        coin_interval_cnt = 0;

        var o_coin = new objCoin(o_jet.x, o_jet.y);

        if (coin_first==null) {
            coin_first = o_coin;
            coin_last = o_coin;
        } else {
            o_coin.prev = coin_last;
            coin_last.next = o_coin;
            coin_last = o_coin;
        }
    }
}

function collision_check() {
    // check collision of missiles and coins
    var o_missile = missile_first;
    while(o_missile != null) {
        var m_x0 = o_missile.x;
        var m_x1 = m_x0 + o_missile.img.width;
        var m_y0 = o_missile.y;
        var m_y1 = m_y0 + o_missile.img.height;
        var o_coin = coin_first;
        while(o_coin != null) {
            var c_x0 = o_coin.x;
            var c_x1 = c_x0 + o_coin.img.width;
            var c_y0 = o_coin.y;
            var c_y1 = c_y0 + o_coin.img.height;
            if (m_x0 < c_x1 && m_x1 > c_x0 && m_y0 < c_y1 && m_y1 > c_y0) {
                if (o_coin.prev == null) {
                    coin_first = o_coin.next;
                } else {
                    o_coin.prev.next = o_coin.next;
                }
                if (o_coin.next == null) {
                    coin_last = o_coin.prev;
                } else {
                    o_coin.next.prev = o_coin.prev;
                }
            }
            o_coin = o_coin.next;            
        }
        o_missile = o_missile.next;
    }

    // check collision of coins and airplane
}