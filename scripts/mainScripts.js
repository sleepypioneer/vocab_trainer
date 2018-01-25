//(function() {
    'use strict';
    /*************** Emulating local Content ***************/
    let vocabMine = {};
    let userAccount = {};

    function emulateLocalStorage(url) {
        return fetch(url).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
            }
        }).then((json) => {
            return json;
        });
    }

    let app = {
        /*************** Global Variables ***************/
        navBarTimer: document.getElementById("timer"),
        nav: document.querySelector("nav"),
        homeBtn: document.getElementById('home'),
        accountBtn: document.getElementById('account'),
        actualScore: document.getElementById('actualScore'),
        userAccount: {},
        newScore: "",
        hintTaken: false,
        isLoading: true,
        localVocab: [],
        spinner: document.querySelector('.loader')
    };

    /*************** Service Worker ***************/

    /*if (!('serviceWorker' in navigator)) {
        alert('No service-worker on this browser');
    } else {
        navigator.serviceWorker.register('service-worker.js').then(function (registration) {
            console.log('SW registered! Scope is:', registration.scope);
        }).catch(function (err) {
            //registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
        //catch a registration error
    }

    navigator.serviceWorker.ready.then(function(swRegistration) {
        return swRegistration.sync.register('foo');
    });
    */

    /*************** Indexed DB for local storage ***************/
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
    }

    /*************** Methods to update/refresh the local Storage ***************/
    app.updateVocabList = function (data) {
        if (app.isLoading) {
            app.spinner.setAttribute('hidden', true);
            app.isLoading = false;
        }
    };

    app.saveSelectedVocab = function () {
        console.log("saving to DB");
        window.localforage.setItem('localVocab', app.localVocab);
    };

    app.loadLocalStorage = function () {
        window.localforage.getItem('localVocab', function (err, vocabList) {
            if (vocabList) {
                app.localVocab = vocabList;
            } else {
                app.localVocab = Object.keys(vocabMine).map(function (key) {
                    return {
                        [key]: vocabMine[key]
                    };
                });
                app.saveSelectedVocab();
            }
        });
    };

    /* Utility Functions */
    let utils = {
        body: document.querySelector("body"),
        addScript: function (script, scriptName) {
            /* Add script to site */
            let scripts = document.querySelectorAll('script');
            scripts.forEach(script => {
                if (script.id != "") {
                    utils.body.removeChild(script);
                }
            });
            let newScript = document.createElement("script");
            newScript.type = "text/javascript";
            newScript.id = scriptName;
            newScript.src = script;
            this.body.appendChild(newScript);
        },
        addStyle: function (styleSheet, styleName) {
            /* Add style sheet to site */
            const head = document.querySelector("head");
            let newStyleSheet = document.createElement("link");
            newStyleSheet.rel = "stylesheet";
            newStyleSheet.type = "text/css";
            newStyleSheet.id = styleName;
            newStyleSheet.href = styleSheet;
            head.appendChild(newStyleSheet);
        },
        plusPoint: function () {
            /* Update Score */
            if (app.hintTaken) {
                app.newScore = parseInt(userAccount.score) + 1;
                app.hintTaken = false;
            } else {
                app.newScore = parseInt(userAccount.score) + 2;
            }
            app.actualScore.innerHTML = app.newScore;
            userAccount.score = app.newScore.toString();
        },
        keyboardUp: function () {
            if (document.documentElement.clientHeight < 350 && document.documentElement.clientWidth < 800) {
                console.log("keyboardUp");
                //app.nav.classList.add("keyboardUp");
                //document.querySelector('#Instruct div h3').setAttribute('style', 'display: none;')
            }

        }
    };


    /* Timer functions */
    let timer = {
        time: 0,
        timerSet: "",
        getStarted: 0,
        sessionTime: 0,
        myInterval: 0,
        started: false,
        runningTimer: document.getElementById('timer'),
        addTime: function (minutes) {
            this.timerSet = document.getElementById("timerSet"),
                this.time += parseInt(minutes);
            this.timerSet.innerHTML = this.convertTime(this.time);
        },
        reset: function () {
            timer.time = 0;
            timer.timerSet.innerHTML = "00:00:00";
            clearInterval(timer.myInterval);
            this.NavTimer;
            timer.started = false;
            timer.sessionTime = 0;
        },
        pause: function () {
            if (this.started === true) {
                clearInterval(timer.myInterval);
                timer.started = false;
            }
        },
        start: function () {
            // have a message to indicate timed session has started (if inactive reminder that timer running??)
            if (timer.time > 0) {
                if (timer.started === false) {
                    let sessionTime = this.time;
                    timer.myInterval = setInterval(function () {
                        timer.sessionTime += 1;
                        timer.time -= 1;
                        timer.timerSet.innerHTML = timer.convertTime(timer.time);
                        timer.NavTimer;
                        if (timer.time < 1) {
                            clearInterval(timer.myInterval);
                            timer.timerDone();
                        }
                    }, 1000);
                    //popUp(6);
                    /*this.getStarted = setTimeout(function() {
                        popUpHide();
                        this.startTimer;
                        changeContent("vocabTrainer", pages);
                    }, 1500);*/
                }
                started = true;
            } else {
                popUp(5);
            }
        },
        pad: function (b, width) {
            b = b + '';
            return b.length >= width ? b : new Array(width - b.length + 1)
                .join('0') + b;
        },
        convertTime: function (time) {
            let hh = Math.floor(time / 3600);
            let mm = Math.floor((time % 3600) / 60);
            let ss = time % 60;
            let convertedTime = timer.pad(hh, 2) + ":" + timer.pad(mm, 2) + ":" + timer.pad(ss, 2);
            return convertedTime;
        },
        NavTimer: function () {
            /* Update Timer */
            app.navBarTimer.innerHTML = "<h3>" + timer.timer + "</h3>";
        },
        timerDone: function () {
            console.log("done");
            //make pop up with option to cont learning or go to stats
            popUps.popUp(7);
            setTimeout(navi.changeContent("stats"), 2000);
            started = false;
            userAccount.lastSession = this.sessionTime;
            userAccount.totalTime += this.sessionTime;
            this.sessionTime = 0;
        }
    };


    /* popUps functions */
    let popUps = {
        popUpTexts: [
            {
                text: "trainerInfo",
                url: "pages/popups/vocabTrainerInfo.html",
                top: "8%",
                left: "7%",
                borderColor: "rgba(0, 0, 0, 0.6)"
         },
            {
                text: "caseSensitive",
                url: "pages/popups/hint1.html",
                top: "8%",
                left: "7%",
                borderColor: "rgba(0, 0, 0, 0.6)"
          },
            {
                text: "article",
                url: "pages/popups/hint2.html",
                top: "8%",
                left: "7%",
                borderColor: "rgba(0, 0, 0, 0.6)"
          },
            {
                text: "account",
                url: "pages/popups/addAccount.html",
                top: "8%",
                left: "7%",
                borderColor: "rgba(0, 0, 0, 0.6)"
          },
            {
                text: "deleteAccount",
                url: "pages/popups/addAccount.html",
                top: "8%",
                left: "7%",
                borderColor: "rgba(0, 0, 0, 0.6)"
          },
            {
                text: "assignTime",
                url: "pages/popups/timerAddTime.html",
                top: "8%",
                left: "7%",
                borderColor: "rgba(0, 0, 0, 0.6)"
          },
            {
                text: "start",
                url: "pages/popups/startTimerTraining.html",
                top: "8%",
                left: "7%",
                borderColor: "rgba(0, 0, 0, 0.6)"
          },
            {
                text: "timerEnd",
                url: "pages/popups/TimerTrainingEnd.html",
                top: "8%",
                left: "7%",
                borderColor: "rgba(0, 0, 0, 0.6)"
          }


        ],
        /*************** Functions ***************/
        setCSS: function (e, style) {
            for (let prop in style) {
                e.style[prop] = style[prop];
            }
        },
        popUp: function (textNumber) {
            // Stop multiply instances of same popup
            let popUpName = this.popUpTexts[textNumber].text;
            if (document.querySelector("#" + popUpName) == null) {
                let popUpBox = document.createElement("div");
                popUpBox.setAttribute("class", "popUp");
                popUpBox.setAttribute("id", popUpName);
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        popUpBox.innerHTML = this.response;
                    }
                };
                xhr.open("POST", popUps.popUpTexts[textNumber].url, true);
                xhr.send(null);
                popUps.setCSS(popUpBox, {
                    top: popUps.popUpTexts[textNumber].top,
                    left: popUps.popUpTexts[textNumber].left,
                    borderColor: popUps.popUpTexts[textNumber].borderColor
                });
                content.appendChild(popUpBox);
                if (popUpName != "trainerInfo") {
                    setTimeout(popUps.popUpHide, 2000);
                }
            }
        },
        popUpHide: function () {
            // deletes the first instance with class popup and not the one clicked on need to change this.
            if (document.querySelector(".popUp") != null) {
                document.querySelectorAll("#content").forEach(cross => {
                    document.querySelector(".popUp").classList.add('popUpFadeOut')
                    setTimeout(function () {
                        cross.removeChild(document.querySelector(".popUpFadeOut"));
                    }, 2000);
                    //timeout causes some console errors if person is impatient and double clicks on cross to close
                });
            }
        }
    };


    /* addVocab functions */
    let addVocab = {
        ImportedVocab: "",
        localVocabList: "",
        newWord: "",
        wordInEnglish: "",
        wordInGerman: "",
        gender: "",
        listOptions: "",
        setProperties: function () {
            this.wordInEnglish = document.getElementById('english');
            this.wordInGerman = document.getElementById('german');
            this.gender = document.whichGender.gender;
            this.listOptions = document.getElementById('listOptions');
        },
        populateWordLists: function () {
            this.listOptions.innerHTML = "";
            if (this.localVocabList != null) {
                this.localVocabList = app.localVocab;
                let keysVocabLists = Object.keys(addVocab.localVocabList);
                let i = 0;
                while (i < keysVocabLists.length) {
                    addVocab.listOptions.innerHTML += "<option value= \"" + keysVocabLists[i] + "\">" + keysVocabLists[i] + "</option>";
                    i++;
                }
            } else {
                addVocab.localVocabList = {};
            }
            this.listOptions.innerHTML += "<option value= \"createNew\"> Create New Category </option>";
        },
        clearForm: function () {
            this.wordInEnglish.value = "";
            this.wordInGerman.value = "";
            document.whichGender.gender.forEach(gender => {
                if (gender.checked) {
                    gender.checked = false;
                }
            });
            this.wordInGerman.style.borderColor = "rgba(255, 119, 35, 0.74)";
            this.wordInEnglish.style.borderColor = "rgba(255, 119, 35, 0.74)";
        },
        getGender: function () {
            for (let i = 0; i < addVocab.gender.length; i += 1) {
                if (addVocab.gender[i].checked) {
                    return addVocab.gender[i].dataset.gender;
                }
            }
        },
        checkIfDoubled: function () {
            console.log("checking for dupliate...");
            return true;
            /*
            let englishWordList = [];
            let germanWordList = [];
            app.localVocab[listOptions.value].forEach(word => {
                englishWordList.push(word.wordInEnglish);
                germanWordList.push(word.wordInGerman);
            });

            if (englishWordList.includes(newWord.wordInEnglish) || germanWordList.includes(newWord.wordInGerman)) {
                //should this change only be local (change indices but not actually over write word??)
                confirm("that word is already in your vocab list do you want to replace it?");
                if (englishWordList.includes(newWord.wordInEnglish)) {
                    console.log(englishWordList.indexOf(newWord.wordInEnglish));
                    vocab.splice(englishWordList.indexOf(newWord.wordInEnglish), 1);
                } else if (germanWordList.includes(newWord.wordInGerman)) {
                    vocab.splice(germanWordList.indexOf(newWord.wordInGerman), 1);
                }
            }*/
        },
        checkInput: function () {
            // check answer fits format, alert if not
            let englishWord = this.wordInEnglish.value.toString()
                .trim();
            let germanWord = this.wordInGerman.value.toString()
                .trim();
            let forbiddenChars = /^[A-Za-z]+$/;
            this.newWord = {
                "id": "null",
                "wordInEnglish": englishWord,
                "wordInGerman": germanWord,
                "gender": addVocab.getGender()
            };
            if (englishWord.split(" ")
                .length === 1 && germanWord.split(" ")
                .length === 1 && forbiddenChars.test(englishWord) && forbiddenChars.test(germanWord) && addVocab.newWord.gender != undefined) {
                if (addVocab.checkIfDoubled()) {
                    return true;
                }
            } else {
                console.log("that is not a valid input!");
                if (addVocab.newWord.gender == undefined) {
                    console.log("Tip: you need to select the gender of the word in German.");

                }
                if (!forbiddenChars.test(englishWord)) {
                    addVocab.wordInEnglish.style.borderColor = "red";
                } else if (forbiddenChars.test(englishWord)) {
                    addVocab.wordInEnglish.style.borderColor = "green";
                } else {
                    addVocab.wordInEnglish.style.borderColor = "rgba(255, 119, 35, 0.74)";
                }
                if (!forbiddenChars.test(germanWord)) {
                    addVocab.wordInGerman.style.borderColor = "red";
                } else if (forbiddenChars.test(germanWord)) {
                    addVocab.wordInGerman.style.borderColor = "green";
                } else {
                    addVocab.wordInGerman.style.borderColor = "rgba(255, 119, 35, 0.74)";
                }
            }
        },
        addWord: function () {
            if (addVocab.checkInput()) {
                if (addVocab.listOptions.value) {
                    if (addVocab.listOptions.value == "createNew") {
                        // change to div popup
                        let newList = prompt("name you new list", "New Category Name");
                        addVocab.listOptions.value = newList;
                        Object.keys(app.localVocab).forEach(key => {
                            if (newList == key) {
                                // change to div popup
                                confirm("You will be overwriting an existing list");
                            }
                        });

                        app.localVocab[newList] = [];
                        app.localVocab[newList].push(addVocab.newWord);
                    } else {
                        app.localVocab[addVocab.listOptions.value].push(addVocab.newWord);
                    }
                }
                // change to div popup
                alert(addVocab.newWord.wordInEnglish + " was added to your " + addVocab.listOptions.value + " List.");
                addVocab.clearForm();
                addVocab.populateWordLists();
            }

        }
    };


    /* Page navigation functions */
    let navi = {
        pages: [
            {
                name: "home",
                url: "pages/home.html",
                pageTitle: "home",
                urlPath: "/home",
                script: function () {
                    let navBtns = document.querySelectorAll('.pageLink');

                    /************* Event Listeners **************/
                    navBtns.forEach(navBtn => navBtn.addEventListener('click', function () {
                        navi.changeContent(this.dataset.page);
                    }));
                }
                },
            {
                name: "vocabTrainer",
                url: "pages/vocabTrainer.html",
                pageTitle: "vocabTrainer",
                urlPath: "/vocabTrainer",
                script: function () {

                    answer.addEventListener('change', vocabTrainer.checkAnswer);
                    answer.addEventListener('keyup', vocabTrainer.checkAnswer); //runs whenever a key is released

                    document.getElementById('hint')
                        .addEventListener('click', vocabTrainer.takeHint);
                    document.getElementById('info')
                        .addEventListener('click', function () {
                            popUps.popUp(0);
                        });

                    //document.addEventListener('load', startTrainer(wordToGuess, answer));
                    document.getElementById('next')
                        .addEventListener('click', function () {
                            vocabTrainer.changeWord(1);
                        });
                    document.getElementById('back')
                        .addEventListener('click', function () {
                            vocabTrainer.changeWord(-1);
                        });

                    /************* function call **************/
                    vocabTrainer.initialize();
                }
                },
            {
                name: "timedSession",
                url: "pages/timedSession.html",
                pageTitle: "timedSession",
                urlPath: "/timedSession",
                script: function () {
                    document.getElementById('reset')
                        .addEventListener('click', timer.reset);
                    document.getElementById('pause')
                        .addEventListener('click', timer.pause);
                    document.getElementById('play')
                        .addEventListener('click', timer.start);
                    document.querySelectorAll('.length')
                        .forEach(length => {
                            length.addEventListener('click', function () {
                                timer.addTime(length.dataset.minutes);
                            });
                        });
                }

                },
            {
                name: "addVocab",
                url: "pages/addVocab.html",
                pageTitle: "addVocab",
                urlPath: "/addVocab",
                script: function () {
                    document.getElementById('addWord')
                        .addEventListener('click', addVocab.addWord);
                    document.getElementById('clearForm')
                        .addEventListener('click', addVocab.clearForm);

                    /*************** Function calls ***************/
                    addVocab.setProperties();
                    addVocab.populateWordLists();
                }
                },
            {
                name: "stats",
                url: "pages/stats.html",
                pageTitle: "stats",
                urlPath: "/stats",
                script: function () {
                    /*document.getElementById('totalPoints').innerHTML = userAccount.score;
                    document.getElementById('totalTime').innerHTML = timer.convertTime(userAccount.totalTime);
                    document.getElementById('lastSession').innerHTML = timer.convertTime(userAccount.lastSession);
                    */
                    //logic for adding in word Lists and their length
                }
                },
            {
                name: "account",
                url: "pages/account.html",
                pageTitle: "account",
                urlPath: "/account",
                script: function () {
                    let addOrDelete = document.getElementById('addOrDeleteAccount');

                    addOrDelete.addEventListener('click', function () {
                        if (account.haveAccount) {
                            account.deleteAccount();
                        } else {
                            account.addAccount();
                        }
                    });

                    /**** Day/Night Mode ****/
                    let NightMode = false;
                    let checkbox = document.querySelector('.switch');

                    checkbox.addEventListener( 'change', function() {
                        
                        if(!NightMode) {
                            utils.addStyle("styleSheets/nightMode.css", "nightMode");
                            document.querySelector(".fa-sun-o").classList.add('hide');
                            document.querySelector(".fa-moon-o").classList.remove('hide');
                            NightMode = true;
                        } else {
                            let a = document.querySelector('#nightMode');
                            document.querySelector("head")
                                .removeChild(a);
                            document.querySelector(".fa-moon-o").classList.add('hide');
                            document.querySelector(".fa-sun-o").classList.remove('hide');
                            NightMode = false;
                        }
                    });

                    account.checkAccount();
                }
                }
            ],
        content: document.querySelector("#content"),
        processAjaxData: function (response, page) {
            /* set url in browser */
            document.title = page.pageTitle;
            window.history.pushState({
                "html": response,
                "pageTitle": page.pageTitle
            }, "", /*page.urlPath*/ ); /* routing not working with paths */
        },
        changeContent: function (clickedPage) {
            let pageMatch = (navi.pages.filter(page => page.name === clickedPage));
            let page = pageMatch[0];
            let script = page.script;
            let banner = document.querySelector('.banner');
            fetch(page.url).then(function (response) {
                if (response.ok) {
                    response.text().then(function (text) {
                        navi.content.innerHTML = text;
                    }).then(function () {
                        script();
                        if (clickedPage === "home") {
                            banner.style.display = "flex";
                        } else {
                            banner.style.display = "none";
                        }

                    });
                } else {
                    console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
                }
            })
        }
    };


    /* account functions */
    let account = {
        haveAccount: false,
        size: 150,
        textLength: 0,
        reduceFontSizeOnInput: function (e) {
            let answer = document.querySelector('.answer');
            let input = document.querySelector('#username');
            if (e.which === 13) {
                e.preventDefault();
            }

            if (input.innerText.length < 3) {
                answer.style.border = "solid red 0.1em";
                account.textLength = input.innerText.length;
            } else if (input.innerText.length < 18) {
                input.contentEditable = true;
                answer.style.border = "solid green 0.1em";
                if (input.innerText.length > account.textLength) {
                    if (input.innerText.length % 4 === 0) {
                        if(account.size > 45){
                            account.size -= 35;
                        }
                        input.style.fontSize = account.size.toString() + "%";
                    }
                    account.textLength = input.innerText.length;
                } else if (input.innerText.length < account.textLength) {
                    if (input.innerText.length % 4 === 0) {
                        account.size += 35;
                        input.style.fontSize = account.size.toString() + "%";
                    }
                    account.textLength = input.innerText.length;
                }

            } else if (input.innerText.length >= 18) {
                console.log("username must be between 3 and 25 characters");
                answer.style.border = "solid red 0.1em";
                if (e.which != 8) {
                    e.preventDefault();
                }
            }
        },
        checkAccount: function () {
            /**** Set Add/Delete Button ****/
            let addOrDelete = document.getElementById('addOrDeleteAccount');
            let userId = document.getElementById('userId');
            let joinedOn = document.getElementById('joinedOn');
            if (this.haveAccount) {
                /*userId.innerHTML = userAccount.name;
                joinedOn.innerHTML = userAccount.joined;*/
                addOrDelete.innerHTML = "Delete Account";
            } else {
                /*userId.innerHTML = "<div class=\"answer\"> <div contenteditable=\"true\" id=\"username\"  type=\"text\" placeholder=\"username\"></div></div>";

                userId.addEventListener('keydown', (event) => {
                    account.reduceFontSizeOnInput(event);
                });
                joinedOn.innerHTML = "";*/
                addOrDelete.innerHTML = "Add Account";
            }
        },
        addAccount: function () {
            /***** ADD Account *****/
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
                this.haveAccount = true;
                account.checkAccount();
            }
        },
        deleteAccount: function () {
            /***** Delete Account *****/
            //prompt a confirmation!
            console.log("Deleting account");
            userAccount.name = "";
            userAccount.joined = "";
            userAccount.score = "0";
            userAccount.totalTime = 0;
            userAccount.lastSession = 0;
            app.actualScore.innerHTML = 0;
            this.haveAccount = false;
            account.checkAccount();
        }
    }


    /* addVocab functions */
    let vocabTrainer = {
        wordToGuess: "",
        answer: "",
        vocabCard: "",
        chooseList: "",
        instruct: "",
        vocabList: "",
        currentIndex: Math.floor(Math.random() * 3),
        vocabToTrain: "",
        allVocab: [],
        vocabLists: "",
        initialize: function () {
            this.wordToGuess = document.getElementById('wordToGuess');
            this.answer = document.querySelector('.answer');
            this.vocabCard = document.querySelector('.card');
            this.chooseList = document.getElementById('chooseList');
            this.instruct = document.getElementById('Instruct');
            this.vocabList = document.getElementById('vocabList');
            this.populateWordLists();
        },
        /************* Functions **************/
        populateWordLists: function () {
            this.allVocab = function(){
                    if (ImportedVocab != null && app.localVocab != null) {
                        return [... app.localVocab, ...ImportedVocab];
                    } else if (ImportedVocab != null) {
                        return [...ImportedVocab];
                    } else if (app.localVocab != null) {
                        return [... app.localVocab];
                    } else {
                       return [];
                    }
            }


            if (vocabTrainer.allVocab().length < 1) {
                vocabTrainer.vocabList.innerHTML += "<li data-vocabList = \"1\">No categories currently available, add your own</li>";
                //Not working - goes straight to add vocab page // document.querySelector('#vocabList li').addEventListener('click', changeContent("addVocab", pages));
            } else {
                let i = 0;
                while (i < vocabTrainer.allVocab().length) {
                    vocabTrainer.vocabList.innerHTML += "<li data-vocabList = \"" + i + "\">" + Object.keys(vocabTrainer.allVocab()[i])[0] + "</li>";
                    i++;
                }
                vocabTrainer.vocabLists = document.querySelectorAll('#vocabList li');
                vocabTrainer.vocabLists.forEach(vocabList => vocabList.addEventListener('click', vocabTrainer.chosenWordList));
            }
        },
        startTrainer: function () { //need to make on click through to trainer and list specific
            this.wordToGuess.innerHTML = this.vocabToTrain[this.currentIndex].wordInEnglish;
            this.answer.addEventListener("click", function (e) {
                if (document.activeElement == document.getElementById('answer')) {
                    console.log("focused");
                    utils.keyboardUp();

                }
            });
        },
        removeArticles: function (str) {
            let words = str.split(" ");
            if (words.length <= 1) return (str);
            if (words[0] == "Der" || words[0] == "Die" || words[0] == "Das") {
                return words.splice(1)
                    .join(" ");
            }
            return str;
        },
        checkAnswer: function () {
            // NOT WORKING - prevent enter key from working during submitting of input(should stop bug when moving on to next work in vocab)
            window.addEventListener("keydown", function (e) {
                if ([13].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }
            }, false);
            //answer converted to string to avoid non string inputs
            let answerToCheck = vocabTrainer.answer.value.toString();
            let correctAnswer = vocabTrainer.vocabToTrain[vocabTrainer.currentIndex].gender + " " + vocabTrainer.vocabToTrain[vocabTrainer.currentIndex].wordInGerman;
            let correctExpression = new RegExp(vocabTrainer.removeArticles(correctAnswer), 'gi');
            //check if matches word exactly
            if (correctAnswer === answerToCheck) {
                vocabTrainer.answer.style.borderColor = "green";
                utils.plusPoint();
                popUps.popUpHide();
                setTimeout(function () {
                    vocabTrainer.changeWord(1);
                }, 1000);
                //check if matches regardless of case & alert
            } else if (correctAnswer.toLowerCase() === answerToCheck.toLowerCase()) {
                popUps.popUp(1);
                //check if matches without article 
            } else if (answerToCheck.match(correctExpression)) {
                popUps.popUp(2);
            } else {
                vocabTrainer.answer.style.borderColor = "rgba(255, 119, 35, 0.74)";
            }
        },
        //not working on firefox!!!!!
        takeHint: function () {
            vocabTrainer.answer.value = "";
            vocabTrainer.answer.value = vocabTrainer.vocabToTrain[vocabTrainer.currentIndex].wordInGerman.slice(0, 3);
            app.hintTaken = true;
        },
        changeWord: function (direction) {
            if (direction == 1 && vocabTrainer.currentIndex === vocabTrainer.vocabToTrain.length - 1) {
                vocabTrainer.currentIndex = 0;
            } else if (direction == 1) {
                vocabTrainer.currentIndex++;
            } else if (direction == -1 && currentIndex === 0) {
                vocabTrainer.currentIndex = vocabTrainer.vocabToTrain.length - 1;
            } else {
                vocabTrainer.currentIndex--;
            }
            this.wordToGuess.innerHTML = this.vocabToTrain[this.currentIndex].wordInEnglish;
            this.answer.value = "";
            this.flipToNext();
            this.checkAnswer();
        },
        flipToNext: function () {
            this.vocabCard.classList.toggle('flipped');
        },
        chosenWordList: function (event) {
            vocabTrainer.chooseList.setAttribute('class', 'hide');
            vocabTrainer.instruct.classList.remove('hide');
            vocabTrainer.vocabToTrain = vocabTrainer.allVocab()[this.dataset.vocablist][this.innerHTML];
            vocabTrainer.currentIndex = Math.floor(Math.random() * vocabTrainer.vocabToTrain.length),
            vocabTrainer.startTrainer();
        }

    }



    /***************  Event Listeners ***************/
    /* To use back and forwards buttons in Browser */
    window.onpopstate = function (e) {
        if (e.state) {
            content.innerHTML = e.state.html;
            document.title = e.state.pageTitle;
        }
    };

    app.homeBtn.addEventListener('click', function () {
        navi.changeContent("home");
    });

    app.accountBtn.addEventListener('click', function () {
        navi.changeContent("account");
    });

    window.addEventListener('load', function () {
        //need to change later so 
        emulateLocalStorage('assets/wordLists.json').then((value) => {
            vocabMine = value;
            app.loadLocalStorage();
        });
        emulateLocalStorage('assets/userAccount.json').then((value) => {
            userAccount = value;
            if (!userAccount.score) {
                app.actualScore.innerHTML = "0";
            } else {
                app.actualScore.innerHTML = userAccount.score;
            }
        });
        navi.changeContent("home");
    });

//})();
