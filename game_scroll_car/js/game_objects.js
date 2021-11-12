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
        super(0, 0, 1000, 0, 1);
        this.forestColor = "#2b2";
        this.landColor = "#f0db66";
        this.runningLength = 0;
        this.vWidth = 60;
        this.vHeight = 80;
        this.vRoadWidth = this.vWidth / 2;
        this.length = 1000;

        this.lBound=[];
        let nextLBound = (this.vWidth - this.vRoadWidth) / 2;
        for(let i = 0; i < this.length; i++) {
            this.lBound.push(nextLBound);
            nextLBound = prune(nextLBound + getRndInt(-1, 3), 1, this.vWidth - this.vRoadWidth - 2);
        }
    }
    
    move() {
        this.runningLength += this.speed.v2;
    }

    render() {
        const stepX = gameCanvas.w / this.vWidth;
        const stepY = gameCanvas.h / this.vHeight;
        const ctx = gameCanvas.ctx;
        for(let i = 0; i < this.vHeight; i++) {
            const vIndex = this.length - this.runningLength - this.vHeight + i;
            const vXBoundary1 = this.lBound[vIndex];
            const vXBoundary2 = this.lBound[vIndex] + this.vRoadWidth;
            ctx.fillStyle = this.forestColor;
            ctx.fillRect(0, i * stepY, vXBoundary1 * stepX, stepY);
            ctx.fillRect(vXBoundary2 * stepX, i * stepY, gameCanvas.w - vXBoundary2 * stepX, stepY);
            ctx.fillStyle = this.landColor;
            ctx.fillRect(vXBoundary1 * stepX, i * stepY, (vXBoundary2 - vXBoundary1) * stepX, stepY);
        }
    }    
}

class objCar extends gameobj {
    constructor() {
        super(270, 500, 25, 0, 0);
        this.img = new Image();
        this.img.src = "mainChr_tran.png";
    }
     
    render() {
        this.accel.v1 *= 0.8;
        this.speed.v1 *= 0.8;
        gameCanvas.ctx.drawImage(this.img, this.center.v1, this.center.v2);
        if (this.next != null) {
            this.next.render();
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
    car: null,
    road: null,
    init : function() {
        this.car = new objCar();
        this.road = new objRoad();
    },
    move : function() {
        this.car.move();
        this.road.move();
    },
    render : function() {
        this.road.render();
        this.car.render();
    }
}
