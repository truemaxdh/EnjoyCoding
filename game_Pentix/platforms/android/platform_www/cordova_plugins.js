cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
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
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-connectivity-monitor": "1.2.2",
    "cordova-admob": "4.1.11",
    "cordova-plugin-multidex": "1.0.0"
};
// BOTTOM OF METADATA
});