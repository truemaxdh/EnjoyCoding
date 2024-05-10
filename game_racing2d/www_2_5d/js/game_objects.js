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
        this.maxSpeedV3 = -180;

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
        return 200 / (this.center.v3 - vec3D.v3);
    }

    realCoord(vec3D) {
        let f = this.getFactor(vec3D);
        let XY0 = vec3D.clone().subtract(this.center).multiply1D(f);
        XY0.add(new Vector3D(gObj.camXYH.x, gObj.camXYH.y, -XY0.v3));
        return XY0;
    }
}

class extraobj extends gameobj {
    constructor(cam, x, y, z, r, car = null) {
        super(x, y, z, r, 0, 0, 0);
        this.cam = cam;
        if (car == null) {
            if (cam.next != null) {
                this.next = cam.next;
                cam.next.prev = this;
            }
            this.prev = cam;
            cam.next = this;
        } else {
            this.car = car;

            this.next = car;
            this.prev = car.prev;

            car.prev.next = this;
            car.prev = this;

            console.log("quiz:" + this.objID);
        }

    }

    move() {
        this.center.v3 -= this.cam.speed.v3;     
        super.move();
        
        if (this.center.v3 > (this.cam.center.v3 + this.cam.maxSpeedV3)) {
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
            // if (color == "orange")
            //     console.log(this.objID + ":" + drawPos.v1 + "," + drawPos.v2);
            if (i == 0) ctx.moveTo(drawPos.v1, drawPos.v2);
            else ctx.lineTo(drawPos.v1, drawPos.v2);
        }
        ctx.closePath();
        ctx.fill();
    }

    fillText(vector, size, color, text) {
        const drawPos = this.cam.realCoord(vector);
        const f = this.cam.getFactor(vector);
        const ctx = gameCanvas.ctx;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = Math.floor(size * f) + "px bold Arial";
        ctx.fillStyle = color;
        ctx.fillText(text, drawPos.v1, drawPos.v2);
        // ctx.strokeStyle = 'beige';
        // ctx.lineWidth = 1;
        // ctx.strokeText(text, drawPos.v1, drawPos.v2);
    }
}

class objCar extends extraobj {
    constructor(cam) {
        const r = 90;
        super(cam, 0, gObj.camXYH.h - 15, cam.center.v3 - 210 - r, r);
        
        this.fixedCenter = this.center.clone();
        
        this.rotate = 0;
        this.unitRotate = Math.PI / 6;
        this.bodyColor = "orange";
        this.bodyColor2 = "chocolate";
        this.bodyColor3 = "coral";
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
        
        [c.v1 - this.r, c.v1 + this.r].forEach(v1=>{
            [c.v3 - this.r + 40, c.v3 + this.r - 30].forEach(v3=>{
                super.fillPoligon([
                    new Vector3D(v1 - 20, c.v2, v3 - 20),
                    new Vector3D(v1 + 20, c.v2, v3 - 20),
                    new Vector3D(v1 + 20, c.v2, v3 + 20),
                    new Vector3D(v1 - 20, c.v2, v3 + 20)
                ], this.wheelColor);
            });
        });

        super.fillPoligon([
            new Vector3D(c.v1 - this.r, c.v2, c.v3 - this.r),
            new Vector3D(c.v1 + this.r, c.v2, c.v3 - this.r),
            new Vector3D(c.v1 + this.r, c.v2, c.v3 + this.r),
            new Vector3D(c.v1 - this.r, c.v2, c.v3 + this.r)
        ], this.bodyColor);
        
        super.fillPoligon([
            new Vector3D(c.v1 - this.r + 30, c.v2 - 35, c.v3 + 10),
            new Vector3D(c.v1 + this.r - 30, c.v2 - 35, c.v3 + 10),
            new Vector3D(c.v1 + this.r - 10, c.v2 - 35, c.v3 + this.r - 5),
            new Vector3D(c.v1 - this.r + 10, c.v2 - 35, c.v3 + this.r - 5)
        ], this.bodyColor2);

        super.fillPoligon([
            new Vector3D(c.v1 - this.r + 10, c.v2 - 35, c.v3 + this.r - 5),
            new Vector3D(c.v1 + this.r - 10, c.v2 - 35, c.v3 + this.r - 5),
            new Vector3D(c.v1 + this.r, c.v2, c.v3 + this.r),
            new Vector3D(c.v1 - this.r, c.v2, c.v3 + this.r)
        ], this.bodyColor3);

        speedSound(this.carIdx, this.speed.v2);

        super.render();
    }    
}

class objRoad extends extraobj {
    constructor(cam, lastRoad) {
        let center, r = 400, len = 500;
        if (lastRoad == null)
            center = new Vector3D(0, gObj.camXYH.h, cam.center.v3 + cam.maxSpeedV3 - len);
        else {
            center = lastRoad.center.clone();
            //center.v1 = center.v1 + 20 * (Math.random() - 0.5);
            //center.v2 = prune(center.v2 + 10 * (Math.random() - 0.5), 0, 80);
            center.v3 -= len;
            r = lastRoad.r;
        }
        super(cam, center.v1, center.v2, center.v3, r);
        
        this.lastRoad = lastRoad;
        this.color = 'whitesmoke';
        this.lineColor = 'gold';
        this.lineR = 30;
        this.len = len;
        this.flgNewRoad = true;        
    }

    move() {
        super.move();
        this.car_collision_chk();
    }

    render() {
        if (this.lastRoad != null) {
            let c = this.center.clone();
            if (this.flgNewRoad) {
                c.v3 = 0;
            }
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
            c = this.center.clone();
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

    car_collision_chk() {
        const carCent = gObj.car.center;
        const camCent = this.cam.center;
        const cent = this.center;
        if (carCent.v3 > (cent.v3 - this.len) &&
          carCent.v3 < (cent.v3 + this.len)) {
            const carR = gObj.car.r;
            const lLimit = cent.v1 - this.r;
            const rLimit = cent.v1 + this.r;
            if ((camCent.v1 - carR) < lLimit) {
                camCent.v1 = 2 * (lLimit + carR) - camCent.v1;
                if (gObj.car.speed.v1 < 0) gObj.car.speed.v1 *= -1;
            }
            if ((carCent.v1 + carR) > rLimit) {
                camCent.v1 = 2 * (rLimit - carR) - camCent.v1;
                if (gObj.car.speed.v1 > 0) gObj.car.speed.v1 *= -1;
            }
        }
    }
}

class objQuiz extends extraobj {
    constructor() {
        super(gObj.cam, 0, 0, 0, 500, gObj.car);
        
        this.leftColor = 'orange';
        this.rightColor = 'darkslateblue';

        this.leftChar = String.fromCharCode(65 + Math.random() * 26);
        this.rightChar = this.leftChar;
        while(this.leftChar == this.rightChar)
            this.rightChar = String.fromCharCode(65 + Math.random() * 26);
        this.answer = (Math.random() < 0.5) ? this.leftChar : this.rightChar;

        this.chkFlag = true;
    }

    move() {
        super.move();
        TTS.speech(this.answer);
        this.car_collision_chk();
    }

    render() {
        const r = this.r;
        const c = this.center;

        // panel
        super.fillPoligon([
            new Vector3D(c.v1 - r, c.v2 - r / 2, c.v3),
            new Vector3D(c.v1, c.v2 - r / 2, c.v3),
            new Vector3D(c.v1, c.v2 + r / 2, c.v3),
            new Vector3D(c.v1 - r, c.v2 + r / 2, c.v3)
        ], this.rightColor);
        super.fillPoligon([
            new Vector3D(c.v1, c.v2 - r / 2, c.v3),
            new Vector3D(c.v1 + r, c.v2 - r / 2, c.v3),
            new Vector3D(c.v1 + r, c.v2 + r / 2, c.v3),
            new Vector3D(c.v1, c.v2 + r / 2, c.v3)
        ], this.leftColor);

        // alphabet
        super.fillText(new Vector3D(c.v1 - r / 2, c.v2, c.v3), 
            r, this.leftColor, this.leftChar);
        super.fillText(new Vector3D(c.v1 + r / 2, c.v2, c.v3), 
            r, this.rightColor, this.rightChar);
        
        super.render();
    }

    car_collision_chk() {
        const carCent = gObj.car.center;
        const cent = this.center;
        if (carCent.v3 <= cent.v3 && this.chkFlag) {
            this.chkFlag = false;

            const selectedAnswer = (carCent.v1 < cent.v1) ? this.leftChar : this.rightChar;

            if (this.answer != selectedAnswer) {
                console.log('X');
                this.cam.speed.v3 *= -10;
            } else {
                console.log('O');
            }                
                
            new objQuiz();
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
            gObj.init();
        }
    }
}   

let gObj = {
    cam: null,
    car: null,
    gameOver: null,
    stageClear: null,
    vanishingDt: 30000,
    camXYH: null,
    init : function() {
        this.camXYH = {
            x: gameCanvas.w / 2, 
            y: gameCanvas.h / 5,
            h: gameCanvas.h * 4 / 5};
        console.log(this.camXYH);
        this.cam = new objCam();
        this.car = new objCar(this.cam);
        new objRoad(this.cam, null);
        new objQuiz();
    },
    move : function() {
        this.cam.move();
    },
    render : function() {
        this.cam.render();
    },
    objID : 0
}
