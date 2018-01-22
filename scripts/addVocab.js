//code for add Vocab page
(function () {
    'use strict';


    /*************** Event Listener ***************/
    
    document.getElementById('addWord')
        .addEventListener('click', addVocab.addWord);
    document.getElementById('clearForm')
        .addEventListener('click', addVocab.clearForm);

    /*************** Function calls ***************/
    addVocab.setProperties();
    addVocab.populateWordLists();

})();



