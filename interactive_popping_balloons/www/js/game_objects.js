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
        super.render();
    }    
}

class objBalloon extends gameobj {
    constructor() {
        super(getRndInt(0, gameCanvas.w), gameCanvas.h, 
            Math.min(gameCanvas.w, gameCanvas.h) / 20 * (1 + Math.random()),
            0,
            - (Math.random() * gameCanvas.h / 70 + 1));
        this.style = (Math.random() >= 0.5) ? "fill" : "stroke";
        //this.bgr = get{r:this.getNewC(-1), g:this.getNewC(-1), b:this.getNewC(-1)};
        this.bgr = getRndColor(25, 25, 25, 231);
    }
     
    render() {
        const ctx = gameCanvas.ctx;
        ctx.beginPath();
         
        ctx.arc(this.center.v1, this.center.v2, this.r, 0, 2 * Math.PI);
        ctx.moveTo(this.center.v1, this.center.v2 + this.r);
        ctx.lineTo(this.center.v1 - this.r / 5, this.center.v2 + this.r * 1.2);
        ctx.lineTo(this.center.v1 + this.r / 5, this.center.v2 + this.r * 1.2);
        ctx.lineTo(this.center.v1, this.center.v2 + this.r);
        if (this.style == "fill") {
            ctx.fillStyle = this.bgr;
            ctx.fill();
        } else {
            ctx.strokeStyle = this.bgr;
            ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.strokeStyle = this.bgr;
        ctx.moveTo(this.center.v1, this.center.v2 + this.r * 1.2);
        ctx.quadraticCurveTo(this.center.v1 + this.r * 0.15, this.center.v2 + this.r * 1.45, this.center.v1, this.center.v2 + this.r * 1.7);
        ctx.quadraticCurveTo(this.center.v1 - this.r * 0.15, this.center.v2 + this.r * 1.95, this.center.v1, this.center.v2 + this.r * 2.2);
        ctx.quadraticCurveTo(this.center.v1 + this.r * 0.15, this.center.v2 + this.r * 2.45, this.center.v1, this.center.v2 + this.r * 2.7);
        ctx.quadraticCurveTo(this.center.v1 - this.r * 0.15, this.center.v2 + this.r * 2.95, this.center.v1, this.center.v2 + this.r * 3.2);
        ctx.stroke();
        super.render();
    }

    hitTheWall() {
        if (this.center.v2 < -100) {
            this.center.v2 = gameCanvas.h;
            this.center.v1 = getRndInt(0, gameCanvas.w);
        }
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

        gameCanvas.ctx.fillStyle = "#777";
        gameCanvas.ctx.font = '50px Sniglet-ExtraBold';
        gameCanvas.ctx.fillText('GameOver', c_x - 130, c_y - 25);

        this.count_down--;
        if (this.count_down <= 0) {
            document.getElementById( 'bgm' ).pause();
            gamePlay.pause = true;        
            if (isApp && glGameSvc.loginStatus) {
                try {  
                    Android.submitScore(glGameSvc.leaderboardId, score);
                } catch(e) {
                    Android.showToast("submitScoe failed.");
                }
            }
            OpenUserResult();
            document.getElementById('user_score').innerHTML = score;
        }
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

        gameCanvas.ctx.fillStyle = "#777";
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
    oTouch : null,
    gameOver: null,
    stageClear: null,
    mainChainFirst : new gameobj(),
    mainChainLast : new gameobj(),
    init : function() {
        this.gameOver = new objGameOver();
        this.mainChainFirst.next = this.mainChainLast;
        this.mainChainLast.prev = this.mainChainFirst;
    },
    move : function() {
        this.mainChainFirst.move();
    },
    render : function() {
        this.mainChainFirst.render();
    },
    push_to_chain : function(obj) {
        obj.prev = this.mainChainLast.prev;
        obj.next = this.mainChainLast;
        this.mainChainLast.prev.next = obj;
        this.mainChainLast.prev = obj;
    },
    remove_from_chain : function(obj) {
        obj.prev.next = obj.next;
        obj.next.prev = obj.prev;
    }      
}