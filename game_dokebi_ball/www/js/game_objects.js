function gameobj(x, y) {
    this.x = x;
    this.y = y;
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
    };
    this.render = function(ctx_game) {
        if (this.img != null) {
            ctx_game.drawImage(this.img, this.x, this.y);
        }
        if (this.next != null) {
            this.next.render(ctx_game);
        }
        //this.move();
    };
}


function ballObj(x, y) {
    gameobj.call(this, x + 20, y);
    this.img = img_missile;
    this.step_y = -900;
}

var type_coinNum = [10, 50, 100];
function objCoin(x, y, type) {
    gameobj.call(this, x, y);
    this.step_x = 0;
    this.step_y = 200 + 30 * stage;
    this.coin_num = type_coinNum[type];
    this.img = img_coin_golds[type];
}

var type_durability = [1, 2, 3];
function objCoinGray(x, y, type) {
    var rnd_x = Math.floor(Math.random() * 540);
    gameobj.call(this, rnd_x, 0);
    this.step_x = (x - rnd_x);
    this.step_y = 220 + 30 * stage;
    this.coin_num = type_coinNum[type];
    this.durability = type_durability[type];
    //this.img.src = 'img/coin_gray_' + this.coin_num + '.png';
    this.img = img_coin_grays[type];
}

function objCoinBullet(x, y) {
    var rnd_x = Math.floor(Math.random() * 720);
    gameobj.call(this, rnd_x, 0);
    this.step_y = 200 + 50 * stage;
    this.step_x = (x - rnd_x) * this.step_y / y;
    this.img = img_coin_bullet;
}

function objGameOver() {
    this.count_down = 100;
    this.render = function(ctx_game) {
        var c_x = ctx_game.canvas.width / 2;
        var c_y = ctx_game.canvas.height / 2;
        
        // create radial gradient
        var grd = ctx_game.createRadialGradient(c_x, c_y, 10, c_x, c_y, 150);
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
    this.count_down = 3000;
    this.render = function(ctx_game) {
        var c_x = ctx_game.canvas.width / 2;
        var c_y = ctx_game.canvas.height / 2;
        
        // create radial gradient
        // Create gradient
        var grd=ctx_game.createLinearGradient(0, 0, ctx_game.canvas.width,0);
        grd.addColorStop("0","magenta");
        grd.addColorStop("0.5","blue");
        grd.addColorStop("1.0","red");
        
        ctx_game.fillStyle = grd;
        ctx_game.font = '50px Sniglet-ExtraBold';
        ctx_game.fillText('Stage' + stage + ' Clear!', c_x - 200, c_y - 25);
        this.count_down -= frame.animation_interval;
        if (this.count_down <= 0) {
            effect_flag = false;
            coin_ends[0].next = coin_ends[1];
            coin_ends[1].prev = coin_ends[0];
        }
    }
}   
