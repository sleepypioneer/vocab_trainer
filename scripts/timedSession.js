//code for timed Session page
(function() {
    'use strict';

    /************* Event Listeners **************/
    document.getElementById('reset')
        .addEventListener('click', timer.reset);
    document.getElementById('pause')
        .addEventListener('click', timer.pause);
    document.getElementById('play')
        .addEventListener('click', timer.start);
    document.querySelectorAll('.length')
        .forEach(length => {
            length.addEventListener('click', function() {
                timer.addTime(length.dataset.minutes);
            });
        });

})();