let canv_game;
let ctx_game;
let msg = '';

let w,h;

function render_init() {
  canv_game = document.getElementById('game_canvas_landscape');

  w=canv_game.width;
  h=canv_game.height;
  
  ctx_game = canv_game.getContext('2d');
}

function render() {
  //clears canvas
  ctx_game.clearRect(0,0,w,h);

  drawScore()

  o_mainChr.render();

  drawMissile();
}

function drawMissile() {
  // Draw Missile
  if (missileX >= 0)
  {
      missileY-=20;
      if (missileY>=0)
      {
          ctx_game.beginPath();
          ctx_game.rect(missileX-3, missileY, 6, h-missileY);
          ctx_game.closePath();
          ctx_game.stroke();
          ctx_game.fill();
      }
      else
          missileX=-999;
  }
}

function drawScore() {
    // Draw Score
    ctx_game.fillText("Stage: "+stage, 0, 30);
    ctx_game.fillText("Remained: "+remained, 260, 30);
    ctx_game.fillText("Score: "+score, 520, 30);
    
}