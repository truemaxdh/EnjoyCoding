function showHideBanner(bShow) {
    if (isApp) {
        if (bShow) {
            // Set AdMobAds options: //
            admob.setOptions({
            publisherId:          "ca-app-pub-7307479428475282/6915509453",  // Required 
            interstitialAdId:     "ca-app-pub-7307479428475282/5184863454"//,  // Optional 
            // tappxIdiOS:           "/XXXXXXXXX/Pub-XXXX-iOS-IIII",            // Optional 
            // tappxIdAndroid:       "/XXXXXXXXX/Pub-XXXX-Android-AAAA",        // Optional 
            // tappxShare:           0.5                                        // Optional 
            });
            
            // Start showing banners (atomatic when autoShowBanner is set to true) 
            admob.createBannerView();
            
            // Request interstitial (will present automatically when autoShowInterstitial is set to true) 
            admob.requestInterstitialAd();
        } else {
            admob.destroyBannerView();
        }
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

    if (newpageID=='menu') {
        showHideBanner(true);
    } else if (newpageID=='game') {
        showHideBanner(false);
        newGame();
    } 
}




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
        window.game.unlockAchievement(achvIds[idx]);
    }
}

function GetUserImg() {
    window.game.getPlayerImage();
    window.game.onGetPlayerImageSucceeded = function(result) {
		document.getElementById('user_img').src = result;
    };
    window.game.onGetPlayerImageFailed = function() {
        
    };	
}

function OpenUserResult() {
    document.getElementById("user_result").style.width = "100%";
}

function  CloseUserResult() {
    document.getElementById("user_result").style.width = "0%";
    pageChange('menu');
}

function ShowAchievements() {
    window.game.showAchievements();
}

function ShowHighScores() {
    window.game.showLeaderboard(leaderboardId);
}

// Do this when run as app
function onDeviceReady() {
    document.removeEventListener('deviceready', onDeviceReady, false);
    
    ///////////////////////////
    // Google Game Services  //
    ///////////////////////////
    window.game.setUp();
    window.game.login();
    window.game.onLoginSucceeded = function(result) {
		//var playerDetail = result;
        pageChange('menu');
    };
    window.game.onLoginFailed = function() {
        pageChange('menu');
    };
}

// Do this when run on web
function onLoad() {
    keyEvtLink();
    pageChange('menu');
}

var isApp;
if (location.href.indexOf('CodingIsFun') < 0 &&
    location.href.indexOf('localhost') < 0) {
    isApp = true;
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
    isApp = false;
    addEventListener("load", onLoad);
}

