const storageName = {
    maxStage : "mdMaxClearedStage",
    mileage : "mdMileage"
}

// concerning game play
var gamePlay = {
    score : 0,
    mileage : 0,

    animation_interval : 0,
    last_animation_time : 0,
    pause : true,
    gameover_flag : false,
    // concerning extra effect
    effect_flag : false,

    max_stage : 14,
    stage_tick : 50000,
    missile_interval : [200, 600],
    missiles : [objMissile, objMissile2],

    millisec_played : 0,
    stage : 0
}

// airplane
var o_jet;

// missile
var missile_0;
var missile_interval;

// meteorites
var met_0;
var met_interval;

// bonus item
var item_0;

let stage_design;
var _stage_design = [
    { stage : 1, met_interval : 1500, met_types : [30, 60] },
    { stage : 2, met_interval : 1600, met_types : [60] },
    { stage : 3, met_interval : 1500, met_types : [30, 60, 90] },
    { stage : 4, met_interval : 1600, met_types : [60, 90] },
    { stage : 5, met_interval : 1700, met_types : [90] },
    { stage : 6, met_interval : 1500, met_types : [30, 60, 90, 120] },
    { stage : 7, met_interval : 1600, met_types : [60, 90, 120] },
    { stage : 8, met_interval : 1700, met_types : [90, 120] },
    { stage : 9, met_interval : 1800, met_types : [120] },
    { stage : 10, met_interval : 1500, met_types : [30, 60, 90, 120, 150] },
    { stage : 11, met_interval : 1600, met_types : [60, 90, 120, 150] },
    { stage : 12, met_interval : 1700, met_types : [90, 120, 150] },
    { stage : 13, met_interval : 1800, met_types : [120, 150] },
    { stage : 14, met_interval : 1900, met_types : [150] },
];

function gameInit() {
    try {
      if (!localStorage.getItem(storageName.mileage))
        localStorage.setItem(storageName.mileage, 0);
      gamePlay.mileage = Number(localStorage.getItem(storageName.mileage));
    } catch(err) {}

    render_init();
    init_user_input();
    pageChange('menu');
}

function newStage() {
    missile_0 = new gameobj(0,0);    
    met_0 = new gameobj(0,0);
    item_0 = new gameobj(0,0);
    
    stage_design = _stage_design[gamePlay.stage - 1];
    missile_interval = gamePlay.missile_interval.map();
    met_interval = 0;
    
    gamePlay.last_animation_time = 0;
    gamePlay.millisec_played = gamePlay.stage_tick * (gamePlay.stage - 1) + 1;    
    gamePlay.effect_flag = false;
    
    gamePlay.mileage += 10;
    try {
      localStorage.setItem(storageName.mileage, gamePlay.mileage);
    } catch(err) {}
}

function newGame() {
    gamePlay.pause = true;
    gamePlay.gameover_flag = false;
    gamePlay.score = 0;
    
    o_jet = new objJet(310, 750);
    o_game_over = null;
    
    newStage();
    gamePlay.pause = false;
    playBGM();
    requestAnimationFrame(tick);
}

function gameOver() {
    if (o_game_over == null) {
        gamePlay.gameover_flag = true;
        o_game_over = new objGameOver();
        try {
            Android.vibrate(300);
        } catch(e) {}  
    } else if (o_game_over.count_down-- == 0) {
        pauseBGM();
        gamePlay.pause = true;        
        if (isApp && glGameSvc.loginStatus) {
          try {  
            Android.submitScore(glGameSvc.leaderboardId, gamePlay.score);
          } catch(e) {
            Android.showToast("submitScoe failed.");
          }

        }
        OpenUserResult();
        document.getElementById('user_score').innerHTML = gamePlay.score;
        document.getElementById('user_mileage').innerHTML = gamePlay.mileage;
    }
    o_game_over.render(ctx_game);
}

function tick(cur_time) {
    if (gamePlay.last_animation_time==0) gamePlay.last_animation_time = cur_time;
    gamePlay.animation_interval = cur_time - gamePlay.last_animation_time;
    if (gamePlay.animation_interval > 30) {
        gamePlay.last_animation_time = cur_time;
        gamePlay.millisec_played += gamePlay.animation_interval;

        if (!gamePlay.effect_flag) {
            upcoming_obj();
        }
        render();
        if (gamePlay.gameover_flag) {
            gameOver();
        } else {
            proc_user_input();
            if (!gamePlay.effect_flag) {
                collision_check();
            }
        }
    }
    if (!gamePlay.pause) {
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
        
        for(let i = 0; i < gamePlay.missile.length; i++) {
            if (missile_interval[i] >= gamePlay.missile_interval[i]) {
                missile_interval[i] -= gamePlay.missile_interval[i];
                const cnt = (i == 0) ? 1 : (gamePlay.stage - 1);
                let dx = (1 - cnt) / 2;
                for(let i = 0; i < cnt; i++) {
                    let o_missile = new gamePlay.missile[i](o_jet.x, o_jet.y, dx);
                    push_to_chain(o_missile, missile_0);
                }
            }
            missile_interval += gamePlay.animation_interval;
        }
        playSound(sounds.fire);
    } else {
        missile_interval = gamePlay.missile_interval.map();
    }
}

function upcoming_obj() {
    // get stage
    if (gamePlay.stage < gamePlay.max_stage && gamePlay.millisec_played > (gamePlay.stage_tick * gamePlay.stage)) {
        gamePlay.effect_flag = true;
        var o_stageClear = new objStageClear();
        push_to_chain(o_stageClear, met_0);
        met_interval = 0;
    } else {
        met_interval += gamePlay.animation_interval;
        if (stage_design.met_types.length > 0 && met_interval > stage_design.met_interval) {
            var o_met = new objMet(Math.random() * 540, 0, stage_design.met_types[parseInt(Math.random() * stage_design.met_types.length)]);
            push_to_chain(o_met, met_0);  
            met_interval -= stage_design.met_interval;
        }
    }
}

function hitMet(o_met) {
    playSound(sounds.hitMeteorite);
    remove_from_chain(o_met);
    gamePlay.score += 20;
    o_met.size -= 30;
    if (o_met.bonusItem > 0) {
        push_to_chain(new objItemProtection(o_met.x, o_met.y), item_0);
    }
    if (o_met.size > 0) {
        o_met.divide();
    }            
    try {
        chkAndUnlockAchievement(gamePlay.score);
    } catch(err) {}
}

function collision_check() {
    // check collision of missiles and coins
    var o_missile;
    o_missile = missile_0;
    while(o_missile.next != null) {
        o_missile = o_missile.next;
        var o_met = collision_obj_grp(o_missile, met_0);
        if (o_met != null) {
            remove_from_chain(o_missile);
            hitMet(o_met);
        }
    }

    // check collision of bonus item and airplane
    var o_item = collision_obj_grp(o_jet, item_0);
    if (o_item != null) {
        remove_from_chain(o_item);
        playSound(sounds.protection);
        o_jet.protection += 150;
    }
    
    // check collision of mets and airplane
    var o_met = collision_obj_grp(o_jet, met_0);
    if (o_met != null) {
        if (o_jet.protection > 0) {
            hitMet(o_met);
        } else {
            remove_from_chain(o_met);
            gamePlay.gameover_flag = true;
        }
    }
}

function push_to_chain(obj, obj0) {
    obj.next = obj0.next;
    obj0.next = obj;
    obj.prev = obj0;
    if (obj.next != null)
        obj.next.prev = obj;
}

function remove_from_chain(obj) {
    obj.prev.next = obj.next;
    if (obj.next != null)
        obj.next.prev = obj.prev;    
}

function collision_obj_grp(obj, target0) {
    var ret = null;
    var o_x0 = obj.x + obj.margin_x;
    var o_x1 = obj.x + obj.width - obj.margin_x;
    var o_y0 = obj.y + obj.margin_yt;
    var o_y1 = obj.y + obj.height - obj.margin_yb;
    
    var t = target0;
    while(t.next != null) {
        t = t.next;
        var t_x0 = t.x + t.margin_x;
        var t_x1 = t.x + t.width - t.margin_x;
        var t_y0 = t.y + t.margin_yt;
        var t_y1 = t.y + t.height - t.margin_yb;
        if (o_x0 < t_x1 && o_x1 > t_x0 && o_y0 < t_y1 && o_y1 > t_y0) {
            ret = t;
            break;
        }
    }

    return ret;
}
