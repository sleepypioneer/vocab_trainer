//code for timed Session page
(function() {
    'use strict';
    /*************** Global Variables ***************/
    let getStarted;

    /************* Functions **************/
    function addTime(minutes) {
        time += parseInt(minutes);
        document.getElementById("timerSet")
            .innerHTML = convertTime(time);
    }

    function reset() {
        clearInterval(interval);
        time = 0;
        if (document.getElementById("timerSet") != null) {
            document.getElementById("timerSet")
                .innerHTML = "00:00:00";
        }
        timer = "";
        NavTimer();
        started = false;
        //need code to evaluate if the pop up is there
        popUpHide();
    }

    function pause() {
        if (started === true) {
            clearTimeout(getStarted);
            clearInterval(interval);
            started = false;
        }
    }

    // have a message to indicate timed session has started (if inactive reminder that timer running??)
    function start() {
        if (time > 0) {
            if (started === false) {
                popUp(6);
                getStarted = setTimeout(function() {
                    popUpHide();
                    startTimer();
                    changeContent("vocabTrainer", pages);
                }, 1500);
            }
            started = true;
        } else {
            popUp(5);
        }
    }

    /************* Event Listeners **************/
    document.getElementById('reset')
        .addEventListener('click', reset);
    document.getElementById('pause')
        .addEventListener('click', pause);
    document.getElementById('play')
        .addEventListener('click', start);
    document.querySelectorAll('.length')
        .forEach(length => {
            length.addEventListener('click', function() {
                addTime(length.dataset.minutes);
            });
        });

})();