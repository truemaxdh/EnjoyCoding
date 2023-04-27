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

function objStairs(length) {
    this.stairLength = length;
    this.xArr = [];
    this.x = 50;
    this.minX = 0;
    this.maxX = 100;
    this.y = 0;
    this.showXCnt = 7;
    this.showYCnt = 10;    
    this.fillStairs = function() {
        let nextX = this.x;
        xArr.push(nextX);
        while(xArr.length < this.stairLength) {
            let lr = (Math.random() < 0.5) ? -1 : 1;
            let tmpNextX = nextX + lr;
            if (tmpNextX < this.minPos || tmpNextX > this.maxPos) {
                lr *= -1;
            }
            nextX += lr;
            this.xArr.push(nextX);
        }
    }
    this.fillStairs();

    this.move = function(lr) {
        this.x += lr;
        this.y++;
    }

    this.render = function() {
        const stepX = gameCanvas.w / this.showXCnt;
        const stepY = gameCanvas.h / this.showYCnt;
        const ctx = gameCanvas.ctx;
        
        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0, gameCanvas.w, gameCanvas.h);

        ctx.fillStyle = "#afa";
        for(let i = 1; i < this.showYCnt; i++) {
            const yIdx = this.y + i;
            const showX = this.xArr[yIdx];
            const showY = this.showYCnt - i;
            
            ctx.fillRect(showX * stepX, showY * stepY, stepX, stepY);
        }
    }
}

function objProtagonist() {
    this.move = function() {}
    this.render = function() {}
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

let gameObjects = {
    stairs: null,
    protagonist: null,
    gameOver: null,
    stageClear: null,
    init : function() {
        this.stairs = new objStairs(100);
        this.protagonist = new objProtagonist();
        this.gameOver = new objGameOver();
    },
    move : function(lr) {
        this.stairs.move(lr);
        this.protagonist.move();
    },
    render : function() {
        this.stairs.render();
        this.protagonist.render();
    }
}
