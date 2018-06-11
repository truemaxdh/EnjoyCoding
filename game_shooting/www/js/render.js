var img_sea = new Image();
var img_sea2 = new Image();
var img_island = new Image();
var img_pause = new Image();

var canv_bg;
var ctx_bg;
var canv_game;
var ctx_game;
var bg_y = 1800;

var imgs = [img_sea, img_sea2, img_island, img_pause];
var URLs = ['img/sea.png', 'img/sea2.png', 'img/island.png', 'img/pause.png'];

function render_init() {
    canv_bg = document.getElementById('bg_canvas');
    ctx_bg = canv_bg.getContext('2d');

    canv_game = document.getElementById('game_canvas');
    ctx_game = canv_game.getContext('2d');

    var imagesOK = 0; 
    for (var i=0; i<imgs.length; i++) {
        imgs[i].onload = function(){ 
            if (++imagesOK>=imgs.length ) {
                draw_bg_canv();
            }
        };
        imgs[i].src = URLs[i];
    }    
}

function draw_bg_canv() {    
    for (var i = 0; i < 10; i++) {
        var img_sea_rnd = (Math.random() < 0.5) ? img_sea : img_sea2;
        for (var j = 0; j < 3; j++) {
            var img_rnd = (Math.random() < 0.8) ? img_sea_rnd : img_island;
            ctx_bg.drawImage(img_rnd, j * 180, i * 180);
        }
    }
    
    ctx_bg.drawImage(canv_bg, 0, 0, 540, 900, 0, 1800, 540, 900);  
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
    ctx_game.fillText('Stage : ' + stage, 270,50);
    //ctx_game.fillText('Interval : ' + animation_interval, 20,100);
    /*var m = missile_ends[0];
    var t = 100;
    while(m != null) {
        ctx_game.fillText(m.x + ',' + m.y , 20, t);
        m = m.next;
        t += 50;
    }*/
    //ctx_game.fillText('%[1] : ' + tick_cnt % stage_design[stage][1], 20,80);
    
    ctx_game.drawImage(img_pause, 0, 0, 40, 40, 480, 20, 40, 40)

}
function render_scroll() {
    ctx_game.drawImage(canv_bg, 0, bg_y, 540, 900, 0, 0, 540, 900);
    bg_y -= 3;
    if (bg_y < 0) bg_y = 1800;
}
