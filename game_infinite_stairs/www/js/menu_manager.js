function chkAndUnlockStage(stage) {
  try {
    if (Number(localStorage.getItem(storageName.maxStage)) < stage)
      localStorage.setItem(storageName.maxStage, stage);
  } catch(err) {
    
  }
}

function OpenUserResult() {
  document.getElementById("user_result").style.left = "0";
}

function  CloseUserResult() {
  document.getElementById("user_result").style.left = "-100%";
  setTimeout(function() {
    pageChange('menu');
    document.location.href = "index.html";
  }, 500);
}


// pages
const pageIDs = ['intro','menu','game'];
let curPage = pageIDs[0];
function pageChange(newpageID) {
  for (var i = 0; i < pageIDs.length; i++) {
    var page = document.getElementById(pageIDs[i]);
    if (pageIDs[i]==newpageID) {
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  }
  
  if (newpageID=='game') {
    newGame();
  } 

  curPage = newpageID;
}

addEventListener("load", gameInit);
