let img_airplane = new Image();
let img_airplane_x = new Image();
let img_missile = new Image();
const img_coin_golds = [new Image(), new Image(), new Image()];
const img_coin_grays = [new Image(), new Image(), new Image()];
const img_coin_bullet = new Image();

const img_gameObjs = [
    img_airplane, img_airplane_x, img_missile, 
    img_coin_golds[0], img_coin_golds[1], img_coin_golds[2],
    img_coin_grays[0], img_coin_grays[1], img_coin_grays[2],
    img_coin_bullet
];
const URL_gameObjs = [
    'img/airplane.png', 'img/airplane_x.png', 'img/missile.png',
    'img/coin_gold_10.png', 'img/coin_gold_50.png', 'img/coin_gold_100.png',
    'img/coin_gray_10.png', 'img/coin_gray_50.png', 'img/coin_gray_100.png',
    //'img/coin_gold_10.png', 'img/coin_gold_50.png', 'img/coin_gold_100.png',
    'img/coin_bullet.png'
];

for (var i=0; i<img_gameObjs.length; i++) {        
    img_gameObjs[i].src = URL_gameObjs[i];
}   

function gameobj(x, y) {
    this.x = x;
    this.y = y;
    this.margin_x = 0;
    this.margin_y = 0;
    this.step_x = 0;
    this.step_y = 0;
    this.prev = null;
    this.next = null;
    this.img = null;
    this.move = function() {
        this.x += this.step_x * frame.animation_interval / 1000;
        this.y += this.step_y * frame.animation_interval / 1000;
        if (this.x < 0 || this.y < 0 || this.x > 720 || this.y > 900) {
            if (this.prev!=null) {
                this.prev.next = this.next;
            }
            if (this.next!=null) {
                this.next.prev = this.prev;
            }
        }
    }
    this.render = function(ctx_game) {
        if (this.img != null) {
            ctx_game.drawImage(this.img, this.x, this.y);
        }
        if (this.next != null) {
            this.next.render(ctx_game);
        }
        this.move();
    }
}

function objJet(x, y) {
    gameobj.call(this, x, y);
    this.img = img_airplane;
    this.margin_x = 5;
    this.margin_y = 5;
    this.game_over = function() {
        this.img = img_airplane_x;
    }
}

function objMissile(x, y) {
    gameobj.call(this, x + 20, y);
    this.img = img_missile;
    this.step_y = -900;
}

const type_coinNum = [10, 50, 100];
const type_durability = [1, 2, 3];
function objCoinGray(x, y, type) {
    const rnd_x = Math.floor(Math.random() * 540);
    gameobj.call(this, rnd_x, 0);
    this.step_x = (x - rnd_x);
    this.step_y = 220 + 30 * stage;
    this.coin_num = type_coinNum[type];
    this.durability = type_durability[type];
    this.init_durability = type_durability[type];
    this.img = img_coin_golds[type];
    this.img2 = img_coin_grays[type];
    this.render = function(ctx_game) {
        ctx_game.drawImage(this.img, this.x, this.y);
        const alpha = (this.init_durability - this.durability) / this.init_durability;
        if (alpha > 0) {
            ctx_game.globalAlpha = alpha;
            ctx_game.drawImage(this.img2, this.x, this.y);
            ctx_game.globalAlpha = 1;
        }
        if (this.next != null) {
            this.next.render(ctx_game);
        }
        this.move();
    }
}

function objDeadCoin(baseCoin) {
    gameobj.call(this, baseCoin.x, baseCoin.y);
    this.step_x = baseCoin.step_x;
    this.step_y = baseCoin.step_y;
    this.coin_num = baseCoin.coin_num;
    this.img = baseCoin.img2;
    this.count_down = 1000;
    this.render = function(ctx_game) {
        ctx_game.drawImage(this.img, this.x, this.y);
        
        if (this.next != null) {
            this.next.render(ctx_game);
        }
        this.move();
        
        this.count_down -= frame.animation_interval;
        if (this.count_down <= 0) {
            remove_from_chain(this, deadCoin_ends);
        }
    }
}

function objCoinBullet(x, y) {
    let rnd_x = Math.floor(Math.random() * 720);
    gameobj.call(this, rnd_x, 0);
    this.step_y = 200 + 50 * stage;
    this.step_x = (x - rnd_x) * this.step_y / y;
    this.img = img_coin_bullet;
}

function objGameOver() {
    this.count_down = 100;
    this.render = function(ctx_game) {
        let c_x = ctx_game.canvas.width / 2;
        let c_y = ctx_game.canvas.height / 2;
        
        // create radial gradient
        let grd = ctx_game.createRadialGradient(c_x, c_y, 10, c_x, c_y, 150);
        // light blue
        grd.addColorStop(0, 'yellow');
        // dark blue
        grd.addColorStop(1, '#004CB3');
        ctx_game.fillStyle = grd;
        ctx_game.font = '50px Sniglet-ExtraBold';
        ctx_game.fillText('GameOver', c_x - 130, c_y - 25);
    }
}

function objStageClear(stage) {
    chkAndUnlockStage(stage);
    this.count_down = 3000;
    this.render = function(ctx_game) {
        let c_x = ctx_game.canvas.width / 2;
        let c_y = ctx_game.canvas.height / 2;
        
        // create radial gradient
        // Create gradient
        let grd=ctx_game.createLinearGradient(0, 0, ctx_game.canvas.width,0);
        grd.addColorStop("0","magenta");
        grd.addColorStop("0.5","blue");
        grd.addColorStop("1.0","red");
        
        ctx_game.strokeStyle = grd;
        ctx_game.lineWidth = 3;
        ctx_game.font = '50px Sniglet-ExtraBold';
        ctx_game.strokeText('Stage' + stage + ' Clear!', c_x - 200, c_y - 25);
        this.count_down -= frame.animation_interval;
        if (this.count_down <= 0) {
            remove_from_chain(this, deadCoin_ends);
        }
    }
}   
