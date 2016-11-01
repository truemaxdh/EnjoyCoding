cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-connectivity-monitor/www/connectivity.js",
        "id": "cordova-connectivity-monitor.connectivity",
        "pluginId": "cordova-connectivity-monitor",
        "clobbers": [
            "window.connectivity"
        ]
    },
    {
        "file": "plugins/cordova-admob/www/admob.js",
        "id": "cordova-admob.AdMobAds",
        "pluginId": "cordova-admob",
        "clobbers": [
            "window.admob",
            "window.tappx"
        ]
    },
    {
        "file": "plugins/cordova-plugin-game/www/game.js",
        "id": "cordova-plugin-game.game",
        "pluginId": "cordova-plugin-game",
        "clobbers": [
            "window.game"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-connectivity-monitor": "1.2.2",
    "cordova-admob": "4.1.16",
    "cordova-plugin-extras-google-play-services": "1.0.5",
    "cordova-plugin-game": "1.0.120",
    "cordova-plugin-whitelist": "1.3.0"
}
// BOTTOM OF METADATA
});