// admob
//initialize the goodies 
function initAd(){
        if ( window.plugins && window.plugins.AdMob ) {
            var ad_units = {
                ios : {
                    banner: 'ca-app-pub-xxxxxxxxxxx/xxxxxxxxxxx',		//PUT ADMOB ADCODE HERE 
                    interstitial: 'ca-app-pub-xxxxxxxxxxx/xxxxxxxxxxx'	//PUT ADMOB ADCODE HERE 
                },
                android : {
                    banner: 'ca-app-pub-7307479428475282/2327029858',		//PUT ADMOB ADCODE HERE 
                    interstitial: 'ca-app-pub-7307479428475282/5329307450'	//PUT ADMOB ADCODE HERE 
                }
            };
            var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;
 
            window.plugins.AdMob.setOptions( {
                publisherId: admobid.banner,
                interstitialAdId: admobid.interstitial,
                adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD 
                bannerAtTop: false, // set to true, to put banner at top 
                overlap: true, // banner will overlap webview  
                offsetTopBar: false, // set to true to avoid ios7 status bar overlap 
                isTesting: false, // receiving test ad 
                autoShow: false // auto show interstitial ad when loaded 
            });
 
            registerAdEvents();
            window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown 
            window.plugins.AdMob.requestInterstitialAd();
 
        } else {
            //alert( 'admob plugin not ready' ); 
        }
}
//functions to allow you to know when ads are shown, etc. 
function registerAdEvents() {
        document.addEventListener('onReceiveAd', function(){});
        document.addEventListener('onFailedToReceiveAd', function(data){});
        document.addEventListener('onPresentAd', function(){});
        document.addEventListener('onDismissAd', function(){ });
        document.addEventListener('onLeaveToAd', function(){ });
        document.addEventListener('onReceiveInterstitialAd', function(){ });
        document.addEventListener('onPresentInterstitialAd', function(){ });
        document.addEventListener('onDismissInterstitialAd', function(){
        	//window.plugins.AdMob.createInterstitialView();			//REMOVE THESE 2 LINES IF USING AUTOSHOW 
            //window.plugins.AdMob.requestInterstitialAd();			//get the next one ready only after the current one is closed 
        });
    }

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

//display the interstitial 
function showInterstitialFunc(){
    window.plugins.AdMob.showInterstitialAd();
}




// Google Game Service Ids
var leaderboardId = "CgkIwPzgz_EBEAIQBg";
var achvIds = ["CgkIwPzgz_EBEAIQAQ",
               "CgkIwPzgz_EBEAIQAg",
               "CgkIwPzgz_EBEAIQAw",
               "CgkIwPzgz_EBEAIQBA",
               "CgkIwPzgz_EBEAIQBQ"];

var achvScores = [500, 2000, 5000, 10000, 20000];

function chkAndUnlockAchievement(score) {
    var idx = achvScores.indexOf(score);
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

var isApp;
if (location.href.indexOf('CodingIsFun') < 0 &&
    location.href.indexOf('localhost') < 0) {
    isApp = true;
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
    isApp = false;
    addEventListener("load", onLoad);
}

