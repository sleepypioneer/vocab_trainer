var filesToCache = [
    '.',
    'styleSheets/appStyles.css',
    'styleSheets/nightMode.css',
    'styleSheets/font-awesome-4.7.0/css/font-awesome.min.css',
    'styleSheets/googleFonts.min.css',
    'pages/account.html',
    'pages/addVocab.html',
    'pages/home.html',
    'pages/manageLocalLists.html',
    'pages/stats.html',
    'pages/timedSession.html',
    'php/dataBaseVocabLists.php',
    'php/dbconnection.php',
    'php/downloadList.php',
    'php/getVocabLists.php',
    'pages/vocabTrainer.html',
    'scripts/appScripts.js',
    'connectToDb.php',
    'manifest.json',
    'service-worker.js',
    'index.html'
    /*
    'pages/offline.html',
    'pages/404.html'*/

];

var staticCacheName = 'pages-cache-v1';


self.addEventListener('install', function (event) {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});


self.addEventListener('activate', function (event) {
    console.log('Service worker activating...');
});

self.addEventListener('fetch', function (event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                console.log('Found ', event.request.url, ' in cache');
                return response;
            }
            console.log('Network request for ', event.request.url);
            return fetch(event.request)
                .then(function (response) {

                    // TODO 5 - Respond with custom 404 page

                    return caches.open(staticCacheName).then(function (cache) {
                        if (event.request.url.indexOf('test') < 0) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    });
                });
        }).catch(function (error) {

            // TODO 6 - Respond with custom offline page

        })
    );
});
/*
self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(){});
});


self.addEventListener('sync', function(event) {
    if(event.tag === 'foo'){
        event.waitUntil(doSomething());
    }
});

function doSomething(){
    "installed";
}*/
