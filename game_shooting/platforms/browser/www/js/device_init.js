var isApp;

// Do this when run as app
function onDeviceReady() {
    document.removeEventListener('deviceready', onDeviceReady, false);
    
    render_init(game_objects_init, newGame);
    init_user_input();
}

// Do this when run on web
function onLoad() {
    render_init(game_objects_init, newGame);
    init_user_input();
}

if (location.href.indexOf('CodingIsFun') < 0 &&
    location.href.indexOf('localhost') < 0) {
    isApp = true;
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
    isApp = false;
    addEventListener("load", onLoad);
}
