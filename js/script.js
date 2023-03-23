/*
https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=10a670436576f33e7947d59f5ccf2778&tags=dogs&format=json&nojsoncallback=1&api_sig=c1e8da9baf0cabe3d67c2db85130d7e0
https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=810ab123a6d7c3bcf616e03b977f67e2&tags=dogs&per_page=24&page=1&format=json&nojsoncallback=1&api_sig=bb5a68de14d581150b6c92139f7e641b
*/
window.onload = function () {
    getFlickrImages(currentPage);
};

let flickrUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=10a670436576f33e7947d59f5ccf2778&format=json&nojsoncallback=1&`;
let tags = 'dog';
let perPage = 24;
let currentPage = 1;

function getFlickrImages(page) {
    fetch(flickrUrl +
        `tags=${tags}&` +
        `per_page=${perPage}&` +
        `page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.photos.photo.forEach(item => {
                const imgContainer = document.createElement('div');
                const img = document.createElement('img');
                img.src = `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`;
                imgContainer.appendChild(img);
                document.getElementById('mainContainer').appendChild(imgContainer);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        currentPage++;
        getFlickrImages(currentPage);
    }
});