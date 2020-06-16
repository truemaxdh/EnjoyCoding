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
  }
}

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
  achvScores : [500, 2000, 5000, 10000, 20000]
};

function chkAndUnlockAchievement(score) {
  if (!glGameSvc.loginStatus) return;
  for (var i = glGameSvc.achvScores.length - 1; i >= 0; i--) {
    
    if ( glGameSvc.achvScores[i] < score) {
      try {  
        Android.unlockAchievement(glGameSvc.achvIds[i]);
      } catch(e) {
        toast("unlockAchievement failed.");
      }
      break;	
    }
  }
}

function OpenUserResult() {
  document.getElementById("user_result").style.width = "100%";
}

function  CloseUserResult() {
  document.getElementById("user_result").style.width = "0%";
  pageChange('menu');
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
    Android.showLeaderboard(glGameSvc.leaderboardId);
  } catch(e) {
    toast("failed.");
  }
}
