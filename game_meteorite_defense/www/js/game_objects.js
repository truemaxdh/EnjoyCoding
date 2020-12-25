function gameobj(x, y) {
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.margin_x = 0;
    this.margin_y = 0;
    this.step_x = 0;    // per 33ms
    this.step_y = 0;    // per 33ms
    this.prev = null;
    this.next = null;
    this.img = null;
    this.move = function() {
        this.x += this.step_x;
        this.y += this.step_y;
        if (this.next != null) {
            this.next.move(ctx_game);
        }
    }
    this.render = function(ctx_game) {
        if (this.img != null) {
            ctx_game.drawImage(this.img, this.x, this.y);
        }
    }
    this.collision_chk = function(x0, y0, x1, y1) {
        var ret = false;
        var this_x0 = this.x + this.margin_x;
        var this_x1 = this.x + this.width - this.margin_x;
        var this_y0 = this.y + this.margin_y;
        var this_y1 = this.y + this.height - this.margin_y;
        if (this_x0 < x1 && this_x1 > x0 && this_y0 < y1 && this_y1 > y0) {
            ret = true;
        }
        return ret;
    }
}

function objJet(x, y) {
    gameobj.call(this, x, y);
    this.width = 100;
    this.height = 100;
    this.margin_x = 5;
    this.margin_y = 5;
    this.render = function(ctx_game) {
        ctx_game.beginPath();
        ctx_game.fillStyle = "brown";
        ctx_game.fillRect(this.x + 10, this.y + 50, 80, 20);
        ctx_game.fillStyle = "orange";
        ctx_game.fillRect(this.x + 30, this.y + 20, 40, 50);
        ctx_game.fillStyle = "salmon";
        ctx_game.arc(this.x + 50, this.y + 20, 20, 0, 2 * Math.PI);
        ctx_game.fill();
        
        ctx_game.beginPath();
        ctx_game.strokeStyle = "white";
        ctx_game.moveTo(this.x + 30, this.y + 70);
        ctx_game.lineTo(this.x + 30, this.y + 85);
        ctx_game.moveTo(this.x + 40, this.y + 70);
        ctx_game.lineTo(this.x + 40, this.y + 95);
        ctx_game.moveTo(this.x + 50, this.y + 70);
        ctx_game.lineTo(this.x + 50, this.y + 100);
        ctx_game.moveTo(this.x + 60, this.y + 70);
        ctx_game.lineTo(this.x + 60, this.y + 95);
        ctx_game.moveTo(this.x + 70, this.y + 70);
        ctx_game.lineTo(this.x + 70, this.y + 85);
        ctx_game.lineWidth = 2;
        ctx_game.stroke();
    }
    this.game_over = function() {
        this.render = function(ctx_game) {
            ctx_game.beginPath();
            ctx_game.strokeStyle = "white";
            ctx_game.moveTo(this.x, this.y);
            ctx_game.lineTo(this.x + 100, this.y + 100);
            ctx_game.moveTo(this.x + 100, this.y);
            ctx_game.lineTo(this.x, this.y + 100);
            ctx_game.lineWidth = 5;
            ctx_game.stroke();
        }
    }
}

function objMissile(x, y) {
    gameobj.call(this, x + 20, y);
    this.width = 5;
    this.height = 100;
    this.render = function(ctx_game) {
        ctx_game.beginPath();
        ctx_game.strokeStyle = "orange";
        ctx_game.moveTo(this.x, this.y);
        ctx_game.lineTo(this.x, this.y + 100);
        ctx_game.lineWidth = 5;
        ctx_game.stroke();
    }
    this.step_y = -20;
}

function objBall(x, y, size) {
    
}

function objGameOver() {
    
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
