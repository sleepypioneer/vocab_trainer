// code for homepage
(function() {
    'use strict';
    /*************** Global Variables ***************/
    let navBtns = document.querySelectorAll('.pageLink');

    /************* Event Listeners **************/
    navBtns.forEach(navBtn => navBtn.addEventListener('click', function() {
        navi.changeContent(this.dataset.page);
    }));

})();
