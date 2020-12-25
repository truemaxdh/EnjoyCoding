// concerning game frame
var frame = {
    animation_interval : 0,
    last_animation_time : 0,
    pause : true,
    gameover_flag : false
}

// concerning score
var score;

// concerning airplane
var o_jet;
var missile_0;
var missile_interval;

// concerning meteorites
var met_0;
var met_interval;

// concerning stage
var millisec_played;
var stage;

function _stage_def() {
    this.max_stage = 5;
    this.stage_tick = 50000;
    this.missile_interval = 200;
    this.met_interval = 4000;
    this.stg1_met_interval = 4000;
    this.met_types = [[20], [40], [60], [80], [100]];
}

var stage_design;

// concerning extra effect
var effect_flag;

function game_init() {
    frame.gameover_flag = false;
    effect_flag = false;
    score = 0;
    stage_design = new _stage_def();
    missile_interval = stage_design.missile_interval;
    millisec_played = 0;
    
    stage_design.met_interval -= 400 * (stage - 1);
            
    o_game_over = null;
    o_jet = new objJet(310, 750);
    
    missile_0 = new gameobj(0,0);
    missile_0.next = new gameobj(0,0);
    missile_0.next.prev = missile_0;
    
    met_0 = new gameobj(0,0);
    met_0.next = new gameobj(0,0);
    met_0.next.prev = met_0;
    
    met_interval = 0;
    
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
    if (frame.last_animation_time==0) frame.last_animation_time = cur_time;
    frame.animation_interval = cur_time - frame.last_animation_time;
    if (frame.animation_interval > 30) {
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
    }
    if (!frame.pause) {
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
        
        if (missile_interval >= stage_design.missile_interval) {
            missile_interval -= stage_design.missile_interval;
            var o_missile = new objMissile(o_jet.x, o_jet.y);
            push_to_chain(o_missile, missile_0);  
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
        var o_stageClear = new objStageClear(stage);
        push_to_chain(o_stageClear, met_0);
        stage_design.met_interval -= 400;
        met_interval = 0;
        stage++;
    } else {
        met_interval += frame.animation_interval;
        if (stage_design.met_types[stage-1].length > 0 && met_interval > stage_design.met_interval) {
            var rnd = parseInt(Math.random() * stage_design.met_types[stage-1].length);
            var o_met = new objMet(o_jet.x, 0, stage_design.met_types[stage-1][rnd]);
            push_to_chain(o_met, met_0);  
            met_interval -= stage_design.met_interval;
        }
    }
}

function collision_check() {
    // check collision of missiles and coins
    var o_missile;
    o_missile = missile_0;
    while(o_missile.next != null) {
        o_missile = o_missile.next;
        var o_met = collision_obj_grp(o_missile, met_0);
        if (o_met != null) {
            playSound(0);
            remove_from_chain(o_missile);
            remove_from_chain(o_met);
            score += 20;
            o_met.size -= 20;
            if (o_met.size > 0) {
                push_to_chain(new objMet(o_met.x, o_met.y, o_met.size), met_0);
                push_to_chain(new objMet(o_met.x, o_met.y, o_met.size), met_0);
            }            
            try {
                chkAndUnlockAchievement(score);
            } catch(err) {}
        }
    }

    // check collision of mets and airplane
    var o_met = collision_obj_grp(o_jet, met_0);
    if (o_met != null) {
        remove_from_chain(o_met);
        frame.gameover_flag = true;
    }
}

function push_to_chain(obj, obj0) {
    obj.next = obj0.next;
    obj0.next = obj;
    obj.prev = obj0;
    obj.next.prev = obj;
}

function remove_from_chain(obj) {
    obj.next.prev = obj.prev;
    obj.prev.next = obj.next;    
}

function collision_obj_grp(obj, target0) {
    var ret = null;
    var o_x0 = obj.x + obj.margin_x;
    var o_x1 = obj.x + obj.width - obj.margin_x;
    var o_y0 = obj.y + obj.margin_y;
    var o_y1 = obj.y + obj.height - obj.margin_y;
    
    var t = target0;
    while(t.next != null) {
        t = t.next;
        var t_x0 = t.x + t.margin_x;
        var t_x1 = t.x + t.width - t.margin_x;
        var t_y0 = t.y + t.margin_y;
        var t_y1 = t.y + t.height - t.margin_y;
        if (o_x0 < t_x1 && o_x1 > t_x0 && o_y0 < t_y1 && o_y1 > t_y0) {
            ret = t;
            break;
        }
    }

    return ret;
}
