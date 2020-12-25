var canv_game;
var ctx_game;


function render_init() {
  canv_game = document.getElementById('game_canvas');
  ctx_game = canv_game.getContext('2d');    
}

function render() {
    // afterimage
    ctx_game.globalCompositeOperation = 'source-over';
    ctx_game.fillStyle = "black";
    ctx_game.fillRect(0, 0, 540, 900);

    balls_ends[0].render(ctx_game);
    missile_ends[0].render(ctx_game);
    o_jet.render(ctx_game);

    ctx_game.fillStyle = '#ffa500';
    ctx_game.font = '35px Sniglet-ExtraBold';
    ctx_game.fillText('Score : ' + gamePlay.score, 20, 50);
    ctx_game.fillText('Stage : ' + gamePlay.stage, 270,50);
    ctx_game.fillText('Menu : ', 450,50);
    ctx_game.drawImage(img_pause, 0, 0, 40, 40, 480, 20, 40, 40);
    
}

