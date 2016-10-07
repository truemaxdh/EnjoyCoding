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

var o_jet = new objJet(); 

function render_init() {
    canv_bg = document.getElementById('bg_canvas');
    ctx_bg = canv_bg.getContext('2d');

    canv_game = document.getElementById('game_canvas');
    ctx_game = canv_game.getContext('2d');

    o_jet.x = 310;
    o_jet.y = 750; 
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
        for (var j = 0; j < 4; j++) {
            var img_rnd = (Math.random() < 0.8) ? img_sea_rnd : img_island;
            ctx_bg.drawImage(img_rnd, j * 180, i * 180);
        }
    }
    
    ctx_bg.drawImage(canv_bg, 0, 0, 720, 900, 0, 1800, 720, 900);  

    newGame();
}

function render() {
    render_scroll();
    if (missile_first != null) {
        missile_first.render(ctx_game);
    }
    o_jet.render(ctx_game);
    ctx_game.font = "30px Arial"
    ctx_game.fillText(user_x + ',' + user_y, 20, 30);
}
function render_scroll() {
    ctx_game.drawImage(canv_bg, 0, bg_y, 720, 900, 0, 0, 720, 900);
    bg_y -= 3;
    if (bg_y < 0) bg_y = 1800;
}
