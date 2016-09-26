function onDeviceReady() {
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
    //admob.createBannerView();
    
    // Request interstitial (will present automatically when autoShowInterstitial is set to true) 
    //admob.requestInterstitialAd();

    // Google Game Services
    window.game.setUp();
    window.game.login();
    window.game.onLoginSucceeded = function(result) {
		//var playerDetail = result;
        document.location.href = 'menu.html';
    };
    window.game.onLoginFailed = function() {
        document.location.href = 'menu.html';
    };
}


document.addEventListener("deviceready", onDeviceReady, false);