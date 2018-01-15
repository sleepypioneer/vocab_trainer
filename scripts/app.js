var app = {
    isLoading: true,
    localVocab: [],
    spinner: document.querySelector('.loader')
};

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
});*/

if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}
/*****************************************************************************
 *
 * Event listeners for UI elements
 *
 ****************************************************************************/


/* Event listener for refresh button 
document.getElementById('butRefresh').addEventListener('click', function () {
    app.updateForecasts();
});*/

/*****************************************************************************
 *
 * Methods to update/refresh the UI
 *
 ****************************************************************************/

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

document.addEventListener('DOMContentLoaded', function () {
    window.localforage.getItem('localVocab', function (err, vocabList) {
        if (vocabList) {
            app.localVocab = vocabList;
            app.localVocab.forEach(function (word) {
                console.log(word.id, word.wordInEnglish);
            });
        } else {
            //app.updateForecastCard(vocab2);
            app.localVocab = [
            	...vocabMine1
        ];
            app.saveSelectedVocab();
        }
    });
});
