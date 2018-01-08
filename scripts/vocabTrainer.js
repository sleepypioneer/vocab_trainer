
    /*************** Global Variables ***************/
    wordToGuess = document.getElementById('wordToGuess');
    currentIndex = Math.floor(Math.random() * 3);
    answer = document.querySelector('.answer');


    /************* Functions **************/
    function startTrainer() {
        wordToGuess.innerHTML = vocab[currentIndex].wordInEnglish;
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
        window.addEventListener("keydown", function(e) {
            if ([13].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        //answer converted to string to avoid non string inputs
        let answerToCheck = answer.value.toString();
        let correctAnswer = vocab[currentIndex].gender + " " + vocab[currentIndex].wordInGerman;
        let correctExpression = new RegExp(removeArticles(correctAnswer), 'gi');
        //check if matches word exactly
        if (correctAnswer === answerToCheck) {
            answer.style.borderColor = "green";
            plusPoint();
            popUpHide();
            setTimeout(function() {
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
        answer.value = vocab[currentIndex].wordInGerman.slice(0, 3);
        hintTaken = true;
    }

    function changeWord(direction) {
        if (direction == 1 && currentIndex === vocab.length - 1) {
            currentIndex = 0;
        } else if (direction == 1) {
            currentIndex++;
        } else if (direction == -1 && currentIndex === 0) {
            currentIndex = vocab.length - 1;
        } else {
            currentIndex--;
        }
        wordToGuess.innerHTML = vocab[currentIndex].wordInEnglish;
        answer.value = "";
        checkAnswer();
    }

    /************* Event Listeners **************/
    answer.addEventListener('change', checkAnswer);
    answer.addEventListener('keyup', checkAnswer); //runs whenever a key is released

    document.getElementById('hint')
        .addEventListener('click', takeHint);
    document.getElementById('info')
        .addEventListener('click', function() {
            popUp(0);
        });

    document.addEventListener('load', startTrainer(wordToGuess, answer));
    document.getElementById('next')
        .addEventListener('click', function() {
            changeWord(1);
        });
    document.getElementById('back')
        .addEventListener('click', function() {
            changeWord(-1);
        });