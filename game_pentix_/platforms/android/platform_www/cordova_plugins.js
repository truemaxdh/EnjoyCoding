cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-game.game",
        "file": "plugins/cordova-plugin-game/www/game.js",
        "pluginId": "cordova-plugin-game",
        "clobbers": [
            "window.game"
        ]
    },
    {
        "id": "cordova-connectivity-monitor.connectivity",
        "file": "plugins/cordova-connectivity-monitor/www/connectivity.js",
        "pluginId": "cordova-connectivity-monitor",
        "clobbers": [
            "window.connectivity"
        ]
    },
    {
        "id": "cordova-admob.AdMobAds",
        "file": "plugins/cordova-admob/www/admob.js",
        "pluginId": "cordova-admob",
        "clobbers": [
            "window.admob",
            "window.tappx"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-plugin-extras-google-play-services": "1.0.5",
    "cordova-plugin-game": "1.0.120",
    "cordova-connectivity-monitor": "1.2.2",
    "cordova-admob": "4.1.16"
};
// BOTTOM OF METADATA
});