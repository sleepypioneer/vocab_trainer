//Code for stats page
(function() {
    'use strict';
    /*************** Global Variables ***************/
    document.getElementById('totalPoints')
        .innerHTML = userAccount.score;
    document.getElementById('totalTime')
        .innerHTML = timer.convertTime(userAccount.totalTime);
    document.getElementById('lastSession')
        .innerHTML = timer.convertTime(userAccount.lastSession);
    document.getElementById('wordCount')
        .innerHTML = vocab.length;

})();