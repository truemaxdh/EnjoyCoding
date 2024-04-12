class gameobj {
    constructor(x, y, z, r, dx, dy, dz) {
        this.center = new Vector3D(x, y, z);
        this.r = r;
        this.speed = new Vector3D(dx, dy, dz);
        this.accel = new Vector3D(0, 0, 0);
        this.prev = null;
        this.next = null;
    }
    
    move() {
        this.speed.add(this.accel);
        this.center.add(this.speed);
        if (this.next != null) {
            this.next.move();
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

class objCar extends gameobj {
    constructor() {
        super(0, 0, gameObjects.vanishingDt, 50, 0, 0, 0);
    
        this.maxSpeedV3 = 3.5;
        this.accel.v3 = 0.01;
        this.rotate = 0;
        this.unitRotate = Math.PI / 6;
        this.bodyColor = "orange";
        this.wheelColor = "black";
        this.carIdx = 0;
    }

    move() {
        if (this.speed.v3 > this.maxSpeedV3) {
            this.speed.v3 = this.maxSpeedV3;
        }
        super.move();
        
        if (this.speed.v3 < 0 || this.rotate > 0) {
            this.rotate += this.unitRotate;
            if (this.rotate >= 2 * Math.PI) {
                this.rotate = 0;
            }
        }
        
        this.center.v3 = gameObjects.vanishingDt;

        this.accel.multiply1D(0.8);
        this.speed.multiply1D(0.8);
        this.accel.v3 = 0.2;
    }
    
    render() {
        const ctx = gameCanvas.ctx;
        ctx.save();
        const drawPos = this.realCoord(this.center);
        ctx.translate(drawPos.v1, drawPos.v2);
        ctx.rotate(this.rotate);
        ctx.strokeStyle = this.bodyColor;
        ctx.strokeRect(-this.r, -this.r, 2 * this.r, 2 * this.r);
        ctx.restore();

        speedSound(this.carIdx, this.speed.v2);

        if (this.next != null) {
            this.next.render();
        }
    }

    getFactor(vec3D) {
        return vec3D.v3 / this.center.v3;
    }

    realCoord(vec3D) {
        let f = this.getFactor(vec3D);
        let XYZ = this.center.clone().subtract(vec3D).multiply1D(f);
        XYZ.add(new Vector3D(gameCanvas.w / 2, gameCanvas.h / 2, 0));
        return XYZ;
    }
}

class objObstacle extends gameobj {
    constructor(car) {
        super(gameCanvas.w * (0.5 * Math.random() - 0.25), gameCanvas.h * (0.5 * Math.random() - 0.25), 0, 100, 0, 0, 0);
        this.car = car;
        this.color = getRndColor(50, 50, 50, 206);
    }

    move() {
        this.speed.v3 = this.car.speed.v3;        
        super.move();

        if (this.center.v3 > this.car.center.v3) {
            this.prev.next = this.next;
            this.next.prev = this.prev;
            console.log("expire");
        }
    }

    render() {
        const f = this.car.getFactor(this.center);
        const drawPos = this.car.realCoord(this.center);
        const ctx = gameCanvas.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect(drawPos.v1, drawPos.v2, f * this.r, f * this.r);
        
        super.render();
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
    car: null,
    gameOver: null,
    stageClear: null,
    vanishingDt: 500,
    init : function() {
        this.car = new objCar();
        const dummy = new gameobj();
        dummy.prev = this.car;
        this.car.next = dummy;
        this.gameOver = new objGameOver();
    },
    move : function() {
        this.car.move();
    },
    render : function() {
        const ctx = gameCanvas.ctx;
        ctx.fillStyle = 'beige';
        ctx.fillRect(0, 0, gameCanvas.w, gameCanvas.h);
        this.car.render();
    }
}
