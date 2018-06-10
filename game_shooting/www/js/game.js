// concerning game frame
var animation_interval;
var last_animation_time;
var pause = true;
var o_game_over;
var gameover_flag;

// concerning score
var score;

// concerning airplane
var o_jet;
var missile_ends = [null, null];
var missile_interval_cnt;

// concerning coins
var coin_ends = [null, null];
var coin_bullet_ends = [null, null]; 

// concerning stage
var millisec_played;
var stage;
var stage_second = 50;
// [[tick_cnt, coin_type, coin_interval, bullet_interval],....]
var stage_design = [
    [50000, 0, 5000, 5000],  [110000, 0, 4500, 4500],   [170000, 0, 4000, 4000],   [230000, 0, 3500, 3500], 
    [290000, 1, 3000, 3000], [350000, 1, 2500, 2500],  [410000, 1, 2000, 2000],  [470000, 1, 1500, 1500],
    [530000, 2, 1000, 1000], [590000, 2, 500, 500]
];
//var stage_design = [[200, 35, 100], [400, 30, 80], [600, 25, 60], [800, 20, 40], [1000, 15, 20], [1200, 10, 10]];
var upcoming_interval_cnt;
function game_init() {
    gameover_flag = false;
    score = 0;
    missile_interval_cnt = 0;
    millisec_played = 0;
    stage = 0;
    
    o_game_over = null;
    o_jet = new objJet(310, 750);
    
    missile_ends[0] = new gameobj(0,0), missile_ends[1] = new gameobj(0,0);
    missile_ends[0].next = missile_ends[1];
    missile_ends[1].prev = missile_ends[0];
    
    coin_ends[0] = new gameobj(0,0), coin_ends[1] = new gameobj(0,0);
    coin_ends[0].next = coin_ends[1];
    coin_ends[1].prev = coin_ends[0];
    
    coin_bullet_ends[0] = new gameobj(0,0), coin_bullet_ends[1] = new gameobj(0,0);
    coin_bullet_ends[0].next = coin_bullet_ends[1];
    coin_bullet_ends[1].prev = coin_bullet_ends[0];
    
    last_animation_time = 0;
}

function newGame() {
    // clearInterval(objInterval);
    pause = true;
    game_init();
    pause = false;
    // objInterval = setInterval(tick, 50);
    requestAnimationFrame(tick);
}

function togglePause() {
    /*if (objInterval > 0) {
        clearInterval(objInterval);
        objInterval = -1;
    } else {
        objInterval = setInterval(tick, 50);
    }*/
    pause = !pause;
    if (!pause) {
      requestAnimationFrame(tick);
    }
}

function gameOver() {
    if (o_game_over == null) {
        gameover_flag = true;
        o_game_over = new objGameOver();
        o_jet.game_over();
    } else if (o_game_over.count_down-- == 0) {
        // clearInterval(objInterval);
        pause = true;
        if (isApp) {
            window.game.submitScore(leaderboardId, score);
            window.game.onSubmitScoreSucceeded = function() {
                OpenUserResult();
            };
            window.game.onSubmitScoreFailed = function() {
                OpenUserResult();
            };
        } else {
            OpenUserResult();
        }
        document.getElementById('user_score').innerHTML = score;
//        return;
    }
    o_game_over.render(ctx_game);
}

function tick(cur_time) {
    animation_interval = cur_time - (last_animation_time==0 ? cur_time : last_animation_time);
    last_animation_time = cur_time;
    millisec_played += animation_interval;
    
    upcoming_obj();
    render();
    if (gameover_flag) {
        gameOver();
    } else {
        proc_user_input();
        collision_check();
    }
    
    if (!pause) {
      requestAnimationFrame(tick);
    }
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
            push_to_chain(o_missile, missile_ends);  
        } else if (missile_interval_cnt >= 10) {
            missile_interval_cnt = 0;
        }
    } else {
        missile_interval_cnt = 0;
    }
}

function upcoming_obj() {
    //tick_cnt++;
    
    // get stage
    if (stage < (stage_design.length - 1) && millisec_played > stage_design[stage][0]) {
        stage++;
    }

    if ((parseInt(millisec_played) % stage_design[stage][2]) == 0) {
        var o_coin = new objCoinGray(o_jet.x, o_jet.y, stage_design[stage][1]);
        push_to_chain(o_coin, coin_ends);  
    }

    if ((parseInt(millisec_played) % stage_design[stage][3]) == 0) {
        var o_coin_bullet = new objCoinBullet(o_jet.x, o_jet.y);
        push_to_chain(o_coin_bullet, coin_bullet_ends);  
    }
}

function collision_check() {
    // check collision of missiles and coins
    var o_missile;
    o_missile = missile_ends[0].next;
    while(o_missile.next != null) {
        var o_coin = collision_obj_grp(o_missile, coin_ends); 
        if (o_coin != null && --o_coin.durability <= 0) {
            remove_from_chain(o_coin, coin_ends);
            remove_from_chain(o_missile, missile_ends);
            score += o_coin.coin_num;
            chkAndUnlockAchievement(score);
        }
        o_missile = o_missile.next;
    }

    // check collision of coins and airplane
    var o_coin = collision_obj_grp(o_jet, coin_ends);
    if (o_coin != null) {
        remove_from_chain(o_coin, coin_ends);
        gameover_flag = true;
    }

    // check collision of coin bullet and airplane
    var o_coin_bullet = collision_obj_grp(o_jet, coin_bullet_ends);
    if (o_coin_bullet != null) {
        remove_from_chain(o_coin_bullet, coin_bullet_ends);
        gameover_flag = true;
    }
}

function push_to_chain(obj, ends) {
    ends[1].prev.next = obj;
    obj.prev = ends[1].prev;
    obj.next = ends[1];
    ends[1].prev = obj;
}

function remove_from_chain(obj, ends) {
    obj.prev.next = obj.next;
    obj.next.prev = obj.prev;
}

function collision_obj_grp(obj, ends) {
    var ret = null;
    var o_x0 = obj.x;
    var o_x1 = o_x0 + obj.img.width;
    var o_y0 = obj.y;
    var o_y1 = o_y0 + obj.img.height;
    
    var t = ends[0].next;
    while(t.next != null) {
        var t_x0 = t.x;
        var t_x1 = t_x0 + t.img.width;
        var t_y0 = t.y;
        var t_y1 = t_y0 + t.img.height;
        if (o_x0 < t_x1 && o_x1 > t_x0 && o_y0 < t_y1 && o_y1 > t_y0) {
            ret = t;
            break;
        }
        t = t.next;            
    }

    return ret;
}
