//code for account page
(function() {
    'use strict';
    /*************** Global Variables ***************/
    let addOrDelete = document.getElementById('addOrDeleteAccount');
    


    /***************  Functions ***************/
    function reduceFontSizeOnInput(e) {
        const answer = document.querySelector('.answer'),
        input = document.querySelector('#username');
        if (e.which === 13) {
            e.preventDefault();
        }
        window.console.log(input.innerText.length);
        if (input.innerText.length < 3) {
            answer.style.border = "solid red 0.1em";
            b = input.innerText.length;
        } else if (input.innerText.length < 18) {
            answer.style.border = "solid green 0.1em";
            if (input.innerText.length > b) {
                if (input.innerText.length % 4 === 0) {
                    a -= 15;
                    input.style.fontSize = a.toString() + "%";
                    window.console.log(input.style.fontSize);
                    b = input.innerText.length;
                }
            } else if (input.innerText.length < b) {
                if (input.innerText.length % 4 === 0) {
                    a += 15;
                    input.style.fontSize = a.toString() + "%";
                    console.log(input.style.fontSize);
                    b = input.innerText.length;
                }
            }
        } else {
            alert("username must be between 3 and 25 characters");
            answer.style.border = "solid red 0.1em";
        }
    }

    /**** Set Add/Delete Button ****/
    function checkAccount() {
        if (account) {
            document.getElementById('userId')
                .innerHTML = userAccount.name;
            document.getElementById('joinedOn')
                .innerHTML = userAccount.joined;
            addOrDelete.innerHTML = "Delete Account";
        } else {
            document.getElementById('userId')
                .innerHTML = "<div class=\"answer\"> <div contenteditable=\"true\" id=\"username\"  type=\"text\" placeholder=\"username\"></div></div>";
            document.getElementById('userId')
                .addEventListener('keydown', (event) => {
                    reduceFontSizeOnInput(event);
                });
            document.getElementById('joinedOn')
                .innerHTML = "";
            addOrDelete.innerHTML = "Add Account";
        }
    }

    /***** ADD Account *****/
    function addAccount() {
        let inputUserName = document.getElementById('username');
        // should I add a message that you need a user name?
        if (inputUserName.innerText != "") {
            let dateJoined = new Date(),
                yearJoined = dateJoined.getFullYear(),
                monthJoined = dateJoined.getMonth() + 1,
                dayJoined = dateJoined.getDate();
            dateJoined = dayJoined + "/" + monthJoined + "/" + yearJoined;
            userAccount.name = inputUserName.innerText.toString();
            userAccount.joined = dateJoined;
            account = true;
            checkAccount();
        }
    }

    /***** Delete Account *****/
    function deleteAccount() {
        //prompt a confirmation!
        console.log("Deleting account");
        userAccount.name = "";
        userAccount.joined = "";
        userAccount.score = "0";
        userAccount.totalTime = 0;
        userAccount.lastSession = 0;
        document.querySelector('#actualScore')
            .innerHTML = 0;
        account = false;
        checkAccount();
    }

    /***************  Event Listeners ***************/
    addOrDelete.addEventListener('click', function() {
        if (account) {
            deleteAccount();
        } else {
            addAccount();
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
                addStyle("styleSheets/nightMode.css", "nightMode");
            }
        });

    checkAccount();

})();