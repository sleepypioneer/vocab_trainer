//code for account page
(function() {
    'use strict';
    /*************** Global Variables ***************/
    /***************  Event Listeners ***************/
    let addOrDelete = document.getElementById('addOrDeleteAccount');
    
    addOrDelete.addEventListener('click', function() {
        if (account.haveAccount) {
            account.deleteAccount();
        } else {
            account.addAccount();
        }
    });

    /**** Day/Night Mode ****/
    document.getElementById('day')
        .addEventListener('click', function() {
            if (document.querySelector('#nightMode') != null) {
                let a = document.querySelector('#nightMode');
                document.querySelector("head")
                    .removeChild(a);
            }
        });

    document.getElementById('night')
        .addEventListener('click', function() {
            if (document.querySelector('#nightMode') == null) {
                utils.addStyle("styleSheets/nightMode.css", "nightMode");
            }
        });
    
    account.checkAccount();

})();