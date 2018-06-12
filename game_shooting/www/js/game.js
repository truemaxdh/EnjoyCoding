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
var coin_interval;
var coin_bullet_interval;

// concerning stage
var millisec_played;
var stage;
//var stage_second = 50;
// [[tick_cnt, coin_type, coin_interval, bullet_interval],....]
/* var stage_design = [
    [50000, 0, 4000, 4000],  [110000, 0, 3600, 3600],   [170000, 0, 3200, 3200],   [230000, 0, 2800, 2800], 
    [290000, 1, 2400, 2400], [350000, 1, 2000, 2000],  [410000, 1, 1600, 1600],  [470000, 1, 1200, 1200],
    [530000, 2, 800, 800], [590000, 2, 400, 400]
];*/
var stage_design = {
    max_stage : 10,
    stage_tick : 50000,
    coin_interval : 4000,
    bullet_interval : 3000,
    coin_types : [[0], [0], [1], [1], [2], [2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]],
    coinBullets : [0, 1, 0, 1, 0, 1, 1, 1, 1, 1]
}
//console.log(stage_design.coin_types);
//console.log(stage_design.coin_types[0]);

// concerning extra effect
var effect_flag;

function game_init() {
    gameover_flag = false;
    effect_flag = false;
    score = 0;
    missile_interval_cnt = 0;
    millisec_played = 0;
    stage = 1;
    
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
    
    coin_interval = 0;
    coin_bullet_interval = 0;
    
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
    
    if (!effect_flag) {
        upcoming_obj();
    }
    render();
    if (gameover_flag) {
        gameOver();
    } else {
        proc_user_input();
        if (!effect_flag) {
            collision_check();
        }
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
    // get stage
    if (stage < stage_design.max_stage && millisec_played > (stage_design.stage_tick * stage)) {
        effect_flag = true;
        coin_ends[0].next = coin_ends[1];
        coin_ends[1].prev = coin_ends[0];
        coin_bullet_ends[0].next = coin_bullet_ends[1];
        coin_bullet_ends[1].prev = coin_bullet_ends[0];
        var o_stageClear = new objStageClear(stage);
        push_to_chain(o_stageClear, coin_ends);
        stage_design.coin_interval -= 400;
        stage_design.bullet_interval -= 300;
        coin_interval = 0;
        coin_bullet_interval = 0;
        stage++;
    } else {
        coin_interval += animation_interval;
        if (stage_design.coin_types[stage-1].length > 0 && coin_interval > stage_design.coin_interval) {
            var rnd = parseInt(Math.random() * stage_design.coin_types[stage-1].length);
            var o_coin = new objCoinGray(o_jet.x, o_jet.y, stage_design.coin_types[stage-1][rnd]);
            push_to_chain(o_coin, coin_ends);  
            coin_interval -= stage_design.coin_interval;
        }

        coin_bullet_interval += animation_interval;
        if (stage_design.coinBullets[stage-1] > 0 && coin_bullet_interval > stage_design.bullet_interval) {
            var o_coin_bullet = new objCoinBullet(o_jet.x, o_jet.y);
            push_to_chain(o_coin_bullet, coin_bullet_ends);  
            coin_bullet_interval -= stage_design.bullet_interval;
        }
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
            try {
                chkAndUnlockAchievement(score);
            } catch(err) {}
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
