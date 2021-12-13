let fullScreen = false;
//let oldWidth = "";
//let oldHeight = "";
function toggleFullScreen() {
  const el = document.getElementById("board");
  let w, h;
  if (fullScreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
    const rect = el.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    fullScreen = false;
  } else {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) { /* Safari */
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) { /* IE11 */
      el.msRequestFullscreen();
    }      
    //el.style.width = screen.width + "px";
    //el.style.height = screen.height + "px";
    w = screen.width;
    h = screen.height;
    fullScreen = true;
  }
  const obj = interactive.clocks;
  const cnv = obj.ctx.canvas;
  
  
  //cnv.style.width = el.style.width;
  //cnv.style.height = el.style.height;
  cnv.style.width = w + "px";
  cnv.style.height = h + "px";
  cnv.width = cnv.style.width.replace("px","");
  cnv.height = cnv.style.height.replace("px","");
  obj.w = cnv.width;
  obj.h = cnv.height;
}
