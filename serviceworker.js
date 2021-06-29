self.addEventListener('install', () => {
    console.log('installing service worker');
})


self.addEventListener('activate', () => {
    console.log('activating service worker');
})

self.addEventListener('fetch', () => {
    console.log('fetching... ${event.request.url}');
})