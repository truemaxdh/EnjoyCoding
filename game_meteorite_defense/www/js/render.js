var canv_game;
var ctx_game;


function render_init() {
  canv_game = document.getElementById('game_canvas');
  ctx_game = canv_game.getContext('2d');    
  
  var scr_w = window.innerWidth;
  var scr_h = window.innerHeight;

  if ((scr_h * 0.54) > scr_w) {
      canv_game.style.width = "100vw";    
      canv_game.style.height = "167vw";
      canv_bg.style.width = "33vw";    
      canv_bg.style.height = "167vw";
  }

  ctx_bg = canv_bg.getContext('2d');
  ctx_game = canv_game.getContext('2d');
}

function render() {
    // afterimage
    ctx_game.globalCompositeOperation = 'source-over';
    ctx_game.fillStyle = "black";
    ctx_game.fillRect(0, 0, 540, 900);

    //balls_ends[0].render(ctx_game);
    missile_ends[0].render(ctx_game);
    o_jet.render(ctx_game);

    ctx_game.fillStyle = '#ffa500';
    ctx_game.font = '35px Sniglet-ExtraBold';
    ctx_game.fillText('Score : ' + score, 20, 50);
    ctx_game.fillText('Stage : ' + stage, 270,50);
    ctx_game.fillText('Menu : ', 450,50);
}

