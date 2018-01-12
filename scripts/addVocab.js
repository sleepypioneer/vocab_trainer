//code for add Vocab page
(function () {
    'use strict';
    /*************** Global Variables ***************/
    let wordInEnglish = document.getElementById('english');
    let wordInGerman = document.getElementById('german');
    let gender = document.whichGender.gender;
    let newWord;

    /*************** Functions ***************/
    function addWord() {
        vocabMine.push(newWord);
        // change to div popup
        alert(newWord.wordInEnglish + " was added to your Vocab List.");
        clearForm();
    }

    function clearForm() {
        document.getElementById('english')
            .value = "";
        document.getElementById('german')
            .value = "";
        document.whichGender.gender.forEach(gender => {
            if (gender.checked) {
                gender.checked = false;
            }
        });
        wordInGerman.style.borderColor = "rgba(255, 119, 35, 0.74)";
        wordInEnglish.style.borderColor = "rgba(255, 119, 35, 0.74)";
    }

    function getGender() {
        for (let i = 0; i < gender.length; i += 1) {
            if (gender[i].checked) {
                return gender[i].dataset.gender;
            }
        }
    }

    // check answer fits format, alert if not
    function checkInput() {
        let englishWord = wordInEnglish.value.toString()
            .trim();
        let germanWord = wordInGerman.value.toString()
            .trim();
        let forbiddenChars = /^[A-Za-z]+$/;
        newWord = {
            "wordInEnglish": englishWord,
            "wordInGerman": germanWord,
            "gender": getGender()
        };
        if (englishWord.split(" ")
            .length === 1 && germanWord.split(" ")
            .length === 1 && forbiddenChars.test(englishWord) && forbiddenChars.test(germanWord) && newWord.gender != undefined) {
            let englishWordList = [];
            let germanWordList = [];
            vocab.forEach(word => {
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
            }
            addWord();
        } else {
            console.log("that is not a valid input!");
            if (newWord.gender == undefined) {
                console.log("Tip: you need to select the gender of the word in German.");

            }
            if (!forbiddenChars.test(englishWord)) {
                wordInEnglish.style.borderColor = "red";
            } else if (forbiddenChars.test(englishWord)) {
                wordInEnglish.style.borderColor = "green";
            } else {
                wordInEnglish.style.borderColor = "rgba(255, 119, 35, 0.74)";
            }
            if (!forbiddenChars.test(germanWord)) {
                wordInGerman.style.borderColor = "red";
            } else if (forbiddenChars.test(germanWord)) {
                wordInGerman.style.borderColor = "green";
            } else {
                wordInGerman.style.borderColor = "rgba(255, 119, 35, 0.74)";
            }
        }
    }

    /*************** Event Listener ***************/
    document.getElementById('addWord')
        .addEventListener('click', checkInput);
    document.getElementById('clearForm')
        .addEventListener('click', clearForm);

})();
