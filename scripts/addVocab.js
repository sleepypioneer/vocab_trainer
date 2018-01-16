//code for add Vocab page
(function () {
    'use strict';
    /*************** Global Variables ***************/
    const wordInEnglish = document.getElementById('english');
    const wordInGerman = document.getElementById('german');
    const gender = document.whichGender.gender;
    const listOptions = document.getElementById('listOptions');
    let localVocab;
    let newWord;

    /*************** Functions ***************/
    function populateWordLists() {
        listOptions.innerHTML = "";
        if (vocabMine != null) {
            localVocab = vocabMine;
            let keysVocabLists = Object.keys(localVocab);
            let i = 0;
            while (i < keysVocabLists.length) {
                listOptions.innerHTML += "<option value= \"" + keysVocabLists[i] + "\">" + keysVocabLists[i] + "</option>";
                i++;
            }
        } else {
            localVocab = {};
        }
        listOptions.innerHTML += "<option value= \"createNew\"> Create New Category </option>";
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

    function checkIfDoubled() {
        console.log("checking for dupliate...");
        return true;
        /*
        let englishWordList = [];
        let germanWordList = [];
        vocabMine[listOptions.value].forEach(word => {
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
    }



    // check answer fits format, alert if not
    function checkInput() {
        let englishWord = wordInEnglish.value.toString()
            .trim();
        let germanWord = wordInGerman.value.toString()
            .trim();
        let forbiddenChars = /^[A-Za-z]+$/;
        newWord = {
            "id": "null",
            "wordInEnglish": englishWord,
            "wordInGerman": germanWord,
            "gender": getGender()
        };
        if (englishWord.split(" ")
            .length === 1 && germanWord.split(" ")
            .length === 1 && forbiddenChars.test(englishWord) && forbiddenChars.test(germanWord) && newWord.gender != undefined) {
            if (checkIfDoubled()) {
                return true;
            }
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

    function addWord() {
        if (checkInput()) {
            if (listOptions.value) {
                if (listOptions.value == "createNew") {
                    // change to div popup
                    let newList = prompt("name you new list", "New Category Name");
                    listOptions.value = newList;
                    Object.keys(vocabMine).forEach(key => {
                        if (newList == key){
                            // change to div popup
                            confirm("You will be overwriting an existing list");
                        }
                    });

                    vocabMine[newList] = [];
                    vocabMine[newList].push(newWord);
                } else {
                    vocabMine[listOptions.value].push(newWord);
                }
            }
            // change to div popup
            alert(newWord.wordInEnglish + " was added to your " + listOptions.value + " List.");
            clearForm();
            populateWordLists();
        }

    }


    /*************** Event Listener ***************/
    document.getElementById('addWord')
        .addEventListener('click', addWord);
    document.getElementById('clearForm')
        .addEventListener('click', clearForm);

    /*************** Function calls ***************/
    populateWordLists();

})();
