function gameobj(x, y) {
    this.x = x;
    this.y = y;
    this.margin_x = 0;
    this.margin_y = 0;
    this.step_x = 0;
    this.step_y = 0;
    this.prev = null;
    this.next = null;
    this.img = null;
    this.move = function() {
        this.x += this.step_x * frame.animation_interval / 1000;
        this.y += this.step_y * frame.animation_interval / 1000;
        if (this.x < 0 || this.y < 0 || this.x > 720 || this.y > 900) {
            if (this.prev!=null) {
                this.prev.next = this.next;
            }
            if (this.next!=null) {
                this.next.prev = this.prev;
            }
        }
    }
    this.render = function(ctx_game) {
        if (this.img != null) {
            ctx_game.drawImage(this.img, this.x, this.y);
        }
        
        if (this.next != null) {
            this.next.render(ctx_game);
        }
        //this.move();
    }
}

function objMainChr() {    
    gameobj.call(this, w/2, h - 75);
    this.img = new Image();
    if (sessionStorage.carStyle=="1")
    {
        this.img.src="mainChr_tran_purple.png";
    }
    else if (sessionStorage.carStyle=="2")
    {
        this.img.src="mainChr_tran_red.png";
    } else 
    {
        this.img.src="mainChr_tran.png";
    }
    
    this.powerShield = 0;
    this.imgShield = new Image();
    this.imgShield.src="tennisBall.png";

    this.render = function(ctx_game) {
        if (this.powerShield > 0) {
            this.powerShield--;
            ctx_game.drawImage(this.imgShield, this.x, this.y, this.img.width, this.img.height);
        }
        
        ctx_game.drawImage(this.img, this.x, this.y);
        console.log(this.x + "," + this.y);

        if (this.next != null) {
            this.next.render(ctx_game);
        }
        //this.move();
    }
}

function objMagicBall(x, y) {
    this.img = new Image();
    this.img.src="magicBall.png";
    gameobj.call(this, x, y);
}

function objBonusBall() {
    this.img = new Image();
    this.img.src="baloonBall.png";
    gameobj.call(this, x, y);
}

function objShield() {
    this.img = new Image();
    this.img.src="tennisBall.png";
    gameobj.call(this, x, y);
}

function objMissile(x) {
    
}