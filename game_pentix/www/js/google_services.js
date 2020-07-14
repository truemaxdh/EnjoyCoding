// AdMob
var AdMob = {
  adStatus : 0
}

// Google Game Service Ids
var leaderboardId = "CgkItYKH-eAXEAIQBg";
var achvIds = [
  "CgkItYKH-eAXEAIQAQ",
  "CgkItYKH-eAXEAIQAg",
  "CgkItYKH-eAXEAIQAw",
  "CgkItYKH-eAXEAIQBA",
  "CgkItYKH-eAXEAIQBQ",
  "CgkItYKH-eAXEAIQCA"
];

var achvLines = [1,3,6,10,15,20];
var glGameSvc = {
  loginStatus : false
};

function chkAndUnlockAchievement(lineCnt) {
  var idx = achvLines.indexOf(lineCnt);
  if (idx > -1) {
    try {  
      Android.unlockAchievement(achvIds[idx]);
    } catch(e) {
      toast("unlockAchievement failed.");
    }
  }
}

function OpenUserResult() {
  document.getElementById("user_result").style.width = "100%";
}

function  CloseUserResult() {
  document.getElementById("user_result").style.width = "0%";
  setTimeout(function() {
    pageChange('menu');
    document.location.href = "index.html";
  }, 500);
}

function ShowAchievements() {
  if (!glGameSvc.loginStatus) return;
  try {
    Android.showAchievements();
  } catch(e) {
    toast("failed.");
  }
}

function ShowHighScores() {
  if (!glGameSvc.loginStatus) return;
  try {
      Android.showLeaderboard(leaderboardId);
  } catch(e) {
    toast("failed.");
  }
}

// pages
var pageIDs = ['intro','menu','game'];
var curPage = pageIDs[0];
function pageChange(newpageID) {
  for (var i = 0; i < pageIDs.length; i++) {
    var page = document.getElementById(pageIDs[i]);
    if (pageIDs[i]==newpageID) {
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  }

  if (AdMob.adStatus == 1) {
    try {
      Android.adMobInterstitialLoad();
      AdMob.adStatus = 2; 
    } catch(e) {
      toast("adMobInterstitialLoad failed.");
    }
  }
  
  if (newpageID=='menu') {
    if (AdMob.adStatus > 0) {
      try {
        Android.adMobInterstitialShow();
        AdMob.adStatus = 1; 
      } catch(e) {
        toast("adMobInterstitialShow failed." + e.message);
      }
    }
    
    /*try {
      if (!glGameSvc.loginStatus) {
        try {
          Android.signInToGS();
        } catch(e) {
          toast("signInToGS failed.");
        }
      }
    } catch(e) {
      toast("getLastSignedInAccount failed." + e.message);
    }*/
  }

  if (newpageID=='game') {
    addEvt();
    newGame();
  }
   
  curPage = newpageID;
}

function toast(msg) {
  try {
    Android.showToast(msg);
  } catch(e) {
    console.log(msg);    
  }
  
}

function setGamerProfile(isConnected , dispName) {
  var elCont = document.getElementById("signInStat");
  var elLogIn = document.getElementById("logIn");
  var elLogOut = document.getElementById("logOut");
  var cont = "";
  if (isConnected == "connected") {
    glGameSvc.loginStatus = true;
    elCont.innerHTML = "<br><p style='font-size:25px;'>Hello, " + dispName + "</p>";
    elLogIn.style.display = "none";
    elLogOut.style.display = "block";
  } else {
    elCont.innerHTML = "<span style='font-size:15px;'>Sign in with Google to share your scores and achievements with your friends.</span>";
    elLogIn.style.display = "block";
    elLogOut.style.display = "none";
    glGameSvc.loginStatus = false;
  }
}

// Do this when run as app
function onDeviceReady() {
  ///////////
  // AdMob //
  ///////////
  AdMob.adStatus = 1;
  
  if (!glGameSvc.loginStatus) {
    Android.reqGamerProfile();
  }
  
  render_init();
  pageChange('menu');
}

// Do this when run on web
function onLoad() {
    render_init();
    pageChange('menu');
}

var isApp;
if (typeof Android==='undefined') {
  isApp = false;
  addEventListener("load", onLoad);
} else {
  isApp = true;
  addEventListener("load", onDeviceReady, false);  
}
console.log(isApp);  
