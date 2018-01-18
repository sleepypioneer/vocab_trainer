/*************** Global Variables ***************/
const pages = [
        {
            name: "home",
            url: "pages/home.html",
            pageTitle: "home",
            urlPath: "/home",
            script: "scripts/home.js"
		},
        {
            name: "vocabTrainer",
            url: "pages/vocabTrainer.html",
            pageTitle: "vocabTrainer",
            urlPath: "/vocabTrainer",
            script: "scripts/vocabTrainer.js"
		},
        {
            name: "timedSession",
            url: "pages/timedSession.html",
            pageTitle: "timedSession",
            urlPath: "/timedSession",
            script: "scripts/timedSession.js"

		},
        {
            name: "addVocab",
            url: "pages/addVocab.html",
            pageTitle: "addVocab",
            urlPath: "/addVocab",
            script: "scripts/addVocab.js"
		},
        {
            name: "stats",
            url: "pages/stats.html",
            pageTitle: "stats",
            urlPath: "/stats",
            script: "scripts/stats.js"
		},
        {
            name: "account",
            url: "pages/account.html",
            pageTitle: "account",
            urlPath: "/account",
            script: "scripts/account.js"
		}
],
    content = document.querySelector("#content"),
    body = document.querySelector("body"),
    head = document.querySelector("head"),
    banner = document.querySelector('.banner'),
    homeBtn = document.getElementById('home'),
    navBarTimer = document.getElementById("timer"),
    timerset = document.getElementById("timerSet"),
    nav = document.querySelector("nav"),
    accountBtn = document.getElementById('account');

let userAccount = {
        name: "Ada Lovelace",
        joined: "01/12/2017",
        score: "200",
        totalTime: 0,
        lastSession: 0
    },
    newScore,
    wordToGuess,
    currentIndex,
    answer,
    gender,
    hintTaken = false,
    time = 0,
    timer,
    interval,
    runningTimer = document.getElementById('timer'),
    /*** score & stats Variables ***/
    actualScore = document.getElementById('actualScore'),
    addOrDelete = document.getElementById('addOrDeleteAccount'),
    account = false,
    a = 100,
    b,
    ImportedVocab,
    vocabMine,
    started = false;


/*************** Emulating local Content ***************/
let vocabMine1 = [
    {
        id: "null",
        wordInEnglish: "Keyboard",
        wordInGerman: "Tastatur",
        gender: "Das"
    },
    {
        id: "null",
        wordInEnglish: "Monitor",
        wordInGerman: "Bildschirm",
        gender: "Der"
    },
    {
        id: "null",
        wordInEnglish: "Slideshow",
        wordInGerman: "Diashow",
        gender: "Die"
    }
];
let vocabMine2 = [
        {
            id: "null",
            wordInEnglish: "Staff Member (sg/m)",
            wordInGerman: "Mitarbeiter",
            gender: "Der"
        },
        {
            id: "null",
            wordInEnglish: "Staff Member(sg f)",
            wordInGerman: "Mitarbeiterin",
            gender: "Die"
        },
        {
            id: "null",
            wordInEnglish: "Telephone System",
            wordInGerman: "Telefonanlage",
            gender: "Die"
        },
        {
            id: "null",
            wordInEnglish: "Sister Company",
            wordInGerman: "Tochterunternehmen",
            gender: "Das"
        }
],
    vocabMine3 = [
        {
            id: "null",
            wordInEnglish: "Department",
            wordInGerman: "Abteilung",
            gender: "Die"
        },
        {
            id: "null",
            wordInEnglish: "Purchase",
            wordInGerman: "Einkauf",
            gender: "Der"
        },
        {
            id: "null",
            wordInEnglish: "Management",
            wordInGerman: "Geschaeftsleitung",
            gender: "Die"
        }
];
vocabMine = {
    vocabMine1: vocabMine1,
    vocabMine2: vocabMine2,
    vocabMine3: vocabMine3
};



/*************** Utility Functions ***************/
/* set url in browser */
function processAjaxData(response, page) {
    document.title = page.pageTitle;
    window.history.pushState({
        "html": response,
        "pageTitle": page.pageTitle
    }, "", /*page.urlPath*/ ); /* routing not working with paths */
}

/* To use back and forwards buttons in Browser */
window.onpopstate = function (e) {
    if (e.state) {
        content.innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};

/* To set Time format */
function convertTime(time) {
    var hh = Math.floor(time / 3600);
    var mm = Math.floor((time % 3600) / 60);
    var ss = time % 60;
    var convertedTime = pad(hh, 2) + ":" + pad(mm, 2) + ":" + pad(ss, 2);
    return convertedTime;
}

function pad(b, width) {
    b = b + '';
    return b.length >= width ? b : new Array(width - b.length + 1)
        .join('0') + b;
}

/* Add script to site */
function addScript(script, scriptName) {
    let scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.id != "") {
            document.querySelector("body")
                .removeChild(script);
        }
    });
    let newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.id = scriptName;
    newScript.src = script;

    body.appendChild(newScript);
}

/* Add style sheet to site */
function addStyle(styleSheet, styleName) {
    let newStyleSheet = document.createElement("link");
    newStyleSheet.rel = "stylesheet";
    newStyleSheet.type = "text/css";
    newStyleSheet.id = styleName;
    newStyleSheet.href = styleSheet;
    head.appendChild(newStyleSheet);
}


/*************** Functions ***************/
/* Navigation */
function changeContent(a, pages) {
    let pageMatch = (pages.filter(page => page.name === a));
    let page = pageMatch[0];
    let xhr = new XMLHttpRequest();
    fetch(page.url).then(function (response) {
        if (response.ok) {
            response.text().then(function (text) {
                content.innerHTML = text;
            }).then(function () {
                addScript(page.script, page.name);
                if (a === "home") {
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


/* Update Score */
function plusPoint() {
    if (hintTaken) {
        newScore = parseInt(userAccount.score) + 1;
        hintTaken = false;
    } else {
        newScore = parseInt(userAccount.score) + 2;
    }
    actualScore.innerHTML = newScore;
    userAccount.score = newScore.toString();
}

/* Update Timer */
function NavTimer() {
    navBarTimer.innerHTML = "<h3>" + timer + "</h3>";
}

/* run timer */
function startTimer() {
    sessionTime = time;
    interval = setInterval(function () {
        time -= 1;
        timer = convertTime(time);
        if (timerset != null) {
            timerset.innerHTML = timer;
        }
        NavTimer();
        checkIfTimerDone();
    }, 1000);
}

function checkIfTimerDone() {
    if (time == 0) {
        //make pop up with option to cont learning or go to stats
        popUp(7);
        setTimeout(changeContent("stats", pages), 2000);
        started = false;
        userAccount.lastSession = sessionTime;
        userAccount.totalTime += sessionTime;
        reset();
    }
}

function keyboardUp(){
    if(document.documentElement.clientHeight < 350 && document.documentElement.clientWidth < 800){
        console.log("keyboardUp");
        nav.classList.add("keyboardUp");
        document.querySelector('#Instruct div h3').setAttribute('style', 'display: none;')
    }
    
}


/***************  Event Listeners ***************/
homeBtn.addEventListener('click', function () {
    changeContent("home", pages);
});
accountBtn.addEventListener('click', function () {
    changeContent("account", pages);
});

window.addEventListener('load', function () {
    changeContent("home", pages);
    actualScore.innerHTML = userAccount.score;
});
