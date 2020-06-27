var img_pause = new Image();

var canv_game;
var ctx_game;


var imgs = [img_pause];
var URLs = ['img/pause.png'];

function render_init() {
  canv_game = document.getElementById('game_canvas');
  ctx_game = canv_game.getContext('2d');    
  
  var imagesOK = 0; 
    for (var i=0; i<imgs.length; i++) {
        imgs[i].onload = function(){ 
            if (++imagesOK>=imgs.length ) {
                //draw_bg_canv();
            }
        };
        imgs[i].src = URLs[i];
    }
}

function render() {
  // afterimage
  ctx_game.globalCompositeOperation = 'source-over';
  ctx_game.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx_game.fillRect(0, 0, 720, 540);

  balls_ends[0].render(ctx_game);
    
  ctx_game.fillStyle = '#ffa500';
  ctx_game.font = '35px Sniglet-ExtraBold';
  ctx_game.fillText('Score : ' + gamePlay.score, 20, 50);
  ctx_game.fillText('Stage : ' + gamePlay.stage, 270,50);
    
  ctx_game.drawImage(img_pause, 0, 0, 40, 40, 480, 20, 40, 40)
}
