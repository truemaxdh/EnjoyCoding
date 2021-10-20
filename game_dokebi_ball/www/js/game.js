// concerning game frame
var frame = {
  animation_interval : 30,
  last_animation_time : 0,
  pause : true,
  gameover_flag : false,
  effect_flag : false
}

// concerning game play
var gamePlay = {
  score : 0,
  ball_interval : 0,
  lastBallTimeStamp : 0,
  millisec_played : 0,
  stage : 0,
  o_game_over : null,
  eliminatedBallCnt : 0
}

// concerning balls
var balls_ends = [null, null];

function _objStage(stageNum) {
  this.totalBallCnt = stageNum;
  this.ballInterval = 10000;
  this.ballSize = 5;
}

function _stage_def() {
  this.max_stage = 10;
  this.stage_tick = 60000;
  this.next_ball_interval = 5000;
  this.ball_sizes = [5, 5, 5, 5, 5, 5, 5, 5, 6, 6];
}

let currentStageDef;
let objStage;

function newGame() {
  frame.pause = true;
  frame.gameover_flag = false;
  frame.effect_flag = false;
  gamePlay.score = 0;
  gamePlay.eliminatedBallCnt = 0;
  
  objStage = new _objStage(gamePlay.stage);
  
  currentStageDef = new _stage_def();
  gamePlay.millisec_played = 0;

  currentStageDef.next_ball_interval -= 400 * (gamePlay.stage - 1);

  gamePlay.o_game_over = null;

  balls_ends[0] = new gameobj(0,0), balls_ends[1] = new gameobj(0,0);
  balls_ends[0].next = balls_ends[1];
  balls_ends[1].prev = balls_ends[0];

  gamePlay.ball_interval = currentStageDef.next_ball_interval;
  gamePlay.millisec_played = currentStageDef.stage_tick * (gamePlay.stage - 1) + 1;    

  frame.last_animation_time = 0;

  frame.pause = false;
  document.getElementById( 'bgm' ).play();
  requestAnimationFrame(tick);
}

function tick(timeStamp) {
  if ((timeStamp - frame.last_animation_time) > frame.animation_interval) {
    frame.last_animation_time = timeStamp;;
    gamePlay.millisec_played += frame.animation_interval;

    balls_ends[0].move();
    if (!frame.effect_flag) {
      upcoming_obj();
    }
    render();

    if (frame.gameover_flag) {
      gameOver();
    } else {
      proc_user_input();
      if (!frame.effect_flag) {
        collision_check();
      }
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
  } else {
  }
}

function upcoming_obj() {
  //if (gamePlay.stage < currentStageDef.max_stage && gamePlay.millisec_played > (currentStageDef.stage_tick * gamePlay.stage)) {
  if (gamePlay.stage < currentStageDef.max_stage && gamePlay.eliminatedBallCnt >= (16 * gamePlay.stage)) {
    effect_flag = true;
    balls_ends[0].next = balls_ends[1];
    balls_ends[1].prev = balls_ends[0];
    var o_stageClear = new objStageClear(gamePlay.stage);
    push_to_chain(o_stageClear, balls_ends);
    currentStageDef.next_ball_interval -= 400;
    gamePlay.ball_interval = currentStageDef.next_ball_interval;
    gamePlay.stage++;
  } else {
    //gamePlay.ball_interval += frame.animation_interval;
    //if (gamePlay.ball_interval > currentStageDef.next_ball_interval) {
    if (objStage.totalBallCnt > 0 && (frame.last_animation_time - gamePlay.lastBallTimeStamp) >= objStage.ballInterval) {
      gamePlay.lastBallTimeStamp = frame.last_animation_time;
      var o_ball = new objBall(360, 60,  objStage.ballSize);
      push_to_chain(o_ball, balls_ends);
      //gamePlay.ball_interval -= currentStageDef.next_ball_interval;
    }
  }
}

function collision_check() {
  if (user_pressing) {
    // check collision of clicked(touched) position and balls
    var o_chk = new gameobj(user_x, user_y);
    var o_catched_ball = collision_obj_grp(o_chk, balls_ends);;
    if (o_catched_ball != null) {
      //playSound(--o_coin.durability);
      remove_from_chain(o_catched_ball, balls_ends);
      if (--o_catched_ball.size > 0) {
        push_to_chain(new objBall(o_catched_ball.x, o_catched_ball.y, o_catched_ball.size), balls_ends);
        push_to_chain(new objBall(o_catched_ball.x, o_catched_ball.y, o_catched_ball.size), balls_ends);
      } else {
        gamePlay.eliminatedBallCnt++;
      }
      gamePlay.score += 10;
      try {
        chkAndUnlockAchievement(gamePlay.score);
      } catch(err) {}
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
