var canv_game;
var ctx_game;


function render_init() {
  canv_bg = document.getElementById('bg_canvas');
  canv_game = document.getElementById('game_canvas');
  
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
  ctx_game.fillStyle = "#333";
  ctx_game.fillRect(0, 0, 540, 900);

  var o_met = met_0;
  var o_missile = missile_0;
  var o_item = item_0;
  
  while(o_met.next != null) {
    o_met = o_met.next;
    o_met.render(ctx_game);
    o_met.move();
  }
  
  while(o_missile.next != null) {
    o_missile = o_missile.next;
    o_missile.render(ctx_game);
    o_missile.move();
  }
  
  while(o_item.next != null) {
    o_item = o_item.next;
    o_item.render(ctx_game);
    o_item.move();
  }
  
  o_jet.render(ctx_game);
  
  ctx_game.fillStyle = '#ffa500';
  ctx_game.font = '30px Sniglet-ExtraBold';
  ctx_game.fillText('Score : ' + score, 20, 50);
  ctx_game.fillText('Stage : ' + stage, 250,50);
  ctx_game.font = '34px Sniglet-ExtraBold';
  ctx_game.fillText('▣', 480,50);
}

