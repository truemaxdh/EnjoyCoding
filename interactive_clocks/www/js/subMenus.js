let fullScreen = false;
function toggleFullScreen() {
    var el = document.getElementById("board");
    if (fullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
      el.style.width = "800px";
      el.style.height = "600px";
      fullScreen = false;
    } else {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) { /* Safari */
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) { /* IE11 */
        el.msRequestFullscreen();
      }
      el.style.width = screen.width + "px";
      el.style.height = screen.height + "px";
      fullScreen = true;
    }

    var obj = interactive.clocks;
    var cnv = obj.ctx.canvas;
    cnv.style.width = el.style.width;
    cnv.style.height = el.style.height;
    cnv.width = cnv.style.width.replace("px","");
    cnv.height = cnv.style.height.replace("px","");
    obj.w = cnv.width;
    obj.h = cnv.height;
  }