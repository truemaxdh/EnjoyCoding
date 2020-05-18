// admob
var adStatus = 0;

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
function pageChange(newpageID) {
  for (var i = 0; i < pageIDs.length; i++) {
    var page = document.getElementById(pageIDs[i]);
    if (pageIDs[i]==newpageID) {
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  }
  
  if (adStatus==0) {
    try {
      Android.adMobInterstitialLoad();
    } catch(e) {
      toast("adMobInterstitialLoad failed." + e.message);
    }
    try {
      Android.signInToGS();
    } catch(e) {
      toast("signInToGS failed.");
    }
    adStatus = 1;
  } else if (adStatus==1) {
    try {
      Android.adMobInterstitialShow();
    } catch(e) {
      toast("adMobInterstitialShow failed." + e.message);
    }    
    adStatus=2;
  } else if (adStatus == 2) {
    adStatus = 3;
  } 
  

  if (newpageID=='game') {
    addEvt();
    newGame();
  } 
}

function toast(msg) {
	try {
    Android.showToast(msg);
    isApp = true;
  } catch(e) {
    isApp = false;
  }
  
}

// Do this when run as app
function onDeviceReady() {
  ///////////
  // AdMob //
  ///////////
  try {
    // "ca-app-pub-3940256099942544/1033173712" : Test
    //ca-app-pub-7307479428475282/1949829859 : Real
    Android.adMobInit("N"); 
    Android.adMobInitIntertitial("ca-app-pub-7307479428475282/1949829859"); 
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
  render_init();
  pageChange('menu');
}

// Do this when run on web
function onLoad() {
    render_init();
    pageChange('menu');
}

var isApp;
if (Android===undefined)
  addEventListener("load", onLoad);
else
  addEventListener("load", onDeviceReady, false);  

console.log(isApp);	
