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
    this.render = function() {
        if (this.img != null) {
            ctx_game.drawImage(this.img, this.x, this.y);
        }
        
        if (this.next != null) {
            this.next.render();
        }
        //this.move();
    }
}

function objMainChr() {    
    gameobj.call(this, w/2, h - 130);
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

    this.render = function() {
        if (this.powerShield > 0) {
            this.powerShield--;
            ctx_game.drawImage(this.imgShield, this.x, this.y, this.img.width, this.img.height);
        }
        
        ctx_game.drawImage(this.img, this.x, this.y, this.img.width * 1.7, this.img.height * 1.7);

        if (this.next != null) {
            this.next.render(ctx_game);
        }
    }
}

function objMagicBall(x, y, step_x, step_y, ballSize, ballStyle = 0) {
    gameobj.call(this, x, y);
    this.step_x = step_x;
    this.step_y = step_y;
    this.ballSize = ballSize;
    this.ballStyle = ballStyle;
    this.img = new Image();
    switch(ballStyle) {
        case 0:
            this.img.src = "magicBall.png";
            break;
        case 1:
            this.img.src = "baloonBall.png";
            break;
        case 2:
            this.img.src = "tennisBall.png";
            break;
    }
        
    this.move = function() {
        this.x += this.step_x;
        this.y += this.step_y;
        this.step_y += 0.1;

        //check limits to make bounce
        if (this.x > (w-this.ballSize) && this.step_x>0){
            this.x=w-this.ballSize;
            this.step_x=-this.step_x;
            playSound(2);
        }
        if(this.y>(h-this.ballSize) && this.step_y>0){
            this.y=h-this.ballSize;
            this.step_y=-this.step_y; 
            playSound(2);
        }
        if(this.x<this.ballSize && this.step_x<0){
            this.step_x=-this.step_x;
            playSound(2);
        }
        if(this.y<this.ballSize && this.step_y<0){
            this.step_y=-this.step_y;
            playSound(2);
        }
    }

    this.render = function() {
        ctx_game.drawImage(this.img, this.x, this.y, this.ballSize,this.ballSize);	
    }
}

function objMissile() {
    gameobj.call(this, -999, -999);
    this.r = 8;
    this.speed = 5;
    this.canFire = true;
    this.move = function() {
        if (this.x > -999)
        {
            if (balls.length > 0) {
                const target = [balls[0].x + balls[0].ballSize / 2, balls[0].y + balls[0].ballSize / 2];
                const diff = [target[0] - this.x, target[1] - this.y];
                const d = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]);
                if (d <= this.speed) {
                    this.x = target[0];
                    this.y = target[1];
                } else {
                    this.x += diff[0] * this.speed / d;
                    this.y += diff[1] * this.speed / d;
                }
            }
        }
        else
        {
            this.y -= this.speed;
            if (this.y < 0) {
                this.x = -999;
                this.y = -999;
                this.canFire = true;
            }
        }
    }

    this.render = function() {
        // Draw Missile
        if (this.x > -999)
        {
            
            ctx_game.beginPath();
            ctx_game.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            //ctx_game.rect(this.x-3, this.y, 6, h-this.y);
            ctx_game.closePath();
            ctx_game.stroke();
            ctx_game.fill();
            /*
            if (this.y>=0)
            {
                ctx_game.beginPath();
                ctx_game.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
                //ctx_game.rect(this.x-3, this.y, 6, h-this.y);
                ctx_game.closePath();
                ctx_game.stroke();
                ctx_game.fill();
            }
            else 
            {
                this.x=-999;
                this.y=-999;
                this.canFire = true;
            }*/
        }
    }

    this.fire = function() {      
        this.canFire = false;
        this.x = oMainChr.x+oMainChr.img.width/2;
        this.y = oMainChr.y;    
    }
}