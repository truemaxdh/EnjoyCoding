function gameobj(x, y) {
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
    this.margin_x = 0;
    this.margin_yt = 0;
    this.margin_yb = 0;
    this.step_x = 0;    // per 33ms
    this.step_y = 0;    // per 33ms
    this.prev = null;
    this.next = null;
    this.img = null;
    this.move = function() {
        this.x += this.step_x;
        this.y += this.step_y;
        if (this.y > 900 || this.y < -this.height)
            remove_from_chain(this);
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
    this.margin_x = 30;
    this.margin_yt = 5;
    this.margin_yb = 30;
    this.protection = 0;
    this.render = function(ctx_game) {
        ctx_game.beginPath();
        ctx_game.fillStyle = "brown";
        ctx_game.fillRect(this.x + 10, this.y + 50, 80, 20);
        ctx_game.fillStyle = "orange";
        ctx_game.fillRect(this.x + 30, this.y + 20, 40, 50);
        ctx_game.fill();
        
        ctx_game.beginPath();
        ctx_game.fillStyle = "crimson";
        ctx_game.strokeStyle = "orange";
        ctx_game.lineWidth = 3;
        ctx_game.arc(this.x + 50, this.y + 20, 18, Math.PI, 0);
        ctx_game.closePath();
        ctx_game.fill();
        ctx_game.stroke();
        
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
        ctx_game.lineWidth = 4;
        ctx_game.stroke();
        
        if (this.protection > 0) {
            ctx_game.beginPath();
            ctx_game.fillStyle = "rgba(255,255,255,0.5)";
            ctx_game.strokeStyle = "white";
            ctx_game.lineWidth = 2;
            ctx_game.arc(this.x + 50, this.y + 50, 50, 0, 2 * Math.PI);
            ctx_game.fill();
            ctx_game.stroke();
            this.protection--;
        }
        
        if (gamePlay.gameover_flag) {
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

function objMissile(x, y, dx) {
    gameobj.call(this, x + 47, y);
    this.width = 6;
    this.height = 50;
    this.render = function(ctx_game) {
        ctx_game.beginPath();
        ctx_game.fillStyle = "orange";
        ctx_game.fillRect(this.x, this.y, this.width, this.height);
    }
    this.step_y = -14;
}

function objMissile2(x, y, dx) {
    gameobj.call(this, x + 47, y);
    this.width = 16;
    this.height = 16;
    this.radius = 8;
    this.step_x = dx;
    this.step_y = -12;
    this.life = 1500;
    this.render = function(ctx_game) {
        ctx_game.beginPath();
        ctx_game.fillStyle = "rgba(255,140,0," + this.life / 100 + ")";
        ctx_game.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI);
        ctx_game.lineWidth = 4;
        ctx_game.stroke();

        const div = Math.sqrt(Math.pow(met_0.x - this.x, 2) + Math.pow(met_0.y - this.y, 2)) / 2;       
        this.step_x = (met_0.x - this.x) / div;
        this.step_y = (met_0.y - this.y) / div;
        
        if (this.life-- <= 0) {
            remove_from_chain(this);
        }
    }
    
}

function objMet(x, y, size) {
    gameobj.call(this, x, y);
    this.width = size;
    this.height = size;
    this.size = size;
    this.step_x = Math.random() * 13 - 6;
    this.step_y = Math.random() * 7 + 1;
    this.bonusItem = (size > 30) ? 0 : ((Math.random() < 0.05) ? 1 : 0);
    this.move = function() {
        this.x += this.step_x;
        if (this.x > 540) {
            this.x = 540 * 2 - this.x;
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
        ctx_game.strokeStyle = "white";
        //ctx_game.fillStyle = this.rgbFill;
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
        ctx_game.fill();
        ctx_game.stroke();
    };
    this.divide = function() {
        let met1 = new objMet(this.x, this.y, this.size);
        let met2 = new objMet(this.x, this.y, this.size);
        const step_x = Math.random() * 6 + 1;
        met1.step_x = -step_x;
        met2.step_x = step_x;
        met2.step_y = met1.step_y;
        push_to_chain(met1, met_0);
        push_to_chain(met2, met_0);
    }
}

function objExplode(x, y, size) {
    
}

function objItemProtection(x, y) {
    gameobj.call(this, x, y);
    this.width = 30;
    this.height = 30;
    this.step_y = 1;
    this.render = function(ctx_game) {
        ctx_game.beginPath();
        ctx_game.strokeStyle = "#cacaca";
        ctx_game.arc(this.x + 15, this.y + 15, 15, 0, 2 * Math.PI);
        ctx_game.lineWidth = 3;
        ctx_game.stroke();
        
        ctx_game.fillStyle = "#cacaca";
        ctx_game.font = '30px Sniglet-ExtraBold';
        ctx_game.fillText('P', this.x + 3, this.y + 27);
    };
}

function objGameOver() {
    this.count_down = 100;
    this.render = function(ctx_game) {
        var c_x = ctx_game.canvas.width / 2;
        var c_y = ctx_game.canvas.height / 2;
        
        // create radial gradient
        var grd = ctx_game.createRadialGradient(c_x, c_y, 10, c_x, c_y, 150);
        grd.addColorStop(0, 'yellow');
        grd.addColorStop(1, '#004CB3');
        ctx_game.fillStyle = grd;
        ctx_game.font = '50px Sniglet-ExtraBold';
        ctx_game.fillText('GameOver', c_x - 130, c_y - 25);
    }
}

function objStageClear() {
    gameobj.call(this, 0, 0);
    chkAndUnlockStage(gamePlay.stage);
    this.count_down = 3000;
    this.render = function(ctx_game) {
        var c_x = ctx_game.canvas.width / 2;
        var c_y = ctx_game.canvas.height / 2;
        
        // create radial gradient
        // Create gradient
        var grd = ctx_game.createRadialGradient(c_x, c_y, 10, c_x, c_y, 250);
        grd.addColorStop(0, 'orange');
        grd.addColorStop(1, 'white');
                
        ctx_game.fillStyle = grd;
        ctx_game.font = '50px Sniglet-ExtraBold';
        ctx_game.fillText('Stage' + gamePlay.stage + ' Clear!', c_x - 200, c_y - 25);
        this.count_down -= gamePlay.animation_interval;
        if (this.count_down <= 0) {
            gamePlay.stage++;
            newStage();
        }
    }
}   
