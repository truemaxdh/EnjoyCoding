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

window.onload = function() {
    startAnimation();
    sleep(1000);
    pageChange('menu');
};

