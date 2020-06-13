// AdMob
var AdMob = {
  adStatus : 0,
  onInitComplete : function() {
    AdMob.adStatus = 1; 
    try {
      Android.adMobInitInterstitial("ca-app-pub-7307479428475282/1960854989");
    } catch(e) {
      toast("adMobInitInterstitial failed.");
    }
    try {
      Android.adMobInitBanner(); 
    } catch(e) {
      toast("adMobInitBanner failed.");
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

/*// Google Game Service Ids
var leaderboardId = "CgkIwPzgz_EBEAIQBg";
var achvIds = [
  "CgkIwPzgz_EBEAIQAQ",
  "CgkIwPzgz_EBEAIQAg",
  "CgkIwPzgz_EBEAIQAw",
  "CgkIwPzgz_EBEAIQBA",
  "CgkIwPzgz_EBEAIQBQ"
];
var achvScores = [500, 2000, 5000, 10000, 20000];*/
var glGameSvc = {
  loginStatus : false,

  // Google Game Service Ids
  leaderboardId : "CgkIwPzgz_EBEAIQBg",
  achvIds : [
    "CgkIwPzgz_EBEAIQAQ",
    "CgkIwPzgz_EBEAIQAg",
    "CgkIwPzgz_EBEAIQAw",
    "CgkIwPzgz_EBEAIQBA",
    "CgkIwPzgz_EBEAIQBQ"
  ],
  achvScores = [500, 2000, 5000, 10000, 20000]
};

function chkAndUnlockAchievement(score) {
  for (var i = glGameSvc.achvScores.length - 1; i >= 0; i--) {
    
    if ( glGameSvc.achvScores[i] < score) {
      try {  
        Android.unlockAchievement(glGameSvc.achvIds[idx]);
      } catch(e) {
        toast("unlockAchievement failed.");
      }
      break;	
    }
  }
  /* var idx = achvScores.indexOf(score);
  if (idx > -1) {
    try {  
      Android.unlockAchievement(achvIds[idx]);
    } catch(e) {
      toast("unlockAchievement failed.");
    }
  }
  */
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
    Android.showLeaderboard(glGameSvc.leaderboardId);
  } catch(e) {
    toast("failed.");
  }
}
