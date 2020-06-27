function gameobj(x, y) {
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
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
    this.collision_chk = function(x0, y0, x1, y1) {
        var ret = false;
        var this_x1 = this.x + this.width;
        var this_y1 = this.y + this.height;
        
        if (this.x < x1 && this_x1 > x0 && this.y < y1 && this_y1 > y0) {
            ret = true;
        }
        return ret;
    }
}


function objBall(x, y, size) {
    gameobj.call(this, x, y);
    this.size = size;
    this.r = size * 15;
    this.step_x = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 360) + 1);
    this.step_y = 0;
    this.accel = 360;
    this.gco = (Math.random() < 0.5) ? 'source-over':'lighter';
    this.rgb = "rgb(" + (Math.random() * 240 + 16) + "," + (Math.random() * 240 + 16) + "," + (Math.random() * 240 + 16) + ")";
    this.move = function() {
        this.x += this.step_x * frame.animation_interval / 1000;
        if (this.x > 720) {
            this.x = 720 * 2 - this.x;
            this.step_x *= -1;
        } else if (this.x < 0) {
            this.x = 0 - this.x;
            this.step_x *= -1;
        }
        var elapsed_sec = frame.animation_interval / 1000;
        this.y += this.step_y * elapsed_sec + this.accel * elapsed_sec * elapsed_sec / 2;
        this.step_y += this.accel * elapsed_sec;
        if (this.y > 540) {
            this.y = 540 * 2 - this.y;
            this.step_y *= -1;
        }
        if (this.next != null) {
            this.next.move(ctx_game);
        }
    };
    this.render = function(ctx_game) {
        ctx_game.globalCompositeOperation = this.gco;
        ctx_game.beginPath();
        ctx_game.fillStyle = this.rgb;
        ctx_game.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx_game.fill();
        if (this.next != null) {
            this.next.render(ctx_game);
        }
    };
    this.collision_chk = function(x0, y0, x1, y1) {
        var ret = false;
        var dx = x0 - this.x;
        var dy = y0 - this.y;
        var d2 = dx * dx + dy * dy;
        var r2 = this.r * this.r;
        if (d2 <= r2) ret = true;
        return ret;
    };
}

function objGameOver() {
    gameobj.call(this, 0, 0);
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
    gameobj.call(this, 0, 0);
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
            frame.effect_flag = false;
            balls_ends[0].next = balls_ends[1];
            balls_ends[1].prev = balls_ends[0];
        }
    }
}   
