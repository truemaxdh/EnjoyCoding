let fullScreen = false;
//let oldWidth = "";
//let oldHeight = "";
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
      //el.style.width = oldWidth;
      //el.style.height = oldHeight;
      fullScreen = false;
    } else {
      //oldWidth = el.style.width;
      //oldHeight = el.style.height;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) { /* Safari */
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) { /* IE11 */
        el.msRequestFullscreen();
      }      
      //el.style.width = screen.width + "px";
      //el.style.height = screen.height + "px";
      fullScreen = true;
    }
    const rect = el.getBoundingClientRect();
    var cnv = interactive.clocks.ctx.canvas;
    //cnv.style.width = el.style.width;
    //cnv.style.height = el.style.height;
    cnv.style.width = rect.width;
    cnv.style.height = rect.height;
    cnv.width = cnv.style.width.replace("px","");
    cnv.height = cnv.style.height.replace("px","");
    obj.w = cnv.width;
    obj.h = cnv.height;
  }
