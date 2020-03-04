var isApp;

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
        //showHideBanner(true);
    } else if (newpageID=='game') {
        //showHideBanner(false);
        //newGame();
	init();
    } 
}


// Do this when run as app
function onDeviceReady() {
    document.removeEventListener('deviceready', onDeviceReady, false);
    render_init();
    init_user_input();

    ///////////
    // AdMob //
    ///////////
    initAd();
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
    //render_init();
    //init_user_input();
    pageChange('menu');
}

if (location.href.indexOf('truemaxdh.github.io') < 0 &&
    location.href.indexOf('localhost') < 0) {
    isApp = true;
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
    isApp = false;
    addEventListener("load", onLoad);
}
