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
  //clear canvas
  ctx_game.clearRect(0,0,w,h);

  drawScore()

  oMainChr.render();

  oMissile.render();
}

function drawScore() {
    // Draw Score
    ctx_game.fillText("Stage: "+stage, 0, 30);
    ctx_game.fillText("Remained: "+remained, 260, 30);
    ctx_game.fillText("Score: "+score, 520, 30);
    
}