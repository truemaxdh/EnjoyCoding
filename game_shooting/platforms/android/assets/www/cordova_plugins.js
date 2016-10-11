cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-admob-simple.AdMob",
        "file": "plugins/cordova-plugin-admob-simple/www/AdMob.js",
        "pluginId": "cordova-plugin-admob-simple",
        "clobbers": [
            "window.plugins.AdMob"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-admob-sdklibs": "2.1.4",
    "cordova-plugin-admob-simple": "3.0.14"
};
// BOTTOM OF METADATA
});