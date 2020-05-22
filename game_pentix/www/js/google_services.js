// AdMob
var AdMob = {
  adStatus : 0,
  onInitComplete : function() {
    AdMob.adStatus = 1; 
    //toast("adMobInit Complete.Start adMobInitIntertitial");
    try {
      // "ca-app-pub-3940256099942544/1033173712" : Test
      //ca-app-pub-7307479428475282/1949829859 : Real
      Android.adMobInitIntertitial("ca-app-pub-3940256099942544/1033173712");
    } catch(e) {
      toast("adMobInitIntertitial failed.");
    }
    /*try {
      Android.adMobIntertitialSetToUseJSCallback();
    } catch(e) {
      toast("adMobIntertitialSetToUseJSCallback failed.");
    }
    try {
      Android.adMobInterstitialLoad();
    } catch(e) {
      toast("adMobInterstitialLoad failed.");
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
      Android.showLeaderboard();
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

  /*if (newpageID=='menu' && AdMob.adStatus > 0) {
    try {
      Android.adMobInterstitialShow();
    } catch(e) {
      toast("adMobInterstitialShow failed." + e.message);
    }  
  }*/ 

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

// Do this when run as app
function onDeviceReady() {
  ///////////
  // AdMob //
  ///////////
  try {
    //Android.adMobInit("ca-app-pub-7307479428475282~7899681601", "N"); 
    Android.adMobInit("ca-app-pub-3940256099942544~3347511713", "Y"); 
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
  /*try {
    var dispName = Android.getLastSignedInAccount();
    toast(dispName);
  } catch(e) {
    toast("getLastSignedInAccount failed." + e.message);
  }*/
  try {
    Android.signInToGS();
  } catch(e) {
    toast("signInToGS failed.");
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
