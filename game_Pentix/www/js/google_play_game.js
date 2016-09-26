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
    location.href="menu.html";
}

function ShowAchievements() {
    window.game.showAchievements();
}

function ShowHighScores() {
    window.game.showLeaderboard(leaderboardId);
}