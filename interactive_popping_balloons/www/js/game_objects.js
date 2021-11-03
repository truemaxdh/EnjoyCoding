class gameobj {
    constructor(cx, cy, r, dx, dy) {
        this.center = new Vector2D(cx, cy);
        this.r = r;
        this.m = r * r;
        this.speed = new Vector2D(dx, dy);
        this.accel = new Vector2D(0, 0);
        this.prev = null;
        this.next = null;
    }
    
    move() {
        this.speed.add(this.accel);
        this.hitTheWall();
        this.center.add(this.speed);
        if (this.next != null) {
            this.next.move();
        }
    }

    hitTheWall() {
        let newCenter = this.center.clone();
        newCenter.add(this.speed);
        if ((newCenter.v1 - this.r) < 0 && this.speed.v1 < 0 || 
            (newCenter.v1 + this.r) > gameCanvas.w && this.speed.v1 > 0) {
                this.speed.v1 *= -1;
            }
            
        if ((newCenter.v2 - this.r) < 0 && this.speed.v2 < 0 || 
            (newCenter.v2 + this.r) > gameCanvas.h && this.speed.v2 > 0) {
                this.speed.v2 *= -1;
            }
    }

    render() {
        if (this.img != null) {
            gameCanvas.ctx.drawImage(this.img, this.center.v1, this.center.v2);
        }
        if (this.next != null) {
            this.next.render();
        }
    }

    collision_chk(other) {
        return this.center.calcDist(other.center) < (this.r + other.r);
    }
}

class objTouch extends gameobj {
    constructor(x, y) {
        super(x, y, 10, 0, 0);
    }
    
    render() {
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.strokeStyle = 'white';
        gameCanvas.ctx.arc(this.center.v1, this.center.v2, this.r, 0, 2 * Math.PI);
        gameCanvas.ctx.moveTo(this.center.v1 - this.r, this.center.v2);
        gameCanvas.ctx.lineTo(this.center.v1 + this.r, this.center.v2);
        gameCanvas.ctx.moveTo(this.center.v1, this.center.v2 - this.r);
        gameCanvas.ctx.lineTo(this.center.v1, this.center.v2 + this.r);
        gameCanvas.ctx.stroke();
    }    
}

class objBalloon extends gameobj {
    constructor(x, y, r, dx, dy) {
        super(x, y, r, dx, dy);
        this.style = (Math.random() >= 0.5) ? "fill" : "stroke";
        //this.bgr = get{r:this.getNewC(-1), g:this.getNewC(-1), b:this.getNewC(-1)};
        this.bgr = getRndColor(15, 15, 15, 240);
    }
     
    render() {
        gameCanvas.ctx.globalCompositeOperation = this.gco;
        gameCanvas.ctx.beginPath();
        gameCanvas.ctx.fillStyle = this.rgb;
        gameCanvas.ctx.arc(this.center.v1, this.center.v2, this.r, 0, 2 * Math.PI);
        gameCanvas.ctx.fill();
        if (this.invincibleTime > 0) --this.invincibleTime;
        if (this.next != null) {
            this.next.render();
        }
    }

    hitTheWall() {
        let newCenter = this.center.clone();
        newCenter.add(this.speed);    
        if ((newCenter.v1 - this.r) < 0 && this.speed.v1 < 0 || 
            (newCenter.v1 + this.r) > gameCanvas.w && this.speed.v1 > 0) {
                this.speed.v1 *= -1;
            }
            
        if ((newCenter.v2 + this.r) > gameCanvas.h && this.speed.v2 > 0) {
                this.speed.v2 *= -1;
            }
    }

    collision_chk(other) {
        return (this.invincibleTime > 0) ? false : (this.center.calcDist(other.center) < (this.r + other.r));
    }    
}

class objGameOver extends gameobj {
    constructor() {
        super(0, 0, 0, 0, 0);
        this.count_down = 100;
    }
    
    render() {
        var c_x = gameCanvas.ctx.canvas.width / 2;
        var c_y = gameCanvas.ctx.canvas.height / 2;

        // create radial gradient
        var grd = gameCanvas.ctx.createRadialGradient(c_x, c_y, 10, c_x, c_y, 150);
        // light blue
        grd.addColorStop(0, 'yellow');
        // dark blue
        grd.addColorStop(1, '#004CB3');
        gameCanvas.ctx.fillStyle = grd;
        gameCanvas.ctx.font = '50px Sniglet-ExtraBold';
        gameCanvas.ctx.fillText('GameOver', c_x - 130, c_y - 25);
    }
}

class objStageClear extends gameobj {
    constructor(stageNum) {
        super(0, 0);
        this.count_down = 100;
        this.clearedStage = stageNum
    }
     
    render() {
        var c_x = gameCanvas.ctx.canvas.width / 2;
        var c_y = gameCanvas.ctx.canvas.height / 2;

        // create radial gradient
        // Create gradient
        var grd = gameCanvas.ctx.createLinearGradient(0, 0, gameCanvas.ctx.canvas.width, 0);
        grd.addColorStop("0", "magenta");
        grd.addColorStop("0.5", "blue");
        grd.addColorStop("1.0", "red");

        gameCanvas.ctx.fillStyle = grd;
        gameCanvas.ctx.font = '50px Sniglet-ExtraBold';
        gameCanvas.ctx.fillText('Stage' + this.clearedStage + ' Clear!', c_x - 200, c_y - 25);
        this.count_down--;
        if (this.count_down <= 0) {
            gamePlay.effect_flag = false;
            gameObjects.init();
        }
    }
}   

let gameObjects = {
    ballEnds : [new gameobj(), new gameobj()],
    oTouch : null,
    init : function() {
        this.ballEnds[0].next = this.ballEnds[1];
        this.ballEnds[1].prev = this.ballEnds[0];
    },
    move : function() {
        this.ballEnds[0].move();
    },
    render : function() {
        this.ballEnds[0].render();
    },
    isBallEmpty : function() {
        return (this.ballEnds[0].next == this.ballEnds[1]);
    }
}
