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
                    banner: 'ca-app-pub-7307479428475282/6915509453',		//PUT ADMOB ADCODE HERE 
                    interstitial: 'ca-app-pub-7307479428475282/5184863454'	//PUT ADMOB ADCODE HERE 
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
 
            showHideBanner(true);
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

    // if (newpageID=='menu') {
    //     //removeEvt();
    // } else 
    if (newpageID=='game') {
        addEvt();
        newGame();
    } 
}

// Do this when run as app
function onDeviceReady() {
    document.removeEventListener('deviceready', onDeviceReady, false);
    
    ///////////
    // AdMob //
    ///////////
    initAd();    
    ///////////////////////////
    // Google Game Services  //
    ///////////////////////////
    window.game.setUp();
    window.game.login();
    render_init();
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
    render_init();
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

