var img_pause = new Image();

var canv_game;
var ctx_game;

function render_init() {
  canv_game = document.getElementById('game_canvas');
  ctx_game = canv_game.getContext('2d');    
}

function render() {
  // afterimage
  ctx_game.globalCompositeOperation = 'source-over';
  ctx_game.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx_game.fillRect(0, 0, 720, 540);

  balls_ends[0].render(ctx_game);
    
  ctx_game.fillStyle = '#ffa500';
  ctx_game.font = '35px Sniglet-ExtraBold';
  ctx_game.fillText('Score : ' + score, 20, 50);
  ctx_game.fillText('Stage : ' + stage, 270,50);
    
  ctx_game.drawImage(img_pause, 0, 0, 40, 40, 480, 20, 40, 40)
}
