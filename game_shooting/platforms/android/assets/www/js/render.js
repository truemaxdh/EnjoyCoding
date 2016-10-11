var img_sea = new Image();
var img_sea2 = new Image();
var img_island = new Image();
//var img_airplane = new Image();
var canv_bg;
var ctx_bg;
var canv_game;
var ctx_game;
var bg_y = 1800;

var imgs = [img_sea, img_sea2, img_island];
var URLs = ['img/sea.png', 'img/sea2.png', 'img/island.png'];

function render_init(callback1, callback2) {
    canv_bg = document.getElementById('bg_canvas');
    ctx_bg = canv_bg.getContext('2d');

    canv_game = document.getElementById('game_canvas');
    ctx_game = canv_game.getContext('2d');

    var imagesOK = 0; 
    for (var i=0; i<imgs.length; i++) {
        imgs[i].onload = function(){ 
            if (++imagesOK>=imgs.length ) {
                draw_bg_canv(callback1, callback2);
            }
        };
        imgs[i].src = URLs[i];
    }    
}

function draw_bg_canv(callback1, callback2) {
    
    for (var i = 0; i < 10; i++) {
        var img_sea_rnd = (Math.random() < 0.5) ? img_sea : img_sea2;
        for (var j = 0; j < 4; j++) {
            var img_rnd = (Math.random() < 0.8) ? img_sea_rnd : img_island;
            ctx_bg.drawImage(img_rnd, j * 180, i * 180);
        }
    }
    
    ctx_bg.drawImage(canv_bg, 0, 0, 720, 900, 0, 1800, 720, 900);  

    callback1(callback2);
}

function render() {
    render_scroll();
    if (missile_ends[0] != null) {
        missile_ends[0].render(ctx_game);
    }
    if (coin_ends[0] != null) {
        coin_ends[0].render(ctx_game);
    }
    if (coin_bullet_ends[0] != null) {
        coin_bullet_ends[0].render(ctx_game);
    }

    o_jet.render(ctx_game);
    
    ctx_game.fillStyle = '#ffa500';
    ctx_game.font = '35px Sniglet-ExtraBold';
    ctx_game.fillText('Score : ' + score, 20, 50);
    ctx_game.fillText('Stage : ' + stage, 300,50);
    //ctx_game.fillText('%[1] : ' + tick_cnt % stage_design[stage][1], 20,80);
    
}
function render_scroll() {
    ctx_game.drawImage(canv_bg, 0, bg_y, 720, 900, 0, 0, 720, 900);
    bg_y -= 3;
    if (bg_y < 0) bg_y = 1800;
}
