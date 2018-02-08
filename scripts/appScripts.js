
//(function() {
'use strict';

/***************************
        Service Worker 
/****************************/

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


/********************************************
        Indexed DB for local storage 
/*********************************************/
//Check for indexedDB in all browers in some it is called different
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

//alerts if indexedDB is not supported by Browser
 if (!indexedDB) {
     window.alert("Your browser doesn't support a stable version of IndexedDB.")
 }

// To start of database object store off it needs a list
const starterVocab = [
    {ListName: "Animals1", wordList : [{ wordInEnglish: "Dog", wordInGerman: "Hund", gender: "Der"},
    { wordInEnglish: "Cat", wordInGerman: "Katze", gender: "Die"}
]}];

let db;
// opens IndexedDB "localDataBase" if it exists with version one. If not there it is created.
let open = indexedDB.open("localDatabase", 2);

// Logs error to console if DB not found
open.onerror = function(event) {
    console.log(event);
};

// on success of DataBase save results to "db" and log success to console.
open.onsuccess = function(event) {
    db = open.result;
    console.log("success: "+ db);
};


/* creates object store (local Vocab) if not already created and sets initial item to it (****will make this an empty oject and index from 1 in future****)**/

open.onupgradeneeded = function(event) {
    console.log(event);
    let db = event.target.result;
    // create Object Store called "LocalVocab" its keys will take the "ListName"
    let objectStore = db.createObjectStore("LocalVocab", {keyPath: "ListName"});
    // Adds initializer item (starter Vocab) to Object Store
    objectStore.add(starterVocab);
    // create Object Store called "UserAccount" its keys will take the "name"
    let objectStoreUser = db.createObjectStore("UserAccount", {keyPath: "name"});
    // Adds initializer item (blank user account) to Object Store
    objectStoreUser.add(app.userAccount); 
}



/***********************
        App Object 
/************************/
let app = {
    /*************** Global Variables for App ***************/
    body: document.querySelector("body"),
    nav: document.querySelector("nav"),
    footer: document.querySelector('.footer'),
    homeBtn: document.getElementById('home'),
    accountBtn: document.getElementById('account'),
    actualScore: document.getElementById('actualScore'),
    //Blank UserAccount if an account is stored locally this is replaced with it's details
    userAccount: {
        "name": "",
        "joined": "",
        "score": 0,
        "totalTime": 0,
        "lastSession": 0,
        "icon": ""
    },
    soundOn: true,
    nightMode: false,
    hintTaken: false,
    //loading spinner - only visable when loading at start
    spinner: document.querySelector('.loader'),
};


/*****************************
        Utility Functions
/******************************/
let utils = {
    // adds point when correct answer given. **** BROKEN ****
    plusPoint: function () {
        //set promise to first get the user score and then update it, finally it should be changed in the display.
            let objectStore = db.transaction(["UserAccount"], "readwrite").objectStore("UserAccount");
            let request = objectStore.get(app.userAccount.name);
            request.onerror = function (event) {
                // Handle errors!
                console.log(event.target);
            };
            request.onsuccess = function (event) {

                // Get the old value that we want to update
                let data = event.target.result;

                //update the value(s) in the object that you want to change
                if (app.hintTaken) {
                    data['score'] += 1;
                    app.hintTaken = false;
                } 
                else {
                    data['score'] += 2;
                }
                // Put this updated object back into the database.
                let requestUpdate = objectStore.put(data);
                requestUpdate.onerror = function (event) {
                    // Do something with the error
                };
                requestUpdate.onsuccess = function (event) {
                    // Success - the data is updated!
                };
            }
            account.updateAccount();
    },
    // play sound to notify a correct answer (can turn off sounds on account page)
    playPointSound: function () {
        if (app.soundOn) {
            document.querySelector('#pointSound').play();
        }
    },
    // add stylesheet reference to page
    addStyle: function (styleSheet, styleName) {
        /* Add style sheet to site */
        const head = document.querySelector("head");
        let newStyleSheet = document.createElement("link");
        newStyleSheet.rel = "stylesheet";
        newStyleSheet.type = "text/css";
        newStyleSheet.id = styleName;
        newStyleSheet.href = styleSheet;
        head.appendChild(newStyleSheet);
    }
};


/************************************
        Page navigation functions
/*************************************/
let navi = {
    // Object containing information for all pages incl. name/url/pageTitle and scripts upon page loading
    pages: [
                //home
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
                //Vocab trainer
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
                document.getElementById('timerControl').addEventListener('click', function () {
                    if (timer.started) {
                        timer.pause();
                        document.querySelector('.fa-pause-circle-o').classList.add('hide');
                        document.querySelector('.fa-play-circle-o').classList.remove('hide');
                    } else {
                        timer.start();
                        document.querySelector('.fa-play-circle-o').classList.add('hide');
                        document.querySelector('.fa-pause-circle-o').classList.remove('hide');
                    }
                });
                /************* function call **************/
                vocabTrainer.initialize();
            }
        },
                //timer
        {
            name: "timedSession",
            url: "pages/timedSession.html",
            pageTitle: "timedSession",
            urlPath: "/timedSession",
            script: function () {
                // have timer counting down in display if one is running
                timer.timerSet = document.querySelector(".timerDisplay");
                //timer.timerSet.innerHTML = timer.convertTime(timer.time);
                document.getElementById('reset').addEventListener('click', timer.reset);
                document.getElementById('pause').addEventListener('click', timer.pause);
                document.getElementById('play').addEventListener('click', function () {
                    popUps.popUp(6);
                    timer.start();
                    timer.getStarted = setTimeout(function () {
                        popUps.popUpHide();
                        navi.changeContent("vocabTrainer");
                    }, 1500);
                });
                document.querySelectorAll('.arrow').forEach(arrow => {
                    arrow.addEventListener('click', function () {
                        console.log(arrow.id);
                        switch (arrow.id) {
                            case "hourPlusTen":
                                timer.time += 36000;
                                break;
                            case "hourPlusOne":
                                timer.time += 3600;
                                break;
                            case "minutePlusTen":
                                timer.time += 600;
                                break;
                            case "minutePlusOne":
                                timer.time += 60;
                                break;
                            case "hourMinusTen":
                                timer.time -= 36000;
                                break;
                            case "hourMinusOne":
                                timer.time -= 3600;
                                break;
                            case "minuteMinusTen":
                                timer.time -= 600;
                                break;
                            case "minuteMinusOne":
                                timer.time -= 60;
                                break;
                        }
                        timer.displayTime(timer.convertTime(timer.time));
                    });
                });
                document.querySelectorAll('.length').forEach(length => {
                    length.addEventListener('click', function () {
                        timer.addTime(length.dataset.minutes);
                    });
                });

            }
                },
                //add Vocab
        {
            name: "addVocab",
            url: "pages/addVocab.html",
            pageTitle: "addVocab",
            urlPath: "/addVocab",
            script: function () {
                document.querySelector('#addWord')
                    .addEventListener('click', addVocab.addWord);
                document.getElementById('manageLocalLists').addEventListener('click', function () {
                    console.log("click");
                    navi.changeContent("manageVocab");
                });

                /*************** Function calls ***************/
                addVocab.setProperties();
                addVocab.populateWordLists();
            }
                },
                //stats
        {
            name: "stats",
            url: "pages/stats.html",
            pageTitle: "stats",
            urlPath: "/stats",
            script: function () {
                // Add is Total Points to Score Board
                document.getElementById('totalPoints').innerHTML = app.userAccount.score;
                // Add is Total Time to Score Board
                document.getElementById('totalTime').innerHTML = timer.convertTime(app.userAccount.totalTime);
                // Add is Last Session Time to Score Board
                document.getElementById('lastSession').innerHTML = timer.convertTime(app.userAccount.lastSession);
                // If Account display account details above score board, if not display hint to make one below.
                if (account.haveAccount) {
                    document.querySelector('#userId').innerHTML = app.userAccount.name;
                    document.querySelector('#joinedOn').innerHTML = app.userAccount.joined;
                    document.querySelector('#addAccountHint').classList.add('hide');
                    document.querySelector('.accountDetails').classList.remove('hide');
                } else {
                    document.querySelector('.accountDetails').classList.add('hide');
                    document.querySelector('#addAccountHint').classList.remove('hide');
                    document.querySelector('#addAccountHint button').addEventListener('click', function () {
                        navi.changeContent("account");
                    });
                }
            }
                    },
                //account
        {
            name: "account",
            url: "pages/account.html",
            pageTitle: "account",
            urlPath: "/account",
            script: function () {
                /*********************
                 Add or Delete Account 
                **********************/
                document.getElementById('addOrDeleteAccount').addEventListener('click', function () {
                    if (account.haveAccount) {
                        account.deleteAccount();
                    } else {
                        account.addAccount();
                    }
                });

                /*********************
                     Day/Night Mode 
                **********************/
                let nightDayMode = document.querySelector('#dayNightSwitch input');

                function checkNightTime() {
                    if (app.nightMode) {
                        document.querySelector(".fa-sun-o").classList.add('hide');
                        document.querySelector(".fa-moon-o").classList.remove('hide');
                        nightDayMode.setAttribute('checked', true);
                    } else {
                        document.querySelector(".fa-moon-o").classList.add('hide');
                        document.querySelector(".fa-sun-o").classList.remove('hide');
                    }
                }

                nightDayMode.addEventListener('change', function () {
                    if (!app.nightMode) {
                        utils.addStyle("styleSheets/nightMode.css", "nightMode");
                        app.nightMode = true;
                    } else {
                        let a = document.querySelector('#nightMode');
                        document.querySelector("head").removeChild(a);
                        app.nightMode = false;
                    }
                    checkNightTime();
                });

                checkNightTime();


                /*********************
                     Sound On / Off 
                **********************/
                let soundControl = document.querySelector('#volumeControl');
                let soundSwitch = soundControl.querySelector('.slider');
                let volumeUp = document.querySelector(".fa-volume-up");
                let volumeOff = document.querySelector(".fa-volume-off");

                function soundCheck() {
                    if (app.soundOn) {
                        volumeOff.classList.add('hide');
                        volumeUp.classList.remove('hide');
                    } else {
                        volumeUp.classList.add('hide');
                        volumeOff.classList.remove('hide');
                    }
                }

                soundSwitch.addEventListener('click', function () {
                    if (app.soundOn) {
                        app.soundOn = false;
                    } else {
                        app.soundOn = true;
                    }
                    soundCheck()
                });

                soundCheck();

                /*********************
                    Check for Account 
                 **********************/
                account.checkAccount();

            }
                        },
                //manage Vocab
        {
            name: "manageVocab",
            url: "pages/manageLocalLists.html",
            pageTitle: "manageVocab",
            urlPath: "/manageVocab",
            script: function () {
                manageLocalList.initialize();
                manageLocalList.populateLocalVocabList();
                manageLocalList.populateDataBaseVocabLists();
                
            }
                    },
                ],
    // content div is where new html is staged
    content: document.querySelector("#content"),
    // function to add routing ******* NEEDS CHECKING *******
    processAjaxData: function (response, page) {
        /* set url in browser */
        document.title = page.pageTitle;
        window.history.pushState({
            "html": response,
            "pageTitle": page.pageTitle
        }, "", /*page.urlPath*/ ); /* routing not working with paths */
    },
    // fetch call and handler for response to change page navi
    changeContent: function (clickedPage) {
        let pageMatch = (navi.pages.filter(page => page.name === clickedPage));
        let page = pageMatch[0];
        let script = page.script;
        fetch(page.url).then(function (response) {
            if (response.ok) {
                response.text().then(function (text) {
                    navi.content.innerHTML = text;
                }).then(function () {
                    script();
                    if (clickedPage === "home") {
                        app.footer.classList.remove('hide');
                    } else {
                        app.footer.classList.add('hide');
                    }

                });
            } else {
                console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
            }
        })
    }
};


/********************************
        Vocab Trainer functions
/*********************************/
let vocabTrainer = {
    // word to be guessed
    wordToGuess: "",
    // input for user answer
    answer: "",
    // div with card elements inside
    vocabCard: "",
    // selects div element for choosing the vocab List, hides when playing
    chooseList: "",
    // selects the instruction div and shows it while you are playing
    instruct: "",
    //element to contain list of possible vocab lists
    vocabList: "",
    // interval for displaying timer while playing
    trainerInterval: "",
    // sets current Index to initial value, before trainer starts this is personalized to the chosen list length
    currentIndex: "",
    // set to an array of objects with the words from the list selected to trian with
    vocabToTrain: "",
    // array to hold all vocab, both from the DB and locally stored
    allVocab: [],
    vocabLists: "",
    //initialize values for above properties
    initialize: function () {
        this.wordToGuess = document.getElementById('wordToGuess');
        this.answer = document.querySelector('.answer');
        this.vocabCard = document.querySelector('.card');
        this.chooseList = document.getElementById('chooseList');
        this.instruct = document.getElementById('Instruct');
        this.vocabList = document.getElementById('vocabList');
        this.populateWordLists();
    },
    //initialize and set up the list of vocab available
    populateWordLists: function () {
        let populateLists = new Promise(function(resolve, reject) {
            //Makes transaction to local DB to look for local Vocab 
            let transaction = db.transaction(["LocalVocab"]);
            let objectStore = transaction.objectStore("LocalVocab");
            // gets key of local Vocab and stores in array 
            let keys = objectStore.getAllKeys();
            //error message if problem connecting to indexedDB
            keys.onerror = function (event) {
                alert("Unable to retrieve data from local database!");
            };
            //If local Vocab found goes through key array and adds them to the list options
            keys.onsuccess = function (event) {
                addVocab.localVocabLists = keys.result;
                if (addVocab.localVocabLists.length < 1) {
                    vocabTrainer.vocabList.innerHTML += "<li data-vocabList = \"1\">No categories currently available, add your own</li>";
                    //Not working - goes straight to add vocab page // document.querySelector('#vocabList li').addEventListener('click', changeContent("addVocab", pages));
                }
                let i = 0;
                while (i < addVocab.localVocabLists.length) {
                    vocabTrainer.vocabList.innerHTML += "<li class=\"localList\" data-vocabList = \"" + addVocab.localVocabLists[i] + "\">" + addVocab.localVocabLists[i] + "</li>";
                    i++;
                }
            } 
            // fetches DB lists then adds event listeners for all lists
            fetch('./php/getVocabLists.php').then(function (response) {
                if (response.ok) {
                    response.text().then(function (text) {
                        vocabTrainer.vocabList.innerHTML += text;
                    });
                } else {
                    console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
                }
            }).then(function(){
                resolve("finished");
            });
            
        });
            
        populateLists.then(function(){
            //checks first that the there are some vocab lists to train with.
            if(document.querySelectorAll('#vocabList li').length > 0 ){
                // set event listener on to local DB lists to sort which is clicked and provide the correct training vocab
                let localLists = document.querySelectorAll('#vocabList .localList');
                localLists.forEach(vocabList => vocabList.addEventListener('click', function(e){
                    vocabTrainer.chosenLocalWordList(e);
                }));
                // set event listener on to Server DB lists to sort which is clicked and provide the correct training vocab
                let DBLists = document.querySelectorAll('#vocabList .DBList');
                DBLists.forEach(vocabList => vocabList.addEventListener('click', function(e){
                    vocabTrainer.chosenDBWordList(e);
                }));
            } else {
                //If no local vocab only adds create new list 
                vocabTrainer.vocabList.innerHTML += "<li data-vocabList = \"1\">No local Lists, add your own, or download Lists for offline use</li>";
                //Not working - goes straight to add vocab page // 
                document.querySelector('#vocabList li').addEventListener('click', function(){
                    changeContent("addVocab", pages);
                });
            }
            
        });
    },
    //starts trainer with selected Vocab List (goes into play mode)
    startTrainer: function () {
        // Sets current Index to random value between 0 and word list length.
        this.currentIndex = Math.floor(Math.random() * this.vocabToTrain.length);
        //sets the word to guess using the current index set above
        this.wordToGuess.innerHTML = this.vocabToTrain[this.currentIndex].wordInEnglish;
        // if timer is set displays timer
        if (timer.time > 0) {
           vocabTrainer.trainerInterval = setInterval(function () {
                timer.displayTime(timer.convertTime(timer.time));
            }, 1000);
            // if timer not started (but timer has been set ie given timer.time > 0) hide the pause button and display play.
            if (!timer.started) {
                document.querySelector('.fa-pause-circle-o').classList.add('hide');
                document.querySelector('.fa-play-circle-o').classList.remove('hide');
            }
        } else {
            // if not timer set hide the timer controler.
            document.querySelector('.fa-pause-circle-o').classList.add('hide');
        }
        // sets even listener to exit trainer.
        document.querySelector('.exit').addEventListener('click', this.endTrainer);
    },
    //end trainer return nav bar, clear interval
    endTrainer: function () {
        //clear interval to display timer
        clearInterval(vocabTrainer.trainerInterval);
        //hide the vocab trainer
        vocabTrainer.instruct.classList.add('hide');
        // hide the trainer nav
        app.nav.classList.remove('hide');
        //display the lists to choose from
        vocabTrainer.chooseList.removeAttribute('class', 'hide');
    },
    // utility function to remove articles from words to check if correct word has been given without article
    removeArticles: function (str) {
        // split words by blank space to separate the article
        let words = str.split(" ");
        //if no article given 
        if (words.length <= 1) return (str);
        // if the first word matches the article remove it and then rejoin the words with a " " in between
        if (words[0] == "Der" || words[0] == "Die" || words[0] == "Das") {
            return words.splice(1)
                .join(" ");
        }
        return str;
    },
    // run checks on answer, if correct goes to next word, hints given if almost correct
    checkAnswer: function () {
        // NOT WORKING - prevent enter key from working during submitting of input(should stop bug when moving on to next work in vocab)
        window.addEventListener("keydown", function (e) {
            if ([13].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        //answer converted to string to avoid non string inputs
        let answerToCheck = vocabTrainer.answer.value.toString();
        // set correct answer
        let correctAnswer = vocabTrainer.vocabToTrain[vocabTrainer.currentIndex].gender + " " + vocabTrainer.vocabToTrain[vocabTrainer.currentIndex].wordInGerman;
        // set RegExp with article removed
        let correctExpression = new RegExp(vocabTrainer.removeArticles(correctAnswer), 'gi');
        //check if matches word exactly
        if (correctAnswer === answerToCheck) {
            // change border to green
            vocabTrainer.answer.style.borderColor = "green";
            //plus point to score
            utils.plusPoint();
            //play sound to indicate point gained
            utils.playPointSound();
            //hide any pops ups currently displayed (ie hints)
            popUps.popUpHide();
            //time out to move on to next word.
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
            //resets border to regular color
            vocabTrainer.answer.style.borderColor = "rgba(255, 119, 35, 0.74)";
        }
    },
    // offers hint (first three letters of word (without article) not working on firefox!!!!!
    takeHint: function () {
        //reset input to blank
        vocabTrainer.answer.value = "";
        // give 3 first characters of word (article removed)
        vocabTrainer.answer.value = vocabTrainer.vocabToTrain[vocabTrainer.currentIndex].wordInGerman.slice(0, 3);
        // sets hint taken to true as this action effects scoring
        app.hintTaken = true;
    },
    //changes word either by skipping or correct completion
    changeWord: function (direction) {
        // checks first where in loop the current index is and loops back to start ("0") if at end
        if (vocabTrainer.currentIndex === vocabTrainer.vocabToTrain.length - 1) {
            vocabTrainer.currentIndex = 0;
        } else if (direction == 1) {
            vocabTrainer.currentIndex++;
        }
        // sets word to guess
        this.wordToGuess.innerHTML = this.vocabToTrain[this.currentIndex].wordInEnglish;
        // returns answer input to blank
        this.answer.value = "";
        //animated flip to next word
        this.flipToNext();
        //starts check answer listener function
        this.checkAnswer();
    },
    //flip animation for when correct answer given or word is skipped
    flipToNext: function () {
        // simple animation for "flipping" card to next one 
        //****** WANT TO ADD ANSWER TO BACK OFF CARD SO IF SKIPPED THEY SEE IT FOR NEXT ROUND *****
        this.vocabCard.classList.toggle('flipped');
    },
    //when user selects their chosen word list the below two functions starts the trainer and removes the nav and vocab lists (ie goes into play mode) depends on whether list is local or not
     //function to handle chosen Database word lists - once clicked goes through to the trainer with words from server DB
    chosenDBWordList: function (event) {
        // sets word vocab to train variable to use in fetch() from the chosen lists dataset info
        let VocabToTrain = event.srcElement.dataset.vocablist;
        // sets url to use in fetch()
        let url = "php/downloadList.php?listToDownload=" + VocabToTrain;
        // fetch to php with listToDownload set through $_GET (this equals the tables name)
        fetch(url).then(function (response) {
                if (response.ok) {
                    response.text().then(function (text) {
                        // sets the vocab to train to the returned parsed json data (= word objects array)
                        vocabTrainer.vocabToTrain = JSON.parse(text);
                    });
                } else {
                    console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
                }
        }).then(function(){
            // removes lists to choose from
            vocabTrainer.chooseList.setAttribute('class', 'hide');
            // hides the app nav
            app.nav.classList.add('hide');
            // displays the trainer
            vocabTrainer.instruct.classList.remove('hide');
            // sets score to actual user account score
            vocabTrainer.instruct.querySelector('#actualScore').innerHTML = app.userAccount['score'];
            // starts trainer
            vocabTrainer.startTrainer();
        })
    },
    //function to handle chosen local word lists - once clicked goes through to the trainer with words from local DB
    chosenLocalWordList: function (event) {
        //makes local DB call to local Vocab Objectstore and gets the correct list using the chosen lists dataset info
        let transaction = db.transaction(["LocalVocab"]);
        let objectStore = transaction.objectStore("LocalVocab");
        let list = objectStore.get(event.srcElement.dataset.vocablist);
        list.onerror = function(event) {
          alert("Error " + event);
        };

        list.onsuccess = function(event) {
            //sets vocab to train to returned list
            vocabTrainer.vocabToTrain = list.result.wordList;
            // removes lists to choose from
            vocabTrainer.chooseList.setAttribute('class', 'hide');
            // hides the app nav
            app.nav.classList.add('hide');
            // displays the trainer
            vocabTrainer.instruct.classList.remove('hide');
            // sets score to actual user account score
            vocabTrainer.instruct.querySelector('#actualScore').innerHTML = app.userAccount['score'];
            // starts trainer
            vocabTrainer.startTrainer();
        };    
    }
}


/*****************************
        addVocab functions 
/******************************/
let addVocab = {
    //imported vocab from DB
    ImportedVocab: "",
    // local vocab saved in IndexDB
    localVocabLists: [],
    //new word object to be added to local vocab
    newWord: "",
    //Input field for new word in English
    wordInEnglish: "",
    //Input field for new word in German
    wordInGerman: "",
    //Input field for new word's gender
    gender: "",
    // list options is HTML Element where current vocab lists are stored and able to be selected.
    listOptions: "",
    // sets up values for above properties once page is loaded
    setProperties: function () {
        this.wordInEnglish = document.getElementById('english');
        this.wordInGerman = document.getElementById('german');
        this.gender = document.addVocab.gender;
        this.listOptions = document.getElementById('listOptions');
    },
    //populates list Options HTML element from collected Vocab Lists, also adds option add List
    populateWordLists: function (selected) {
        //clears Vocab List to begin
        addVocab.listOptions.innerHTML = "";
        // Makes transaction to local DB to look for local Vocab
        let transaction = db.transaction(["LocalVocab"]);
        let objectStore = transaction.objectStore("LocalVocab");
        // gets key of local Vocab and stores in array 
        let keys = objectStore.getAllKeys();
        // If no local vocab only adds create new list 
        keys.onerror = function (event) {
            alert("Unable to retrieve data from database!");
            addVocab.listOptions.innerHTML += "<option value= \"createNew\"> Create New Category </option>";
        };
        // If local Vocab found goes through key array and adds them to the list options 
        keys.onsuccess = function (event) {
            addVocab.localVocabLists = keys.result;
            let i = 0;
            while (i < addVocab.localVocabLists.length) {
                addVocab.listOptions.innerHTML += "<option value= \"" + addVocab.localVocabLists[i] + "\">" + addVocab.localVocabLists[i] + "</option>";
                i++;
            }
            // At the end adds a create new list option
            addVocab.listOptions.innerHTML += "<option value= \"createNew\"> Create New Category </option>";
            // Promsie with selected object passed into it it's on resolve function.
            let promise = Promise.resolve(selected);
            promise.then(function(value){
                /* On resolve checks for existence of selected and sets the list option with that value to be selected so it appears at the top of the list atfer the new word is added */
                if (selected) {
                    addVocab.listOptions.querySelector('option[value="' + selected + '"]').selected = true;
                }
            });
        } 
    },
    //resets form for adding a new word 
    clearForm: function () {
        this.wordInEnglish.value = "";
        this.wordInGerman.value = "";
        this.gender[0].checked = true;
        //return border colors
        this.wordInGerman.style.borderColor = "rgba(255, 119, 35, 0.74)";
        this.wordInEnglish.style.borderColor = "rgba(255, 119, 35, 0.74)";
    },
    // mini function to grab inputed gender for new word
    getGender: function () {
        for (let i = 0; i < addVocab.gender.length; i += 1) {
            if (addVocab.gender[i].checked) {
                return addVocab.gender[i].dataset.gender;
            }
        }
    },
    // checks for duplicates and also contains logic for checking input is correct - ****** NEEDS FINISHING *******
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
    // check answer fits format, alert if not ****** NEEDS FINISHING *******
    checkInput: function () {
        let englishWord = this.wordInEnglish.value.toString()
            .trim();
        let germanWord = this.wordInGerman.value.toString()
            .trim();
        let forbiddenChars = /^[A-Za-z]+$/;
        this.newWord = {
            //"id": "null",
            "ListName": "",
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
    // adds new word to selected list or creates new list if that has been selected
    addWord: function () {
        // first checks that new word passes tests
        if (addVocab.checkInput()) {
            // checks the list chosen to add too
            if (addVocab.listOptions.value) {
                //if this is equal to "createNew" new list will be created
                if (addVocab.listOptions.value == "createNew") {
                    // ****** change to div popup **********
                    let newList = prompt("name you new list", "New Category Name");
                    // save new list name from prompt above
                    addVocab.listOptions.value = newList;
                    //checks through the local vocab lists to see if this list name already exist  ******** needs                                                                      fixing to use indexed DB *******
                    /*for (let k = 0; k < app.localVocab.length; k++) {
                        if (app.localVocab[k][0] === newList) {
                            // ***** change to div popup ********
                            confirm("You will be overwriting an existing list");
                        }
                    }*/
                    // define variable to temporarily hold the new list and its first word info
                    let insertList = {}
                    // save list name the above object the first word under the title of the new list (as this is used as key path)
                    insertList[newList] = [addVocab.newWord];
                                      
                    let request = db.transaction(["LocalVocab"], "readwrite")
                         .objectStore("LocalVocab")
                         .add({ListName: newList, wordList : [addVocab.newWord]});

                    request.onsuccess = function (event) {
                        // change to div popup
                        alert(addVocab.newWord.wordInEnglish + " was added to your " + newList + " List.");
                    };

                    request.onerror = function (event) {
                        console.log(event.target);
                    }
                    //reset form
                    addVocab.clearForm();
                    // repopulate the word lists to include the new one added
                    addVocab.populateWordLists(newList);

                } else {
                    /* First finds the selected list then adds new word to it and sends it back as updated*/
                    let objectStore = db.transaction(["LocalVocab"], "readwrite").objectStore("LocalVocab");
                    let request = objectStore.get(addVocab.listOptions.value);
                    request.onerror = function (event) {
                        // Handle errors!
                        console.log(event.target);
                    };
                    request.onsuccess = function (event) {
                        // Get the old value that we want to update
                        let data = event.target.result;

                        // update the value(s) in the object that you want to change
                        data.wordList.push(addVocab.newWord);
                        // Put this updated object back into the database.
                        let requestUpdate = objectStore.put(data);
                        requestUpdate.onerror = function (event) {
                            // Do something with the error
                        };
                        requestUpdate.onsuccess = function (event) {
                            // Success - the data is updated!
                            console.log("updated");
                        };
                    };
                    
                    // Inform user word was added and to which list -  ******change to div popup ********
                    alert(addVocab.newWord.wordInEnglish + " was added to your " + addVocab.listOptions.value + " List.");
                    /* clear form for next usse */
                    addVocab.clearForm();
                    /* repopulate words lists options */
                    addVocab.populateWordLists(addVocab.listOptions.value);
                }
            }
        }

    }
};


/*****************************************
        Manage Vocab Lists functions 
/*****************************************/
let manageLocalList = {
    listOptions: "",
    dataBaseVocabLists: "",
    deleteBtn: "",
    //declare list to download variable
    listToDownload: "",
    urlToDownload: "",
    downloadedList: "",
    //initialize document by finding elements needed for fucntions 
    initialize: function(){
        this.dataBaseVocabLists = document.getElementById('dataBaseVocabLists'); 
        this.listOptions = document.getElementById('listOptions'); 
        this.deleteBtn = document.querySelector('#deleteList');
        this.downloadBtn = document.querySelector('#downloadList');
    },
    populateDataBaseVocabLists: function() {
        /* clears Vocab List to begin*/
        manageLocalList.dataBaseVocabLists.innerHTML = "";
        /* Makes AJAX call to DB to look for Vocab List*/
        fetch('./php/dataBaseVocabLists.php').then(function (response) {
            if (response.ok) {
                response.text().then(function (text) {
                    console.log("ok");
                    manageLocalList.dataBaseVocabLists.innerHTML = text;
                }).then(function () {
                    // add create category here
                });
            } else {
                console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
            }
        })
    },
    downloadVocabList: function(){
        //set list to download variable

            manageLocalList.dataBaseVocabLists.querySelectorAll("option").forEach(option => {
                if(option.selected == true){
                    manageLocalList.listToDownload =  option.value;
                    manageLocalList.urlToDownload = "php/downloadList.php?listToDownload=" + manageLocalList.listToDownload;
                }
            });
            fetch(manageLocalList.urlToDownload).then(function (response) {
                if (response.ok) {
                    console.log("A");

                    response.text().then(function (text) {
                        //document.querySelector('#wordLists').innerHTML +
                        manageLocalList.downloadedList = JSON.parse(text);
                    });
                } else {
                    console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
                }
            }).then(function(){
                    let request = db.transaction(["LocalVocab"], "readwrite")
                                 .objectStore("LocalVocab")
                                 .add({ListName: manageLocalList.listToDownload, wordList : manageLocalList.downloadedList});

                    request.onsuccess = function (event) {
                        // change to div popup alert adds time delay
                        manageLocalList.populateLocalVocabList();
                    };

                    request.onerror = function (event) {
                        console.log(event.target);
                    }
            });
    },
    populateLocalVocabList: function() {
        /* clears Vocab List to begin*/
        manageLocalList.listOptions.innerHTML = "";
        let i = 0;
        
        /* Makes transaction to local DB to look for local Vocab */
        let transaction = db.transaction(["LocalVocab"]);
        let objectStore = transaction.objectStore("LocalVocab");
        /* gets key of local Vocab and stores in array */
        let keys = objectStore.getAllKeys();
        /* If no local vocab only adds create new list */
        keys.onerror = function (event) {
            alert("Unable to retrieve data from database!");
            
        };
        /* If local Vocab found goes through key array and adds them to the list options */
        keys.onsuccess = function (event) {
            addVocab.localVocabLists = keys.result;
            let i = 0;
            while (i < addVocab.localVocabLists.length) {
                manageLocalList.listOptions.innerHTML += "<option value= \"" + addVocab.localVocabLists[i] + "\">" + addVocab.localVocabLists[i] + "</option>";
                i++;
            }
        } 
        manageLocalList.deleteBtn.addEventListener('click', function(){
            manageLocalList.deleteLocalList();
        });
        manageLocalList.downloadBtn.addEventListener('click', function(){
            manageLocalList.downloadVocabList();
        });
    },
    deleteLocalList: function () {
        //declare list to delete variable
        let listToDelete;
        //set list to delete variable
        let promise = Promise.resolve(
            manageLocalList.listOptions.querySelectorAll("option").forEach(option => {
                if(option.selected == true){
                    listToDelete =  option.value;
                }
            }));
        promise.then(function(value){
            console.log(listToDelete);
            let request = db.transaction(["LocalVocab"], "readwrite")
            .objectStore("LocalVocab")
            .delete(listToDelete);

            request.onsuccess = function (event) {
                alert(listToDelete + " has been removed from your database.");
            };
        }).then(function(){
            manageLocalList.populateLocalVocabList();
        });
        
    }
}


/*****************************
        account functions 
/******************************/
let account = {
    // Boolean for if account is present
    haveAccount: false,
    // Check User name meets specifications
    checkUserNameInput: function (inputUserName) {
        return /((?!.*[^a-zA-Z0-9].*$).{4,20})/.test(inputUserName.value);
    },
    // check if an account exists and set properties in either case
    checkAccount: function () {
        // Set Add/Delete Button
        let addOrDelete = document.getElementById('addOrDeleteAccount');
        // finds user id element
        let userId = document.getElementById('userId');
        // finds user joined on element
        let joinedOn = document.getElementById('joinedOn');
        // If there is an account fill in the details to page and set add/ delete account to reflect the status
        if (this.haveAccount) {
            userId.innerHTML = app.userAccount.name;
            joinedOn.innerHTML = app.userAccount.joined;
            addOrDelete.innerHTML = "Delete Account";
            document.querySelector('.addAccount').classList.add('hide');
            document.querySelector('.accountDetails').classList.remove('hide');
            document.querySelector('#account').innerHTML = app.userAccount.icon;
        } else {
            document.querySelector('.accountDetails').classList.add('hide');
            document.querySelector('.addAccount').classList.remove('hide');
            document.querySelector('#account').innerHTML = "<i class=\"fa fa-user-secret\" aria-hidden=\"true\"></i>";
            addOrDelete.innerHTML = "Add Account";
        }
    },
    //add Account
    addAccount: function () {
        // find user name input in DOM
        let inputUserName = document.getElementById('username');
        // Checks for user name input and then sets up account - should I add a message that you need a user name?
        if (account.checkUserNameInput(inputUserName)) {
            let dateJoined = new Date(),
                yearJoined = dateJoined.getFullYear(),
                monthJoined = dateJoined.getMonth() + 1,
                dayJoined = dateJoined.getDate();
            dateJoined = dayJoined + "/" + monthJoined + "/" + yearJoined;
            //sets app user account info
            app.userAccount = {
                name: inputUserName.value.toString(),
                joined: dateJoined,
                score: 0,
                totalTime: 0,
                lastSession: 0,
                icon: "<i class=\"fa fa-user-o\" aria-hidden=\"true\"></i>"     
            } 
            account.haveAccount = true;
            // runs function to update that there is now an account
            account.checkAccount();
            // reset input to blank (although it is hidden)
            inputUserName.value = "";
            // reset the border also (although it is hidden)
            inputUserName.style.border = "solid #ccc 0.1em";
            
            // add user account to local storage
            let objectStore = db.transaction(["UserAccount"], "readwrite").objectStore("UserAccount");
            let request = objectStore.add(app.userAccount);
            request.onerror = function (event) {
                // Handle errors!
                console.log(event.target);
            };
            request.onsuccess = function (event) {
                 console.log("account added");
        
            };
        } else {
            // red border to indicate error and message for restrictions for user name
            inputUserName.style.border = "solid red 0.1em";
            console.log("username must be between 4 and 20 characters, it can only contain letters or numbers")
        }
    },
    // Delete Account 
    deleteAccount: function () {
        // *********** NEEDS FINISHING ********* prompt a confirmation!
        // First finds the selected list then adds new word to it and sends it back as updated
        let objectStore = db.transaction(["UserAccount"], "readwrite").objectStore("UserAccount");
        //removes user account from DB
        let request = objectStore.delete(app.userAccount.name);
        request.onerror = function (event) {
            // Handle errors!
            console.log(event.target);
        };
        request.onsuccess = function (event) {
            //sets in app user account to blank account
            app.userAccount = {
                name: "",
                joined: "",
                score: 0,
                totalTime: 0,
                lastSession: 0,
                icon: ""
            }
            // resets score in nav
            app.actualScore.innerHTML = 0;
            // resets all account info
            account.haveAccount = false;
            account.checkAccount();
        }
    },
    // update account from local DB
    updateAccount: function(){
        console.log(db);
        if(db){
            let transaction = db.transaction(["UserAccount"]);
            let objectStore = transaction.objectStore("UserAccount");
            // gets all items in useraccount object store (don't forget first one is blank account to need to index from 1)
            let localAccount = objectStore.getAll();
            localAccount.onerror = function(event) {
              alert("Error " + event);
            };

            localAccount.onsuccess = function(event) {
            // Checks for local account and sets local Account for the app and the icon for the account
            if (localAccount.result[1]) {
                account.haveAccount = true;
                app.userAccount = localAccount.result[1];
                document.querySelector('#account').innerHTML = app.userAccount.icon;
                // set the user score, or defualt zero if no acocunt
                app.actualScore.innerHTML = app.userAccount.score;
                if(vocabTrainer.instruct){
                    vocabTrainer.instruct.querySelector('#actualScore').innerHTML = app.userAccount.score;
                }   
            } else {
                document.querySelector('#account').innerHTML = "<i class=\"fa fa-user-secret\" aria-hidden=\"true\"></i>";
                // set the user score, or defualt zero if no acocunt
                app.actualScore.innerHTML = 0;
            }

        };    
        } else {
            setTimeout(function() {
                account.updateAccount();
            }, 1000);
        }

    }
}


/*****************************
        Timer functions 
/******************************/
let timer = {
    //time is then the running time of the timer
    time: 0,
    //timerSet is initialzed as the html element to display timer
    timerSet: "",
    getStarted: 0,
    // counter for current session time, pushed to userAccount and cleared after each session 
    sessionTime: 0,
    // Interval for displaying timer
    myInterval: 0,
    // boolean for if timer started
    started: false,
    //add predifined amounts to timer +=
    addTime: function (minutes) {
        this.time += parseInt(minutes);
        timer.displayTime(timer.convertTime(timer.time));
    },
    // zero out timer and stop it
    reset: function () {
        timer.time = 0;
        timer.timerSet.innerHTML = "00:00:00";
        clearInterval(timer.myInterval);
        timer.started = false;
        timer.sessionTime = 0;
    },
    // pause timer
    pause: function () {
        //if started then the interval is cleared and timer.started set to false.
        if (this.started === true) {
            clearInterval(timer.myInterval);
            timer.started = false;
        }
    },
    // start timer and go to vocab trainer page to choose list.
    // should start timer actually once list chosen and not before.
    start: function () {
        // checks first if timer is set above zero, prompts user to add a time if it is not.
        if (timer.time > 0) {
            //then checks if timer has already been started, if it has this button has not function.
            if (timer.started === false) {
                //sets sessionTime to record it for the stats page
                let sessionTime = this.time;
                //sets timer interval to count down time and also display it.
                timer.myInterval = setInterval(function () {
                    timer.sessionTime += 1;
                    timer.time -= 1;
                    timer.displayTime(timer.convertTime(timer.time));
                    //once timer.time is below one the interval is cleared (timer is finished) the timerDone function is called.
                    if (timer.time < 1) {
                        clearInterval(timer.myInterval);
                        timer.timerDone();
                    }
                }, 1000);
            }
            //set timer.started to true for other functions
            timer.started = true;
        } 
        else {
            // popup prompting user to add a time
            popUps.popUp(5);
        }
    },
    // pad function adds 0 if only one number given so time has format 00:00:00
    pad: function (b, width) {
        b = b + '';
        return b.length >= width ? b : new Array(width - b.length + 1)
            .join('0') + b;
    },
    //convert function formats time to 00:00:00
    convertTime: function (time) {
        let hh = Math.floor(time / 3600);
        let mm = Math.floor((time % 3600) / 60);
        let ss = time % 60;
        let convertedTime = timer.pad(hh, 2) + ":" + timer.pad(mm, 2) + ":" + timer.pad(ss, 2);
        return convertedTime;
    },
    displayTime: function (convertedTime) {
        // the below spans all contain one number from each the converted time to display
        let hourTens = document.getElementById('hourTens');
        let hourOnes = document.getElementById('hourOnes');
        let minuteTens = document.getElementById('minuteTens');
        let minuteOnes = document.getElementById('minuteOnes');
        let secondsTens = document.getElementById('secondsTens');
        let secondsOnes = document.getElementById('secondsOnes');

        hourTens.innerHTML = convertedTime[0];
        hourOnes.innerHTML = convertedTime[1];
        minuteTens.innerHTML = convertedTime[3];
        minuteOnes.innerHTML = convertedTime[4];
        
        if(secondsTens && secondsOnes){
            secondsTens.innerHTML = convertedTime[6];
            secondsOnes.innerHTML = convertedTime[7];
        }
    },
    // once timer complete, go to stat page, pop to indicate finished.
    timerDone: function () {
        console.log("finished");
        let finish = new Promise(function (resolve, reject) {
            resolve(vocabTrainer.endTrainer());
        });
        // navigation away from page only once vocabTrainer.endTrainer() has run
        finish.then(function (value) {
            navi.changeContent("stats");
        })

        //make pop up with option to cont learning or go to stats
        popUps.popUp(7);
        timer.started = false;
        // send over last session time to account ************NEEDS FINISHING *********** should call to update account so this is also saved in the local storage
        userAccount.lastSession = this.sessionTime;
        userAccount.totalTime += this.sessionTime;
        // resets session time
        this.sessionTime = 0;
    }
};


/*****************************
        popUps functions
/******************************/
let popUps = {
    //get popUp element from DOM (its a div within index HTML)
    popUpElement: document.querySelector('#popUp p'),
    //find the span containing the X to close the popUp
    close: document.querySelector('#popUp span.close'),
    // Object containing texts for all popups also additional info
    popUpTexts: [
        //Trainer Info
        {
            title: "trainerInfo",
            text: "Info text - how to play!",
            top: "8%",
            left: "7%",
            borderColor: "rgba(0, 0, 0, 0.6)"
         },
        //Case Sensitive Hint
        {
            title: "caseSensitive",
            text: "Good work but this test is case sensitive!",
            top: "8%",
            left: "7%",
            borderColor: "rgba(0, 0, 0, 0.6)"
          },
        // Article Hint
        {
            title: "article",
            text: "Almost there, you must have the correct Article!",
            top: "8%",
            left: "7%",
            borderColor: "rgba(0, 0, 0, 0.6)"
          },
        // Account
        {
            title: "account",
            text: "Account Added!",
            top: "8%",
            left: "7%",
            borderColor: "rgba(0, 0, 0, 0.6)"
          },
        // Delete Account
        {
            title: "deleteAccount",
            text: "pages/popups/addAccount.html",
            top: "8%",
            left: "7%",
            borderColor: "rgba(0, 0, 0, 0.6)"
          },
        //Assign Time
        {
            title: "assignTime",
            text: "You need to add a time first!",
            top: "8%",
            left: "7%",
            borderColor: "rgba(0, 0, 0, 0.6)"
          },
        //Start
        {
            title: "start",
            text: "Ready......Steady......Go!",
            top: "8%",
            left: "7%",
            borderColor: "rgba(0, 0, 0, 0.6)"
          },
        //Timer End
        {
            title: "timerEnd",
            text: "You're done!",
            top: "8%",
            left: "7%",
            borderColor: "rgba(0, 0, 0, 0.6)"
          }
        ],
    //Display PopUp and set content and position
    popUp: function (textNumber) {
        //finds selected popup in above array through inputed number
        let selectedPopUp = this.popUpTexts[textNumber];
        //sets text of popup from popup Object in above array
        this.popUpElement.innerHTML = selectedPopUp['text'];
        //removes 'hide' class so the popup is displayed
        this.popUpElement.parentElement.classList.remove('hide');
        //adds click event to the close span 'X'
        this.close.addEventListener('click', popUps.popUpHide);
        //if the popup is not the game info it will automatically close, the user must close the game info themselves
        if (textNumber != 0) {
            //time out delay before popup is hidden
            setTimeout(function () {
                popUps.popUpHide();
            }, 1500);
        }
    },
    //Hide PopUp
    popUpHide: function () {
        //first fades out the pop up 
        popUps.popUpElement.parentElement.classList.add('popUpFadeOut');
        //then removes the popup by adding 'hide class' (display none), also removes fade out class
        setTimeout(function () {
            popUps.popUpElement.parentElement.classList.add('hide');
            popUps.popUpElement.parentElement.classList.remove('popUpFadeOut')
        }, 1000);
    }
};


/*****************************
        Event Listeners 
/******************************/

// To use back and forwards buttons in Browser 

window.onpopstate = function (e) {
    if (e.state) {
        content.innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};

// navigation to home page event listener
app.homeBtn.addEventListener('click', function () {
    navi.changeContent("home");
});

// navigation to account page event listener
app.accountBtn.addEventListener('click', function () {
    navi.changeContent("account");
});

// load events and App initizialisation
window.addEventListener('load', function () {
    // Go to home page
    navi.changeContent("home");
    // Stop Loader Spinning
    app.spinner.setAttribute('hidden', true);
    // Check for account and update the details from local storage
    setTimeout(function(){
        account.updateAccount();
    },1200);
});


//})();
