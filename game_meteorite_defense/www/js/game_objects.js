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
    }
    this.render = function(ctx_game) {
        if (this.img != null) {
            ctx_game.drawImage(this.img, this.x, this.y);
        }
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

function objMet(x, y, size) {
    gameobj.call(this, x, y);
    this.size = size;
    this.step_x = Math.random() * 20 - 10;
    this.step_y = Math.random() * 10 + 1;
    this.rgb = "rgb(" + (Math.random() * 240 + 16) + "," + (Math.random() * 240 + 16) + "," + (Math.random() * 240 + 16) + ")";
    this.move = function() {
        this.x += this.step_x;
        if (this.x > 720) {
            this.x = 720 * 2 - this.x;
            this.step_x *= -1;
        } else if (this.x < 0) {
            this.x = 0 - this.x;
            this.step_x *= -1;
        }
        this.y += this.step_y;
        if (this.y > 900) {
            this.y = 0;
        }
    };
    this.render = function(ctx_game) {
        ctx_game.beginPath();
        ctx_game.strokeStyle = this.rgb;
        ctx_game.moveTo(this.x + this.size / 3, this.y);
        ctx_game.lineTo(this.x, this.y + this.size / 3);
        ctx_game.lineTo(this.x, this.y + 2 * this.size / 3);
        ctx_game.lineTo(this.x + this.size / 3, this.y + this.size);
        ctx_game.lineTo(this.x + 2 * this.size / 3, this.y + this.size);
        ctx_game.lineTo(this.x + this.size, this.y + 2 * this.size / 3);
        ctx_game.lineTo(this.x + this.size, this.y + this.size / 3);
        ctx_game.lineTo(this.x + 2 * this.size / 3, this.y);
        ctx_game.closePath();
        ctx_game.lineWidth = 3;
        ctx_game.stroke();
    };
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
