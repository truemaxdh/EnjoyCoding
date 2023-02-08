// concerning game frame
let frame = {
    animation_interval : 0,
    last_animation_time : 0,
    pause : true,
    gameover_flag : false
}

// concerning score
let score;

// concerning airplane
let o_jet;
let missile_ends = [null, null];
let missile_interval;

// concerning coins
let coin_ends = [null, null];
let deadCoin_ends = [null, null];
let coin_bullet_ends = [null, null]; 
let coin_interval;
let coin_bullet_interval;

// concerning stage
let millisec_played;
let stage;

function _stage_def() {
    this.max_stage = 10;
    this.stage_tick = 40000;
    this.missile_interval = 200;
    this.coin_interval = 4000;
    this.bullet_interval = 3000;
    this.stg1_coin_interval = 4000;
    this.stg1_bullet_interval = 3000;
    this.coin_types = [[0], [0], [1], [1], [2], [2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]];
    this.coinBullets = [0, 1, 0, 1, 0, 1, 1, 1, 1, 1];
}

let stage_design;/* = {
    max_stage : 10,
    stage_tick : 40000,
    missile_interval : 200,
    coin_interval : 4000,
    bullet_interval : 3000,
    coin_types : [[0], [0], [1], [1], [2], [2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]],
    coinBullets : [0, 1, 0, 1, 0, 1, 1, 1, 1, 1]
}*/

// concerning extra effect
let effect_flag;

function game_init() {
    frame.gameover_flag = false;
    effect_flag = false;
    score = 0;
    stage_design = new _stage_def();
    missile_interval = stage_design.missile_interval;
    millisec_played = 0;
    //stage = _stage;
    
    stage_design.coin_interval -= 400 * (stage - 1);
    stage_design.bullet_interval -= 300 * (stage - 1);
            
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
    
    frame.last_animation_time = 0;
    millisec_played = stage_design.stage_tick * (stage - 1) + 1;    
}

function newGame() {
    // clearInterval(objInterval);
    frame.pause = true;
    game_init();
    frame.pause = false;
    playBGM();
    requestAnimationFrame(tick);
}

function gameOver() {
    if (o_game_over == null) {
        frame.gameover_flag = true;
        o_game_over = new objGameOver();
        o_jet.game_over();
    } else if (o_game_over.count_down-- == 0) {
        // clearInterval(objInterval);
        pauseBGM();
        frame.pause = true;        
        if (isApp && glGameSvc.loginStatus) {
          try {  
            Android.submitScore(glGameSvc.leaderboardId, score);
          } catch(e) {
            Android.showToast("submitScoe failed.");
          }

        }
        OpenUserResult();
        document.getElementById('user_score').innerHTML = score;
    }
    o_game_over.render(ctx_game);
}

function tick(cur_time) {
    frame.animation_interval = cur_time - (frame.last_animation_time==0 ? cur_time : frame.last_animation_time);
    frame.last_animation_time = cur_time;
    millisec_played += frame.animation_interval;
    
    if (!effect_flag) {
        upcoming_obj();
    }
    render();
    if (frame.gameover_flag) {
        gameOver();
    } else {
        proc_user_input();
        if (!effect_flag) {
            collision_check();
        }
    }
    
    if (!frame.pause) {
        requestAnimationFrame(tick);
    }
}

function proc_user_input() {
    if (user_pressing) {
        let dx = user_x - user_x_ori;
        let dy = user_y - user_y_ori;
        user_x_ori = user_x;
        user_y_ori = user_y;

        o_jet.x += dx;
        o_jet.y += dy;
        
        if (missile_interval >= stage_design.missile_interval) {
            missile_interval -= stage_design.missile_interval;
            let o_missile = new objMissile(o_jet.x, o_jet.y);
            push_to_chain(o_missile, missile_ends);  
        } 
        missile_interval += frame.animation_interval;
    } else {
        missile_interval = stage_design.missile_interval;
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
        let o_stageClear = new objStageClear(stage);
        push_to_chain(o_stageClear, coin_ends);
        stage_design.coin_interval -= 400;
        stage_design.bullet_interval -= 300;
        coin_interval = 0;
        coin_bullet_interval = 0;
        stage++;
    } else {
        coin_interval += frame.animation_interval;
        if (stage_design.coin_types[stage-1].length > 0 && coin_interval > stage_design.coin_interval) {
            let rnd = parseInt(Math.random() * stage_design.coin_types[stage-1].length);
            let o_coin = new objCoinGray(o_jet.x, o_jet.y, stage_design.coin_types[stage-1][rnd]);
            push_to_chain(o_coin, coin_ends);  
            coin_interval -= stage_design.coin_interval;
        }

        coin_bullet_interval += frame.animation_interval;
        if (stage_design.coinBullets[stage-1] > 0 && coin_bullet_interval > stage_design.bullet_interval) {
            let o_coin_bullet = new objCoinBullet(o_jet.x, o_jet.y);
            push_to_chain(o_coin_bullet, coin_bullet_ends);  
            coin_bullet_interval -= stage_design.bullet_interval;
        }
    }
}

function collision_check() {
    // check collision of missiles and coins
    let o_missile;
    o_missile = missile_ends[0].next;
    while(o_missile.next != null) {
        let o_coin = collision_obj_grp(o_missile, coin_ends);
        if (o_coin != null) {
            playSound(--o_coin.durability);
            remove_from_chain(o_missile, missile_ends);
            if (o_coin.durability <= 0) {
                remove_from_chain(o_coin, coin_ends);
                score += o_coin.coin_num;
                let o_deadCoin = new objDeadCoin(o_coin);
                push_to_chain(o_deadCoin, deadCoin_ends);  
                try {
                    chkAndUnlockAchievement(score);
                } catch(err) {}
            }            
        }
        o_missile = o_missile.next;
    }

    // check collision of coins and airplane
    let o_coin = collision_obj_grp(o_jet, coin_ends);
    if (o_coin != null) {
        remove_from_chain(o_coin, coin_ends);
        frame.gameover_flag = true;
    }

    // check collision of coin bullet and airplane
    let o_coin_bullet = collision_obj_grp(o_jet, coin_bullet_ends);
    if (o_coin_bullet != null) {
        remove_from_chain(o_coin_bullet, coin_bullet_ends);
        frame.gameover_flag = true;
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
    let ret = null;
    let o_x0 = obj.x + obj.margin_x;
    let o_x1 = (o_x0 - obj.margin_x) + (obj.img.width - obj.margin_x);
    let o_y0 = obj.y + obj.margin_y;
    let o_y1 = (o_y0 - obj.margin_y) + (obj.img.height - obj.margin_y);
    
    let t = ends[0].next;
    while(t.next != null) {
        let t_x0 = t.x + t.margin_x;
        let t_x1 = (t_x0 - t.margin_x) + (t.img.width - t.margin_x);
        let t_y0 = t.y + t.margin_y;
        let t_y1 = (t_y0 - t.margin_y) + (t.img.height - t.margin_y);
        if (o_x0 < t_x1 && o_x1 > t_x0 && o_y0 < t_y1 && o_y1 > t_y0) {
            ret = t;
            break;
        }
        t = t.next;            
    }

    return ret;
}
