const CACHE_NAME = "V1";

this.addEventListener('install', async function(){
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
        '/components/utilities/PWA/home.html',
        '/components/utilities/PWA/main.css',
        '/components/utilities/PWA/main.js',
        '/components/utilities/PWA/history.html',
    ]);
});

self.addEventListener('fetch', event =>{
    const getCustomResponsePromise = async() => {
        console.log('URL' + event.request.url + 'location origin' + location);
        try{
            const cachedResponse = await caches.match(event.request);
            if(cachedResponse){
                return cachedResponse;
            }
            const netResponse = await fetch(event.request);
            let cache = await caches.open(CACHE_NAME);
            cache.put(event.request, netResponse.clone());
            return netResponse;
        }catch(err){
            console.error('Error ' + err);
            throw err;
        }
    }
    event.respondWith(getCustomResponsePromise());
});