function objJet() {
    this.x;
    this.y;
    this.img = new Image();
    this.img.src = 'img/airplane.png';
    this.render = function(ctx_game) {
        ctx_game.drawImage(this.img, this.x, this.y);
    }
}

function objMissile() {
    this.x;
    this.y;
    this.prev = null;
    this.next = null;
    this.img = new Image();
    this.img.src = 'img/missile.png';
    this.render = function(ctx_game) {
        ctx_game.drawImage(this.img, this.x, this.y);
        if (this.next != null) {
            this.next.render(ctx_game);
        }

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