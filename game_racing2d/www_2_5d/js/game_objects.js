class gameobj {
    constructor(x, y, z, r, dx, dy, dz) {
        this.center = new Vector3D(x, y, z);
        this.r = r;
        this.speed = new Vector3D(dx, dy, dz);
        
        this.prev = null;
        this.next = null;

        this.objID = gObj.objID++;
    }
    
    move() {
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

class objCam extends gameobj {
    constructor() {
        super(0, 0, gObj.vanishingDt, 0, 0, 0, 0);
        this.accel = new Vector3D(0, 0, -100);
        this.maxSpeedV3 = -1000;

        console.log(this.objID + ":cam");
    }

    move() {
        this.speed.add(this.accel);
        
        if (this.speed.v3 < this.maxSpeedV3) {
            this.speed.v3 = this.maxSpeedV3;
        }

        this.center.v1 += this.speed.v1;

        this.accel.v1 *= 0.8;
        this.speed.multiply1D(0.8);

        super.move();
    }

    getFactor(vec3D) {
        return vec3D.v3 / this.center.v3;
    }

    realCoord(vec3D) {
        let f = this.getFactor(vec3D);
        let XY0 = vec3D.clone().subtract(this.center).multiply1D(f);
        XY0.add(new Vector3D(gObj.camXYH.x, gObj.camXYH.y, -XY0.v3));
        return XY0;
    }
}

class extraobj extends gameobj {
    constructor(cam, x, y, z, r) {
        super(x, y, z, r, 0, 0, 0);
        this.cam = cam;

        if (cam.next != null) {
            this.next = cam.next;
            cam.next.prev = this;
        }
        this.prev = cam;
        cam.next = this;
        
    }

    move() {
        this.center.v3 -= this.cam.speed.v3;     
        super.move();
        
        if (this.center.v3 > this.cam.center.v3) {
            //console.log(this.objID + "expire");
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
            const drawPos = this.cam.realCoord(vectors[i]);
            console.log(this.objID + ":" + drawPos.v1 + "," + drawPos.v2);
            if (i == 0) ctx.moveTo(drawPos.v1, drawPos.v2);
            else ctx.lineTo(drawPos.v1, drawPos.v2);
        }
        ctx.closePath();
        ctx.fill();
    }
}

class objCar extends extraobj {
    constructor(cam) {
        const r = 100;
        super(cam, 0, gObj.camXYH.h, cam.center.v3 - 300 - r, r);
        
        this.fixedCenter = this.center.clone();
        
        this.rotate = 0;
        this.unitRotate = Math.PI / 6;
        this.bodyColor = "orange";
        this.wheelColor = "black";
        this.carIdx = 0;

        console.log(this.objID + ":car");
    }

    move() {
        this.center.v1 = this.cam.center.v1;
    }
    
    render() {
        const c = this.center;
        const r = this.r;
        //console.log(this.objID + ":" + c.v1 + "," + c.v2 + "," + c.v3 + "," + r);
        super.fillPoligon([
            new Vector3D(c.v1 - this.r, c.v2, c.v3 - this.r * 10),
            new Vector3D(c.v1 + this.r, c.v2, c.v3 - this.r * 10),
            new Vector3D(c.v1 + this.r, c.v2, c.v3 + this.r),
            new Vector3D(c.v1 - this.r, c.v2, c.v3 + this.r)
        ], this.bodyColor);

        speedSound(this.carIdx, this.speed.v2);

        super.render();
    }    
}

class objRoad extends extraobj {
    constructor(cam, lastRoad) {
        let center, r = 400;
        if (lastRoad == null)
            center = new Vector3D(0, gObj.camXYH.h, 0);
        else {
            center = lastRoad.center.clone();
            center.v1 = center.v1 + 20 * (Math.random() - 0.5);
            //center.v2 = prune(center.v2 + 10 * (Math.random() - 0.5), 0, 80);
            r = lastRoad.r;
        }
        super(cam, center.v1, center.v2, 0, r);
        
        this.lastRoad = lastRoad;
        this.color = 'beige';
        this.lineColor = 'yellow';
        this.lineR = 30;
        this.len = 1000;
        this.flgNewRoad = true;        
    }

    render() {
        if (this.lastRoad != null) {
            const c = this.center;
            const r = this.r;
            const lastC = this.lastRoad.center;
            const lastR = this.lastRoad.r;             
            
            // road
            super.fillPoligon([
                new Vector3D(c.v1 - r, c.v2, c.v3),
                new Vector3D(c.v1 + r, c.v2, c.v3),
                new Vector3D(lastC.v1 + lastR, lastC.v2, lastC.v3),
                new Vector3D(lastC.v1 - lastR, lastC.v2, lastC.v3),
            ], this.color);

            // center line
            const lineR = this.lineR;
            const lineEnd = c.clone().add(lastC.clone().subtract(c).multiply1D(0.5));
            super.fillPoligon([
                new Vector3D(c.v1 - lineR, c.v2, c.v3),
                new Vector3D(c.v1 + lineR, c.v2, c.v3),
                new Vector3D(lineEnd.v1 + lineR, lineEnd.v2, lineEnd.v3),
                new Vector3D(lineEnd.v1 - lineR, lineEnd.v2, lineEnd.v3)
            ], this.lineColor);        
        }
        
        if (this.flgNewRoad && this.center.v3 > this.len) {
            
            new objRoad(this.cam, this);
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
            gObj.init();
        }
    }
}   

let gObj = {
    cam: null,
    gameOver: null,
    stageClear: null,
    vanishingDt: 10000,
    camXYH: null,
    init : function() {
        this.camXYH = {
            x: gameCanvas.w / 2, 
            y: gameCanvas.h / 3,
            h: gameCanvas.h * 2 / 3};
        console.log(this.camXYH);
        this.cam = new objCam();
        new objCar(this.cam);
        new objRoad(this.cam, null);
    },
    move : function() {
        this.cam.move();
    },
    render : function() {
        this.cam.render();
    },
    objID : 0
}
