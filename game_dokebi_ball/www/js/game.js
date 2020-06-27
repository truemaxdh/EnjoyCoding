// concerning game frame
var frame = {
  animation_interval : 0,
  last_animation_time : 0,
  pause : true,
  gameover_flag : false;
  effect_flag : false
}

// concerning game play
var gamePlay = {
  score : 0,
  ball_interval : 0,
  millisec_played : 0,
  stage : 0,
  o_game_over : null;
}

// concerning balls
var balls_ends = [null, null];

function _stage_def() {
  this.max_stage = 10;
  this.stage_tick = 40000;
  this.next_ball_interval = 10000;
  this.ball_sizes = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
}

var currentStageDef;

function newGame() {
    frame.pause = true;

    frame.gameover_flag = false;
    frame.effect_flag = false;
    gamePlay.score = 0;
    currentStageDef = new _stage_def();
    gamePlay.millisec_played = 0;
    //gamePlay.stage = _stage;
    
    currentStageDef.next_ball_interval -= 400 * (gamePlay.stage - 1);
            
    gamePlay.o_game_over = null;
    
    ball_ends[0] = new gameobj(0,0), ball_ends[1] = new gameobj(0,0);
    ball_ends[0].next = ball_ends[1];
    ball_ends[1].prev = ball_ends[0];
    
    gamePlay.ball_interval = 0;
    gamePlay.millisec_played = currentStageDef.stage_tick * (gamePlay.stage - 1) + 1;    
    
    frame.last_animation_time = 0;

    frame.pause = false;
    document.getElementById( 'bgm' ).play();
    requestAnimationFrame(tick);
}

function tick(cur_time) {
    frame.animation_interval = cur_time - (frame.last_animation_time==0 ? cur_time : frame.last_animation_time);
    frame.last_animation_time = cur_time;
    gamePlay.millisec_played += frame.animation_interval;
    
    if (!frame.effect_flag) {
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

function gameOver() {
  if (o_game_over == null) {
    frame.gameover_flag = true;
    o_game_over = new objGameOver();
    o_jet.game_over();
  } else if (o_game_over.count_down-- == 0) {
    document.getElementById( 'bgm' ).pause();
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

function proc_user_input() {
  if (user_pressing) {
  /* var dx = user_x - user_x_ori;
    var dy = user_y - user_y_ori;
    user_x_ori = user_x;
    user_y_ori = user_y;

    o_jet.x += dx;
    o_jet.y += dy;

    if (missile_interval >= stage_design.missile_interval) {
      missile_interval -= stage_design.missile_interval;
      var o_missile = new objMissile(o_jet.x, o_jet.y);
      push_to_chain(o_missile, missile_ends);  
    } 
    missile_interval += frame.animation_interval;*/
  } else {
    /*missile_interval = stage_design.missile_interval;*/
  }
}

function upcoming_obj() {
  if (stage < stage_design.max_stage && millisec_played > (stage_design.stage_tick * stage)) {
    effect_flag = true;
    balls_ends[0].next = balls_ends[1];
    balls_ends[1].prev = balls_ends[0];
    var o_stageClear = new objStageClear(stage);
    push_to_chain(o_stageClear, coin_ends);
    currentStageDef.next_ball_interval -= 400;
    gamePlay.ball_interval = 0;
    gamePlay.stage++;
  } else {
    gamePlay.ball_interval += frame.animation_interval;
    if (gamePlay.ball_interval > currentStageDef.next_ball_interval) {
        var rnd = parseInt(Math.random() * currentStageDef.ball_sizes[stage-1].length);
        var o_ball = new objBall(360, 0,  currentStageDef.ball_sizes[stage-1]);
        push_to_chain(o_ball, ball_ends);  
        gamePlay.ball_interval -= currentStageDef.next_ball_interval;
    }
  }
}

function collision_check() {
  if (user_pressing) {
    // check collision of clicked(touched) position and balls
    var o_chk = new gameobj(user_x, user_y);
    var o_ball = collision_obj_grp(o_chk, ball_ends);;
    while(o_ball.next != null) {
      if (o_ball != null) {
        //playSound(--o_coin.durability);
        remove_from_chain(o_ball, ball_ends);
        score += 10;
        try {
            chkAndUnlockAchievement(score);
        } catch(err) {}
      }
    }
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
  var t = ends[0].next;
  while(t.next != null) {
    if (t.collision_chk(obj.x, obj.y, 0, 0)) {
      ret = t;
      break;
    }
    t = t.next;            
  }

  return ret;
}
