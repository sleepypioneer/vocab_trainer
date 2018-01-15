(function () {
    'use strict';
    /*************** Global Variables ***************/
    const wordToGuess = document.getElementById('wordToGuess'),
    answer = document.querySelector('.answer'),
    vocabCard = document.querySelector('.card'),
    chooseList = document.getElementById('chooseList'),
    instruct = document.getElementById('Instruct'),
    vocabList = document.getElementById('vocabList');
    let currentIndex = Math.floor(Math.random() * 3),
    vocabToTrain,
    allVocab,
    vocabLists;
    /************* Functions **************/
    
    function chosenWordList(event) {
        console.log(this.dataset.vocablist);
        chooseList.setAttribute('class', 'hide');
        instruct.classList.remove('hide');
        vocabToTrain = allVocab[Object.keys(allVocab)[this.dataset.vocablist]];
        startTrainer();
    }
    
    function populateWordLists(){
        allVocab = Object.assign({}, vocabMine, ImportedVocab);
        let keysAllVocab = Object.keys(allVocab);
        let i = 0;
        while (i < keysAllVocab.length){
            vocabList.innerHTML += "<li data-vocabList = \"" + i + "\">" + keysAllVocab[i] + "</li>";
            i++;
        }

        vocabLists = document.querySelectorAll('#vocabList li');
        vocabLists.forEach(vocabList => vocabList.addEventListener('click', chosenWordList));
    }


    function startTrainer() { //need to make on click through to trainer and list specific
        wordToGuess.innerHTML = vocabToTrain[currentIndex].wordInEnglish;
        document.getElementById('answer').addEventListener("click", function (e) {
            if (document.activeElement == document.getElementById('answer')){
                console.log("focused");
                
            }
        });
    }

    function removeArticles(str) {
        let words = str.split(" ");
        if (words.length <= 1) return (str);
        if (words[0] == "Der" || words[0] == "Die" || words[0] == "Das") {
            return words.splice(1)
                .join(" ");
        }
        return str;
    }

    function checkAnswer() {
        // NOT WORKING - prevent enter key from working during submitting of input(should stop bug when moving on to next work in vocab)
        window.addEventListener("keydown", function (e) {
            if ([13].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        //answer converted to string to avoid non string inputs
        let answerToCheck = answer.value.toString();
        let correctAnswer = vocabToTrain[currentIndex].gender + " " + vocabToTrain[currentIndex].wordInGerman;
        let correctExpression = new RegExp(removeArticles(correctAnswer), 'gi');
        //check if matches word exactly
        if (correctAnswer === answerToCheck) {
            answer.style.borderColor = "green";
            plusPoint();
            popUpHide();
            setTimeout(function () {
                changeWord(1);
            }, 1000);
            //check if matches regardless of case & alert
        } else if (correctAnswer.toLowerCase() === answerToCheck.toLowerCase()) {
            popUp(1);
            //check if matches without article 
        } else if (answerToCheck.match(correctExpression)) {
            popUp(2);
        } else {
            answer.style.borderColor = "rgba(255, 119, 35, 0.74)";
        }
    }

    //not working on firefox!!!!!
    function takeHint() {
        answer.value = "";
        answer.value = vocabToTrain[currentIndex].wordInGerman.slice(0, 3);
        hintTaken = true;
    }

    function changeWord(direction) {
        if (direction == 1 && currentIndex === vocabToTrain.length - 1) {
            currentIndex = 0;
        } else if (direction == 1) {
            currentIndex++;
        } else if (direction == -1 && currentIndex === 0) {
            currentIndex = vocabToTrain.length - 1;
        } else {
            currentIndex--;
        }
        wordToGuess.innerHTML = vocabToTrain[currentIndex].wordInEnglish;
        answer.value = "";
        flipToNext();
        checkAnswer();
    }
    
    function flipToNext(){
        vocabCard.classList.toggle('flipped');
    }

    /************* Event Listeners **************/

    answer.addEventListener('change', checkAnswer);
    answer.addEventListener('keyup', checkAnswer); //runs whenever a key is released

    document.getElementById('hint')
        .addEventListener('click', takeHint);
    document.getElementById('info')
        .addEventListener('click', function () {
            popUp(0);
        });

    //document.addEventListener('load', startTrainer(wordToGuess, answer));
    document.getElementById('next')
        .addEventListener('click', function () {
            changeWord(1);
        });
    document.getElementById('back')
        .addEventListener('click', function () {
            changeWord(-1);
        });
    
     /************* function call **************/
    populateWordLists();
})();
