class gameobj {
    constructor(x, y, z, r, dx, dy, dz) {
        this.center = new Vector3D(x, y, z);
        this.r = r;
        this.speed = new Vector3D(dx, dy, dz);
        this.accel = new Vector3D(0, 0, 0);
        this.prev = null;
        this.next = null;

        this.objID = gameObjects.objID++;
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
        super(0, 0, gameObjects.vanishingDt, 40, 0, 0, 0);
    
        this.maxSpeedV3 = 100;
        this.accel.v3 = 0.01;
        this.rotate = 0;
        this.unitRotate = Math.PI / 6;
        this.bodyColor = "orange";
        this.wheelColor = "black";
        this.carIdx = 0;

        console.log(this.objID + ":car");
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
        let XYZ = vec3D.clone().subtract(this.center).multiply1D(f);
        XYZ.add(new Vector3D(gameCanvas.w / 2, gameCanvas.h / 2, 0));
        return XYZ;
    }
}

class extraobj extends gameobj {
    constructor(car, x, y, z, r) {
        super(x, y, z, r, 0, 0, 0);
        this.car = car;
        //console.log(this.objID + ":extra");
    }

    move() {
        this.speed.v3 = this.car.speed.v3;        
        super.move();
        
        if (this.center.v3 > this.car.center.v3) {
            console.log(this.objID + "expire");
            this.prev.next = this.next;
            this.next.prev = this.prev;
        }        
    }

    fillPoligon(vectors, color) {
        const ctx = gameCanvas.ctx;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        
        for(let i = 0; i < vectors.length; i++) {
            const drawPos = this.car.realCoord(vectors[i]);
            console.log(drawPos.v1 + "," + drawPos.v2);
            if (i == 0) ctx.moveTo(drawPos.v1, drawPos.v2);
            else ctx.lineTo(drawPos.v1, drawPos.v2);
        }
        ctx.closePath();
        ctx.fill();

        //super.render();
    }
}

class objRoad extends extraobj {
    constructor(car, lastRoad) {
        let center, r = 200;
        if (lastRoad == null)
            center = new Vector3D(gameCanvas.w * 0.5, 180, 0);
        else {
            center = lastRoad.center.clone();
            center.v1 = center.v1 + 20 * (Math.random() - 0.5);
            //center.v2 = prune(center.v2 + 10 * (Math.random() - 0.5), 0, 80);
            r = lastRoad.r;
        }
        super(car, center.v1, center.v2, 0, r);
        
        this.lastRoad = lastRoad;
        this.color = 'beige';
        this.len = 100;
        this.flgNewRoad = true;

        this.prev = car;
        this.next = car.next;
        car.next.prev = this;
        car.next = this;
    }

    render() {
        if (this.lastRoad != null) {
            const c = this.center;
            const r = this.r;
            const lastC = this.lastRoad.center;
            const lastR = this.lastRoad.r; 
            super.fillPoligon([
                new Vector3D(c.v1 - this.r, c.v2, c.v3),
                new Vector3D(c.v1 + this.r, c.v2, c.v3),
                new Vector3D(lastC.v1 + lastR, lastC.v2, lastC.v3),
                new Vector3D(lastC.v1 - lastR, lastC.v2, lastC.v3),
            ], this.color);
        }
        
        if (this.flgNewRoad && this.center.v3 > this.len) {
            
            new objRoad(this.car, this);
            this.flgNewRoad = false;
        }

        super.render();
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
    vanishingDt: 1500,
    init : function() {
        this.car = new objCar();
        const dummy = new gameobj();
        this.car.next = dummy;
        dummy.prev = this.car;
        new objRoad(this.car, null);
        //this.gameOver = new objGameOver();
    },
    move : function() {
        this.car.move();
    },
    render : function() {
        const ctx = gameCanvas.ctx;
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, gameCanvas.w, gameCanvas.h);
        this.car.render();
    },
    objID : 0
}
