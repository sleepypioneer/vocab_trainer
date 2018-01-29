//(function() {
'use strict';
/***********************************
        Emulating local Content 
************************************/
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

/***********************
        App Object 
************************/
let app = {
    /*************** Global Variables for App ***************/
    body: document.querySelector("body"),
    nav: document.querySelector("nav"),
    homeBtn: document.getElementById('home'),
    accountBtn: document.getElementById('account'),
    actualScore: document.getElementById('actualScore'),
    userAccount: {},
    newScore: "",
    soundOn: true,
    hintTaken: false,
    isLoading: true,
    localVocab: [],
    spinner: document.querySelector('.loader')
};

/***************************
        Service Worker 
****************************/

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

/*****************************
 Indexed DB for local storage 
******************************/
if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}

/********************************************
 Methods to update/refresh the local Storage 
*********************************************/
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

/*****************************
        Utility Functions
******************************/
let utils = {
    body: document.querySelector("body"),
    // add point
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
    // play sound to notify a correct answer (can turn off sounds on account page)
    playPointSound: function () {
        if (app.soundOn) {
            document.querySelector('#pointSound').play();
        }
    },
    // add stylesheet to page - should change to fetch ***** Temporary *****
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
    // change styling when keyboard up - currently redundant need to check ****** NEEDS CHECKING ******* 
    keyboardUp: function () {
        if (document.documentElement.clientHeight < 350 && document.documentElement.clientWidth < 800) {
            console.log("keyboardUp");
            //app.nav.classList.add("keyboardUp");
            //document.querySelector('#Instruct div h3').setAttribute('style', 'display: none;')
        }
    }
};


/*****************************
        Timer functions 
******************************/
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
        this.timerSet.innerHTML = this.convertTime(this.time);
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
        if (this.started === true) {
            clearInterval(timer.myInterval);
            timer.started = false;
        }
    },
    // start timer and go to vocab trainer page to choose list.
    // should start timer actually once list chosen and not before.
    start: function () {
        if (timer.time > 0) {
            if (timer.started === false) {
                let sessionTime = this.time;
                timer.myInterval = setInterval(function () {
                    timer.sessionTime += 1;
                    timer.time -= 1;
                    timer.timerSet.innerHTML = timer.convertTime(timer.time);
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
            timer.started = true;
        } else {
            popUp(5);
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
    // once timer complete, go to stat page, pop to indicate finished.
    timerDone: function () {
        let finish = new Promise(function(resolve, reject){
            resolve(vocabTrainer.endTrainer());
        });
        // navigation away from page only once vocabTrainer.endTrainer() has run
        finish.then(function(value){
            navi.changeContent("stats");
        })
        
        //make pop up with option to cont learning or go to stats
        popUps.popUp(7);
        timer.started = false;
        userAccount.lastSession = this.sessionTime;
        userAccount.totalTime += this.sessionTime;
        this.sessionTime = 0;
    }
};


/*****************************
        popUps functions
******************************/
let popUps = {
    // Object containing texts for all popups also additional info
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
     //set CSS style
    setCSS: function (e, style) {
        for (let prop in style) {
            e.style[prop] = style[prop];
        }
    },
    //add Popup to body element
    // Stop multiply instances of same popup
    popUp: function (textNumber) {
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
            app.body.appendChild(popUpBox);
            if (popUpName != "trainerInfo") {
                setTimeout(popUps.popUpHide, 2000);
            }
        }
    },
    // deletes the first instance with class popup and not the one clicked on need to change this.
    //instigated after a timeout or on click
    popUpHide: function () {
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


/*****************************
        addVocab functions 
******************************/
let addVocab = {
    //imported vocab from DB
    ImportedVocab: "",
    // local vocab saved in IndexDB
    localVocabList: "",
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
        this.listOptions.innerHTML = "";
        if (this.localVocabList != null) {
            this.localVocabList = app.localVocab;
            let i = 0;
            while (i < this.localVocabList.length) {
                addVocab.listOptions.innerHTML += "<option value= \"" + Object.keys(addVocab.localVocabList[i])[0] + "\">" + Object.keys(addVocab.localVocabList[i])[0] + "</option>";
                i++;
            }
        } else {
            addVocab.localVocabList = {};
        }
        this.listOptions.innerHTML += "<option value= \"createNew\"> Create New Category </option>";
        if (selected) {
            this.listOptions.querySelector('option[value=\"' + selected + '\"]').selected = true;
        }
    },
    //resets form for adding a new word - currently not used ******* NEEDS CHECKING ********
    clearForm: function () {
        this.wordInEnglish.value = "";
        this.wordInGerman.value = "";
        this.gender[0].checked = true;
        this.wordInGerman.style.borderColor = "rgba(255, 119, 35, 0.74)";
        this.wordInEnglish.style.borderColor = "rgba(255, 119, 35, 0.74)";
    },
    // mini function to grab inputted gender for new word
    getGender: function () {
        for (let i = 0; i < addVocab.gender.length; i += 1) {
            if (addVocab.gender[i].checked) {
                return addVocab.gender[i].dataset.gender;
            }
        }
    },
    // checks for duplicates and also contains logic for checking input is correct - ****** NEEDS CHECKING *******
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
     // check answer fits format, alert if not
    checkInput: function () {
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
    // adds new word to selected list or creates new list if that has been selected
    addWord: function () {
        if (addVocab.checkInput()) {
            if (addVocab.listOptions.value) {
                if (addVocab.listOptions.value == "createNew") {
                    // change to div popup
                    let newList = prompt("name you new list", "New Category Name");
                    addVocab.listOptions.value = newList;
                    for (let k = 0; k < app.localVocab.length; k++) {
                        if (app.localVocab[k][0] === newList) {
                            // change to div popup
                            confirm("You will be overwriting an existing list");
                        }

                    }
                    let insertList = {}
                    insertList[newList] = [addVocab.newWord];
                    app.localVocab.unshift(insertList);
                    // change to div popup
                    alert(addVocab.newWord.wordInEnglish + " was added to your " + newList + " List.");
                    addVocab.clearForm();
                    addVocab.populateWordLists(newList);

                } else {
                    for (let t = 0; t < app.localVocab.length; t++) {
                        if (app.localVocab[t][0] === addVocab.listOptions.value) {
                            app.localVocab[t][addVocab.listOptions.value].push(addVocab.newWord);
                        }
                    }
                    // change to div popup
                    alert(addVocab.newWord.wordInEnglish + " was added to your " + addVocab.listOptions.value + " List.");

                    addVocab.clearForm();
                    addVocab.populateWordLists(addVocab.listOptions.value);
                }
            }
        }

    }
};


/************************************
        Page navigation functions
*************************************/
let navi = {
    // Object containing information for all pages incl. name/url/pageTitle and scripts upon page loading
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
                // have timer counting down in display if one is running
                timer.timerSet = document.getElementById("timerSet");
                timer.timerSet.innerHTML = timer.convertTime(timer.time);
                document.getElementById('reset').addEventListener('click', timer.reset);
                document.getElementById('pause').addEventListener('click', timer.pause);
                document.getElementById('play').addEventListener('click', timer.start);
                document.querySelectorAll('.length').forEach(length => {
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
                document.querySelector('#addWord')
                    .addEventListener('click', addVocab.addWord);
                //document.getElementById('clearForm').addEventListener('click', addVocab.clearForm);

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
                // Add is Total Points to Score Board
                document.getElementById('totalPoints').innerHTML = userAccount.score;
                // Add is Total Time to Score Board
                document.getElementById('totalTime').innerHTML = timer.convertTime(userAccount.totalTime);
                // Add is Last Session Time to Score Board
                document.getElementById('lastSession').innerHTML = timer.convertTime(userAccount.lastSession);
                // Add is Word Lists and their length to table
                let wordLists = document.getElementById('wordLists');
                for (let r = 0; r < app.localVocab.length; r++){
                   wordLists.innerHTML += "<tr><td>" + Object.keys(app.localVocab[r])[0] + " </td><td class=\"stat\">(" + Object.values(app.localVocab[r])[0].length + " words)</td></tr>";
                }
            }
        },
        {
            name: "account",
            url: "pages/account.html",
            pageTitle: "account",
            urlPath: "/account",
            script: function () {
                /*********************
                 Add or Delete Account 
                **********************/
                let addOrDelete = document.getElementById('addOrDeleteAccount');
                if(account.haveAccount){
                    addOrDelete.innerHTML = "Delete Account";
                } else {
                    addOrDelete.innerHTML = "Add Account";
                }
                
                addOrDelete.addEventListener('click', function () {
                    if (account.haveAccount) {
                        account.deleteAccount();
                    } else {
                        account.addAccount();
                    }
                });

                /*********************
                     Day/Night Mode 
                **********************/
                let NightMode = false;
                let checkbox = document.querySelector('#dayNightSwitch');

                checkbox.addEventListener('change', function () {
                    if (!NightMode) {
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
                    console.log('click');
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
        {
            name: "addAccount",
            url: "pages/addAccount.html",
            pageTitle: "addAccount",
            urlPath: "/addAccount",
            script: function () {
                document.querySelector('#addAccount').addEventListener('click', account.addAccount)
            }
        },
        {
            name: "manageVocab",
            url: "pages/manageLocalVocab.html",
            pageTitle: "manageVocab",
            urlPath: "/manageVocab",
            script: function () {
                
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


/*****************************
        account functions 
******************************/
let account = {
    // Boolean for if account is present
    haveAccount: false,
    // size for % of text to go in input (connected to reduceFontSizeOnInput)
    size: 150,
    // text.length for % of text to go in input (connected to reduceFontSizeOnInput)
    textLength: 0,
    // reduce font size as user inputs - need to seperate out into a utility function and only keep length logic here
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
                    if (account.size > 45) {
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
    // check if an account exists and set properties in either case
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
    //add Accont
    addAccount: function () {
        console.log("account added");
        let inputUserName = document.getElementById('username');
        // should I add a message that you need a user name?
        if (inputUserName.innerText != "") {
            let dateJoined = new Date(),
                yearJoined = dateJoined.getFullYear(),
                monthJoined = dateJoined.getMonth() + 1,
                dayJoined = dateJoined.getDate();
            dateJoined = dayJoined + "/" + monthJoined + "/" + yearJoined;
            app.userAccount.name = inputUserName.innerText.toString();
            app.userAccount.joined = dateJoined;
            account.haveAccount = true;
        }
        navi.changeContent("account");
    },
    // Delete Account 
    deleteAccount: function () {
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


/*****************************
        Vocab Trainer functions */
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
    currentIndex: Math.floor(Math.random() * 3),
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
        this.allVocab = function () {
            if (ImportedVocab != null && app.localVocab != null) {
                return [...app.localVocab, ...ImportedVocab];
            } else if (ImportedVocab != null) {
                return [...ImportedVocab];
            } else if (app.localVocab != null) {
                return [...app.localVocab];
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
    //starts trainer with selected Vocab List (goes into play mode)
    startTrainer: function () { 
        this.currentIndex = Math.floor(Math.random() * this.vocabToTrain.length)
        this.wordToGuess.innerHTML = this.vocabToTrain[this.currentIndex].wordInEnglish;
                
        if(timer.time > 0){
            vocabTrainer.trainerInterval = setInterval( function(){
                document.getElementById('vocabTimer').innerHTML = timer.convertTime(timer.time);
            }, 1000);
        } else {
            document.querySelector('.fa-pause-circle-o').setAttribute('class', 'hide');
            document.querySelector('.innerTimer').setAttribute('class', 'hide');
        }

        this.answer.addEventListener("click", function (e) {
            if (document.activeElement == document.getElementById('answer')) {
                console.log("focused");
                utils.keyboardUp();

            }
        });
        document.getElementById('timerControl').addEventListener('click', function(){
            if(timer.time > 0){
                timer.pause();
                document.querySelector('.fa-pause-circle-o').classList.add('hide');
                document.querySelector('.fa-play-circle-o').classList.remove('hide');
            } else {
                timer.start();
                document.querySelector('.fa-play-circle-o').classList.add('hide');
                document.querySelector('.fa-pause-circle-o').classList.remove('hide');
            }
        });
        
        document.querySelector('.exit').addEventListener('click', this.endTrainer);
    },
    //end trainer return nav bar, clear interval
    endTrainer: function () {
        app.nav.removeAttribute('class', 'hide');
        clearInterval(vocabTrainer.trainerInterval);
        vocabTrainer.instruct.classList.add('hide');
        vocabTrainer.chooseList.removeAttribute('class', 'hide');
        vocabTrainer.chooseList.removeAttribute('class', 'hide');
        app.nav.removeAttribute('class', 'hide');
    },
    // utility function to remove articles from words to check if correct word has been given without article
    removeArticles: function (str) {
        let words = str.split(" ");
        if (words.length <= 1) return (str);
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
        let correctAnswer = vocabTrainer.vocabToTrain[vocabTrainer.currentIndex].gender + " " + vocabTrainer.vocabToTrain[vocabTrainer.currentIndex].wordInGerman;
        let correctExpression = new RegExp(vocabTrainer.removeArticles(correctAnswer), 'gi');
        //check if matches word exactly
        if (correctAnswer === answerToCheck) {
            vocabTrainer.answer.style.borderColor = "green";
            utils.plusPoint();
            utils.playPointSound();
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
    // offers hint (first three letters of word (without article) not working on firefox!!!!!
    takeHint: function () {
        vocabTrainer.answer.value = "";
        vocabTrainer.answer.value = vocabTrainer.vocabToTrain[vocabTrainer.currentIndex].wordInGerman.slice(0, 3);
        app.hintTaken = true;
    },
    //changes word either by skipping or correct completion
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
    //flip animation for when correct answer given or word is skipped
    flipToNext: function () {
        this.vocabCard.classList.toggle('flipped');
    },
    //when user selects their chosen word list this starts the trainer and removes the nav and vocab lists (ie goes into play mode)
    chosenWordList: function (event) {
        vocabTrainer.chooseList.setAttribute('class', 'hide');
        vocabTrainer.chooseList.setAttribute('class', 'hide');
        app.nav.setAttribute('class', 'hide');
        vocabTrainer.instruct.classList.remove('hide');
        vocabTrainer.vocabToTrain = vocabTrainer.allVocab()[this.dataset.vocablist][this.innerHTML];
        vocabTrainer.startTrainer();
    }

}



/*****************************
        Event Listeners 
******************************/

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

// load events
window.addEventListener('load', function () {
    //emulating local storage word List ****** TEMPORARY ******
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
    
    // Go to home page
    navi.changeContent("home");
    
    // set the icon for the account
    if(!account.haveAccount){
       document.querySelector('#account').innerHTML  = "<i class=\"fa fa-user-secret\" aria-hidden=\"true\"></i>"
    } else {
        document.querySelector('#account').innerHTML  = app.userAccount.icon;
    }

});

//})();