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

function clearCanvas() {
  ctx_game.clearRect(0,0,w,h);
}
function render() {
  clearCanvas();
  drawScore();
  oMissile.move();
  oMissile.render();
  oMainChr.render();
}

function drawScore() {
    // Font
	  ctx_game.font = "bold 30px sans-serif";
    ctx_game.fillText("Stage: "+ gamePlay.stage, 0, 30);
    ctx_game.fillText("Remained: "+ gamePlay.remained, 260, 30);
    ctx_game.fillText("Score: "+ gamePlay.score, 520, 30);
    
}
