function ShowAdmob() {
    document.removeEventListener('deviceready', ShowAdmob, false);

    // Start showing banners (atomatic when autoShowBanner is set to true) 
    admob.createBannerView();
    
    // Request interstitial (will present automatically when autoShowInterstitial is set to true) 
    //admob.requestInterstitialAd();
}

function HideAdmob() {
    document.removeEventListener('deviceready', HideAdmob, false);

    admob.destroyBannerView();
}

function SetDeviceReady(showAd) {
    document.addEventListener("deviceready", showAd ? ShowAdmob : HideAdmob, false);
}