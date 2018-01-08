//Code for stats page
(function() {
    'use strict';
    /*************** Global Variables ***************/
    document.getElementById('totalPoints')
        .innerHTML = userAccount.score;
    document.getElementById('totalTime')
        .innerHTML = convertTime(userAccount.totalTime);
    document.getElementById('lastSession')
        .innerHTML = convertTime(userAccount.lastSession);
    document.getElementById('wordCount')
        .innerHTML = vocab.length;

})();