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
        if (this.next != null) {
            this.next.move(ctx_game);
        }
    };
    this.render = function(ctx_game) {
        if (this.img != null) {
            ctx_game.drawImage(this.img, this.x, this.y);
        }
        if (this.next != null) {
            this.next.render(ctx_game);
        }
    };
}


function ballObj(x, y, size) {
    gameobj.call(this, x, y);
    this.size = size;
    this.step_x = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 720) + 1);
    this.step_y = 0;
    this.accel = 10;
    this.gco = (Math.random() < 0.5) ? 'source-over':'lighter';
    this.rgb = "rgb(" + (Math.random() * 256) + "," + (Math.random() * 256) + "," + (Math.random() * 256) + ")";
    this.move = function() {
        this.x += this.step_x * frame.animation_interval / 1000;
        if (this.x > 720) {
            this.x = 720 * 2 - this.x;
            step_x *= -1;
        } else (this.x < 0) {
            this.x = 0 - this.x;
            step_x * = -1;
        }
        var elapsed_sec = frame.animation_interval / 1000;
        this.y += this.step_y * elapsed_sec + this.accel * elapsed_sec * elapsed_sec / 2;
        this.step_y += this.accel * elapsed_sec;
        if (this.y > 540) {
            this.y = 540 * 2 - this.y;
            step_y *= -1;
        }
        if (this.next != null) {
            this.next.move(ctx_game);
        }
    };
    this.render = function(ctx_game) {
        ctx_game.globalCompositeOperation = this.gco;
        ctx_game.beginPath();
        ctx_game.fillStyle = this.rgb;
        ctx_game.arc(this.x, this.y, this.size * 15, 0, 2 * Math.PI);
        ctx_game.fill();
        if (this.next != null) {
            this.next.render(ctx_game);
        }
    };
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
