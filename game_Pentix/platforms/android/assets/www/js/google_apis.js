// Google Game Service Ids
var leaderboardId = "CgkItYKH-eAXEAIQBg";
var achievementId1 = "CgkItYKH-eAXEAIQAQ";
var achievementId2 = "CgkItYKH-eAXEAIQAg";
var achievementId3 = "CgkItYKH-eAXEAIQAw";
var achievementId4 = "CgkItYKH-eAXEAIQBA";
var achievementId5 = "CgkItYKH-eAXEAIQBQ";

function onDeviceReady() {
    // Google Game Services
    window.game.setUp();
    window.game.login();
    window.game.onLoginSucceeded = function(result) {
		var playerDetail = result;
        alert("Hello, " + playerDetail['playerDisplayName']);
    };

    document.removeEventListener('deviceready', onDeviceReady, false);
    
    // Set AdMobAds options: 
    admob.setOptions({
    publisherId:          "ca-app-pub-7307479428475282/6915509453"//,  // Required 
    // interstitialAdId:     "ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII",  // Optional 
    // tappxIdiOS:           "/XXXXXXXXX/Pub-XXXX-iOS-IIII",            // Optional 
    // tappxIdAndroid:       "/XXXXXXXXX/Pub-XXXX-Android-AAAA",        // Optional 
    // tappxShare:           0.5                                        // Optional 
    });
    
    // Start showing banners (atomatic when autoShowBanner is set to true) 
    admob.createBannerView();
    
    // Request interstitial (will present automatically when autoShowInterstitial is set to true) 
    //admob.requestInterstitialAd();
}


document.addEventListener("deviceready", onDeviceReady, false);