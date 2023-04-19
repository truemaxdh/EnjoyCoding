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

class objRoad extends gameobj {
    constructor() {
        super(0, 0, 1000, 0, 0);
        this.forestColor = "#2b2";
        this.landColor = "#f0db66";
        this.runningLength = 0;
        this.vWidth = 45;
        this.vHeight = 60;
        this.vRoadWidth = this.vWidth * 0.7;
        this.length = 1000;

        this.lBound;
        this.initBoundaries();
    }
    
    initBoundaries() {
        this.lBound = [];
        let nextLBound = Math.floor((this.vWidth - this.vRoadWidth) / 2);
        for(let i = 0; i < this.length; i++) {
            this.lBound.push(nextLBound);
            nextLBound = Math.floor(
                prune(nextLBound + getRndInt(-1, 3), 1, this.vWidth - this.vRoadWidth - 2));
        }
    }

    move() {
        this.runningLength += this.speed.v2;
    }

    render() {
        const stepX = gameCanvas.w / this.vWidth;
        const stepY = gameCanvas.h / this.vHeight;
        const ctx = gameCanvas.ctx;
        ctx.fillStyle = this.forestColor;
        ctx.fillRect(0, 0, gameCanvas.w, gameCanvas.h);

        ctx.fillStyle = this.landColor;
        for(let i = 0; i < this.vHeight; i++) {
            const vIndex = Math.floor(this.length - this.runningLength - this.vHeight + i);
            const x1 = this.lBound[vIndex] * stepX;
            const x2 = x1 + this.vRoadWidth * stepX;

            const vIndex_1 = vIndex + 1;
            const x1_1 = this.lBound[vIndex_1] * stepX;
            const x2_1 = x1_1 + this.vRoadWidth * stepX;

            ctx.beginPath();
            ctx.moveTo(x1, Math.floor(i * gameCanvas.h / this.vHeight));
            ctx.lineTo(x2, Math.floor(i * gameCanvas.h / this.vHeight));
            ctx.lineTo(x2_1, Math.floor((i + 1) * stepY));
            ctx.lineTo(x1_1, Math.floor((i + 1) * stepY));
            ctx.fill();
        }
    }
    
    collision_chk(other) {
        let d1, d2;
        [d1, d2] = this.dists(other);
        if (other.r > d1) {
            other.center.v1 += other.r - d1;
            other.speed.v2 *= -0.15;
        }
        if (other.r > d2) {
            other.center.v1 -= other.r - d2;
            other.speed.v2 *= -0.15;
        }
    }

    dists(other) {
        const stepX = gameCanvas.w / this.vWidth;
        //const stepY = gameCanvas.h / this.vHeight;
        // const vIndex = Math.floor(
        //     this.length - this.runningLength - this.vHeight + other.center.v2 / stepY) - 1;
        const vIndex = this.length - Math.floor(other.runningLength);
        const x1 = this.lBound[vIndex] * stepX;
        const x2 = x1 + this.vRoadWidth * stepX; 
        return [other.center.v1 - x1, x2 - other.center.v1];
    }
}

class objCar extends gameobj {
    constructor(road) {
        super(gameCanvas.w / 2, gameCanvas.h * 0.8, 25, 0, 0);
        this.road = road;
        this.runningLength = Math.floor(road.vHeight * 0.2);
        this.maxSpeedV2 = 3.5;
        this.accel.v2 = 0.01;
        this.rotate = 0;
        this.unitRotate = Math.PI / 6;
        this.bodyColor = "orange";
        this.wheelColor = "black";
    }

    move() {
        this.speed.add(this.accel);
        speedSound(this.speed.v2);
        if (this.speed.v2 > this.maxSpeedV2) {
            this.speed.v2 = this.maxSpeedV2;
        }

        if (this.speed.v2 < 0 || this.rotate > 0) {
            this.rotate += this.unitRotate;
            if (this.rotate >= 2 * Math.PI) {
                this.rotate = 0;
            }
        }
        this.center.v1 += this.speed.v1;
        this.runningLength += this.speed.v2;        

        this.accel.v1 *= 0.8;
        this.speed.v1 *= 0.8;
    }
    
    render() {
        const ctx = gameCanvas.ctx;
        ctx.save();
        ctx.translate(this.center.v1, this.center.v2);
        ctx.rotate(this.rotate);    
        ctx.fillStyle = this.bodyColor;
        ctx.fillRect(this.r * -0.5, -this.r, this.r, this.r * 2);
        ctx.fillStyle = this.wheelColor;
        ctx.fillRect(-this.r, -this.r, this.r * 0.4, this.r * 0.8);
        ctx.fillRect(-this.r, this.r, this.r * 0.4, this.r * -0.8);
        ctx.fillRect(this.r, -this.r, this.r * -0.4, this.r * 0.8);
        ctx.fillRect(this.r, this.r, this.r * -0.4, this.r * -0.8);
        ctx.restore();
        if (this.next != null) {
            this.next.render();
        }
    }

    collision_chk(other) {
        // collision check
        let checked = false;
        let dist = this.center.calcDist(other.center);
        let minDist = this.r + other.r;
        if (dist <= minDist) {
            let newVelocityX = elasticCollision([this.m, other.m], [this.speed.v1, other.speed.v1]);
            let newVelocityY = elasticCollision([this.m, other.m], [this.speed.v2, other.speed.v2]);
            this.speed = new Vector2D(newVelocityX[0], newVelocityY[0]);
            other.speed = new Vector2D(newVelocityX[1], newVelocityY[1]);
            checked = true;

            roughlySeparate(this, other, minDist);
        }
        return checked;
    }
}

class objCarNPC extends objCar {
    constructor(road, car) {
        super(road);
        this.car = car;
    }

    render() {
        const stepY = gameCanvas.h / this.road.vHeight;
        const dLength = this.car.runningLength - this.runningLength;
        this.center.v2 = this.car.center.v2 + dLength * stepY;
        super.render();
    }
}

class objCarAI1 extends objCarNPC {
    constructor(road, car, stage) {
        super(road, car);
        //this.center.v1 += this.r * 4;
        this.runningLength = Math.floor(road.vHeight * 0.3);
        this.maxSpeedV2 = 1.5 + stage * 0.1;
        this.accel.v1 = ((stage % 2) == 1) ? 1 : -1;
        this.bodyColor = "blue";
        this.wheelColor = "#777";
    }

    move() {
        super.move();
        let d1, d2;
        [d1, d2] = gameObjects.road.dists(this);
        if (this.r > d1) this.accel.v1 = 1;
        else if (this.r > d2) this.accel.v1 = -1;
        else this.accel.v1 *= 1. / .8;
    }
}

class objCarAI2 extends objCarNPC {
    constructor(road, car, stage) {
        super(road, car);
        //this.center.v1 += this.r * 4;
        this.runningLength = Math.floor(road.vHeight * 0.4);
        this.maxSpeedV2 = 1.5 + stage * 0.1;
        this.bodyColor = "skyblue";
        this.wheelColor = "#777";
    }

    move() {
        super.move();
        if (this.car.center.v1 > this.center.v1) this.accel.v1 = 0.5;
        if (this.car.center.v1 < this.center.v1) this.accel.v1 = -0.5;
        else this.accel.v1 = 0;
    }
}

class objCarAI3 extends objCarNPC {
    constructor(road, car, stage) {
        super(road, car);
        //this.center.v1 += this.r * 4;
        this.runningLength = Math.floor(road.vHeight * 0.5);
        this.maxSpeedV2 = 1.5 + stage * 0.1;
        this.bodyColor = "purple";
        this.wheelColor = "#777";
    }

    move() {
        super.move();
        let d1, d2;
        [d1, d2] = gameObjects.road.dists(this);
        if (d1 < d2) this.accel.v1 = 1;
        else if (d1 > d2) this.accel.v1 = -1;
        else this.accel.v1 = 0;
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
    road: null,
    car: null,
    carAI: [],
    gameOver: null,
    stageClear: null,
    init : function() {
        this.road = new objRoad();
        this.car = new objCar(this.road);
        this.carAI = [];
        this.carAI.push(new objCarAI1(this.road, this.car, gamePlay.stageNum));
        if (gamePlay.stageNum > 1) {
            this.carAI.push(new objCarAI2(this.road, this.car, gamePlay.stageNum));
        }
        if (gamePlay.stageNum > 2) {
            this.carAI.push(new objCarAI3(this.road, this.car, gamePlay.stageNum));
        }
        this.gameOver = new objGameOver();
    },
    move : function() {
        this.road.move();
        this.car.move();
        this.carAI.forEach((v, i)=>v.move());
        this.road.speed.v2 = this.car.speed.v2;
    },
    render : function() {
        this.road.render();
        this.car.render();
        this.carAI.forEach((v, i)=>v.render());
    }
}
