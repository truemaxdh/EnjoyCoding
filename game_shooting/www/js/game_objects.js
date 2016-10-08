function gameobj(x, y) {
    this.x = x;
    this.y = y;
    this.prev = null;
    this.next = null;
    this.img = new Image();
    this.move = function() {};
    this.render = function(ctx_game) {
        ctx_game.drawImage(this.img, this.x, this.y);
        if (this.next != null) {
            this.next.render(ctx_game);
        }
        this.move();
    }
}

function objJet(x, y) {
    gameobj.call(this, x, y);
    this.img.src = 'img/airplane.png';
}

function objMissile(x, y) {
    gameobj.call(this, x + 20, y);
    this.img.src = 'img/missile.png';
    this.move = function() {
        this.y -= 50;
        if (this.y < 0) {
            if (this.prev!=null) {
                this.prev.next = this.next;
            }
            if (this.next!=null) {
                this.next.prev = this.prev;
            }
        }
    }
}

function objCoin(x, y) {
    var rnd_x = Math.floor(Math.random() * 720);
    gameobj.call(this, rnd_x, 0);
    this.step_x = (x - rnd_x) / 30;
    this.step_y = y / 30;
    this.img.src = 'img/coin.png';
    this.move = function() {
        this.x += this.step_x;
        this.y += this.step_y;
        if (this.x < 0 || this.y < 0 || this.x > 720 || this.y > 900) {
            if (this.prev!=null) {
                this.prev.next = this.next;
            }
            if (this.next!=null) {
                this.next.prev = this.prev;
            }
        }
    }
}