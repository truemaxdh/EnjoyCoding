if (typeof specialEffects === 'undefined' || !specialEffects) {
  specialEffects = {};
}

function objBase() {
  this.prev = null;
  this.next = null;
  this.draw = function(ctx_bg) {};  
}

function objFire(w, h) {
  objBase.call();
  this.cx = Math.random() * w;
  this.cy = Math.random() * h;
  this.r = Math.random() * 15 + 5;
  this.rgb = "rgb(" + (Math.random() * 256) + "," + (Math.random() * 256) + "," + (Math.random() * 256) + ")";
  this.speed = Math.random() * w / 150 + 1;
  this.lifeCnt = 0;
  this.lifeLimit = Math.random() * 100 + 20;
  this.radiusSpan = Math.random() * 20 + 15;
  this.draw = function(ctx_bg) {
    for (var i = 0; i < this.radiusSpan; i++) {
      var x = this.cx + this.lifeCnt * this.speed * Math.cos(2 * Math.PI * i / this.radiusSpan);
      var y = this.cy + this.lifeCnt * this.speed * Math.sin(2 * Math.PI * i / this.radiusSpan);
      ctx_bg.beginPath();
      ctx_bg.fillStyle = this.rgb;
      ctx_bg.arc(x, y, this.r, 0, 2 * Math.PI);
      ctx_bg.fill();
    }
    if (++this.lifeCnt > this.lifeLimit) {
      this.prev.next = this.next;
      this.next.prev = this.prev;
    }
  }
}

specialEffects.fireworks = function(el) {
  var cnv_bg = document.createElement("CANVAS");
  cnv_bg.style.position = "relative";
  cnv_bg.style.width = el.style.width;
  cnv_bg.style.height = el.style.height;
  cnv_bg.id = "cnv_bg";
  
  var positionInfo = el.getBoundingClientRect();
  cnv_bg.width = positionInfo.width
  cnv_bg.height = positionInfo.height;
  el.appendChild(cnv_bg);

  var ctx_bg = cnv_bg.getContext("2d");
  var w = cnv_bg.width;
  var h = cnv_bg.height;

  this.fireworks.w = w;
  this.fireworks.h = h;
  this.fireworks.ctx_bg = ctx_bg;
  
  this.fireworks.listChain = {
    start : new objBase(),
    end : new objBase()
  }
  
  this.fireworks.listChain.start.next = this.fireworks.listChain.end;
  this.fireworks.listChain.end.prev = this.fireworks.listChain.start;
  
  /*this.fireworks.cx = 0;
  this.fireworks.cy = Math.random() * h;
  this.fireworks.r = Math.random() * ((w > h) ? (h / 7) : (w / 7));
  this.fireworks.rgb = "rgb(" + (Math.random() * 256) + "," + (Math.random() * 256) + "," + (Math.random() * 256) + ")"; 
  this.fireworks.gco = (Math.random() < 0.5) ? 'source-over':'lighter';
  this.fireworks.speed = Math.random() * w / 20 + 1;
  */
  this.fireworks.drawFrm();
  console.log(this);
};
  
specialEffects.fireworks.drawFrm = function() {
  var obj = specialEffects.fireworks;
  var ctx_bg = obj.ctx_bg;

  // ---------
  // bg canvas
  // ---------
  ctx_bg.globalCompositeOperation = 'source-over';
  ctx_bg.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx_bg.fillRect(0, 0, obj.w, obj.h);

  
  ctx_bg.globalCompositeOperation = 'lighter';
  var fire = obj.listChain.start;
  while((fire = fire.next) != null) {
    fire.draw(ctx_bg);
  }

  if (Math.floor(Math.random() * 40) == 0) {
    var newFire = new objFire(obj.w, obj.h);
    var tmpObj = obj.listChain.end.prev;
    tmpObj.next = newFire;
    newFire.prev = tmpObj;
    newFire.next = obj.listChain.end;
    obj.listChain.end.prev = newFire;
  }

  requestAnimationFrame(specialEffects.fireworks.drawFrm);
}
