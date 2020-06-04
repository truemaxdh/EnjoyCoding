// AdMob
var AdMob = {
  adStatus : 0,
  onInitComplete : function() {
    AdMob.adStatus = 1; 
    try {
      Android.adMobInitInterstitial("ca-app-pub-7307479428475282/1949829859");
    } catch(e) {
      toast("adMobInitInterstitial failed.");
    }
    /*try {
      Android.adMobIntertitialSetToUseJSCallback();
    } catch(e) {
      toast("adMobInterstitialSetToUseJSCallback failed.");
    }*/
  },
  Interstitial : {
    clsName : "AdMob.Interstitial",
    onAdLoaded : function() {
      AdMob.adStatus = 2;
      toast("adMob Intertitial Load Complete.");
    },
    onAdFailedToLoad : function() {
      toast("adMob Intertitial Load Failed.");
    },
    onAdOpened : function() {
      toast("adMob Intertitial Ad Opened.");
    },
    onAdClicked : function() {
      toast("adMob Intertitial Ad Clicked.");
    },
    onAdLeftApplication : function() {
      toast("adMob Intertitial Ad Left Application.");
    },
    onAdClosed : function() {
      toast("adMob Intertitial Ad Closed.");
    }
  }
}
/*
//display the banner 
function showHideBanner(bShow) {
  if (isApp) {
    if (bShow) {
      window.plugins.AdMob.createBannerView();
    } else {
      window.plugins.AdMob.destroyBannerView();
    } 
  }
}
*/

// Google Game Service Ids
var leaderboardId = "CgkItYKH-eAXEAIQBg";
var achvIds = ["CgkItYKH-eAXEAIQAQ",
               "CgkItYKH-eAXEAIQAg",
               "CgkItYKH-eAXEAIQAw",
               "CgkItYKH-eAXEAIQBA",
               "CgkItYKH-eAXEAIQBQ"];

var achvLines = [1,3,6,10,15];
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
/*
function GetUserImg() {
    window.game.getPlayerImage();
    window.game.onGetPlayerImageSucceeded = function(result) {
    document.getElementById('user_img').src = result;
    };
    window.game.onGetPlayerImageFailed = function() {
        
    };  
}
*/
function OpenUserResult() {
  document.getElementById("user_result").style.width = "100%";
}

function  CloseUserResult() {
  document.getElementById("user_result").style.width = "0%";
  pageChange('menu');
}

function ShowAchievements() {
  try {
    Android.showAchievements();
  } catch(e) {
    toast("failed.");
  }
}

function ShowHighScores() {
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
    
    try {
      if (!glGameSvc.loginStatus) {
        try {
          Android.signInToGS();
        } catch(e) {
          toast("signInToGS failed.");
        }
      }
    } catch(e) {
      toast("getLastSignedInAccount failed." + e.message);
    }
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
    elCont.innerHTML = "<center style='font-size:23px;'>Hello, " + dispName + "</center>";
    elLogIn.style.display = "none";
    //elLogOut.style.display = "block";
    glGameSvc.loginStatus = true;
  } else {
    elCont.innerHTML = "<center style='font-size:15px;'>Sign in with Google to share your scores and achievements with your friends.</center>";
    elLogIn.style.display = "block";
    //elLogOut.style.display = "none";
    glGameSvc.loginStatus = false;
  }
}

// Do this when run as app
function onDeviceReady() {
  ///////////
  // AdMob //
  ///////////
  try {
    Android.adMobInit("Y"); 
  } catch(e) {
    toast("adMobInit failed." + e.message);
  }


  ///////////////////////////
  // Google Game Services  //
  ///////////////////////////
  try {
    Android.GoogleSignIn_getClient();
  } catch(e) {
    toast("GoogleSignIn_getClient failed." + e.message);
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
