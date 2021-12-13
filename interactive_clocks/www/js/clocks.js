if (typeof interactive === 'undefined' || !interactive) {
  interactive = {};
}

interactive.clocks = function(el) {
  var cnv = document.createElement("CANVAS");
  cnv.style.position = "relative";
  cnv.style.width = el.style.width;
  cnv.style.height = el.style.height;
  cnv.id = "cnv";
  
  var positionInfo = el.getBoundingClientRect();
  cnv.width = positionInfo.width
  cnv.height = positionInfo.height;
  el.appendChild(cnv);

  var ctx = cnv.getContext("2d");
  var w = cnv.width;
  var h = cnv.height;
  this.clocks.w = w;
  this.clocks.h = h;
  this.clocks.ctx = ctx;
  
  this.clocks.drawFrm();

};
  
interactive.clocks.drawFrm = function() {
  var obj = interactive.clocks;
  var ctx = obj.ctx;

  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, obj.w, obj.h);

  const today = new Date();
  const hours = ('0' + today.getHours()).slice(-2); 
  const minutes = ('0' + today.getMinutes()).slice(-2);
  const seconds = ('0' + today.getSeconds()).slice(-2); 
  const timeString = hours + ':' + minutes  + ':' + seconds;

  const txtSize = Math.min(obj.w, obj.h) / 4;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.60)';
  ctx.textAlign = "center";
  ctx.font = txtSize + 'px Sniglet-ExtraBold';
  ctx.fillText(timeString, obj.w / 2, obj.h / 2);

  requestAnimationFrame(interactive.clocks.drawFrm);
}
