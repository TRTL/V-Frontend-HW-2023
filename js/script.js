const flickrUrl = `https://www.flickr.com/services/rest/`;
const flickrApiKey = `d39f3cddeca89fe2c08b0fbd56691c5e`;
const perPage = 24;
let currentPage = 1;

const user_getter_bg = document.getElementById('user-getter-bg');
const menu_bar = document.getElementById('menu-bar');
const txt_user_name = document.getElementById('txt-user-name');
const btn_enter = document.getElementById('btn-enter');
const btn_show_hide_menu = document.getElementById('btn-show-hide-menu');
const menu_div = document.getElementById('menu-div');
const btn_flickr = document.getElementById('btn-flickr');
const txt_flickr_tags = document.getElementById('txt-flickr-tags');
const btn_my_favorites = document.getElementById('btn-my-favorites');
const main_container = document.getElementById('main-container');
const btn_exit = document.getElementById('btn-exit');

let user = localStorage.getItem('CURRENT_USER');
window.onload = function () {
    if (!user) {
        user_getter_bg.style.display = 'flex';
        menu_bar.style.display = 'none';
    } else {
        user_getter_bg.style.display = 'none';
        menu_bar.style.display = 'flex';
        getFlickrPhotos();
    };
};

btn_enter.addEventListener('click', () => {
    if (txt_user_name.value) {
        user_getter_bg.style.display = 'none';
        menu_bar.style.display = 'flex';
        localStorage.setItem('CURRENT_USER', txt_user_name.value);
        user = txt_user_name.value;
        getFlickrPhotos();
    }
    else {
        message('Enter your name')
    }
});

const toggleMenu = () => menu_div.style.display = menu_div.style.display === 'none' ? 'flex' : 'none';
btn_show_hide_menu.addEventListener('click', toggleMenu);

btn_flickr.addEventListener('click', () => {
    main_container.innerHTML = '';
    currentPage = 1;
    infinite_scroll = true;
    getFlickrPhotos();
});

btn_my_favorites.addEventListener('click', () => {
    main_container.innerHTML = '';
    infinite_scroll = false;
    showMyFavoritePhotos();
});

btn_exit.addEventListener('click', () => {
    main_container.innerHTML = '';
    localStorage.removeItem('CURRENT_USER');
    menu_bar.style.display = 'none';
    txt_user_name.value = '';
    user_getter_bg.style.display = 'flex';
});

let infinite_scroll = true;
window.addEventListener('scroll', () => {
    if (infinite_scroll) {
        let { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 0) {
            currentPage++;
            getFlickrPhotos();
        }
    }
});

function getFlickrPhotos() {
    const tags = txt_flickr_tags.value;
    const url = `${flickrUrl}?method=flickr.photos.search&api_key=${flickrApiKey}&safe_search=1&format=json&nojsoncallback=1&tags=${tags}&per_page=${perPage}&page=${currentPage}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.photos.photo.forEach(item => {
                let container = createPhotoContainer(item);
                main_container.appendChild(container);
            });
            message(`Page ${data.photos.page} loaded`);
        })
        .catch(error => {
            message(error);
        });
}

function showMyFavoritePhotos() {
    let favoritePhotos = JSON.parse(localStorage.getItem(`${user}`));
    if (favoritePhotos && Array.isArray(favoritePhotos)) {
        for (let item of favoritePhotos) {
            let container = createPhotoContainer(item);
            main_container.appendChild(container);
        }
        message(`${user}'s favorite photos loaded`);
    }
    else {
        message(`${user} does not have any favorite photos yet`);
    }
}

function createPhotoContainer(item) {
    let container = document.createElement('div');
    container.classList.add('photo-container');

    let img = document.createElement('img');
    img.src = `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`;
    container.appendChild(img);

    let info = document.createElement('div');
    info.classList.add('info-container');

    let title = document.createElement('span');
    title.textContent = `${item.title}`;
    title.classList.add('title');
    info.appendChild(title);

    let separator = document.createElement('span');
    separator.classList.add('separator');
    info.appendChild(separator);

    let author = document.createElement('span');
    author.textContent = `${item.owner}`;
    author.classList.add('author');
    info.appendChild(author);

    let button = document.createElement('button');
    button.textContent = isFavorite(item.id) ? 'Unfavorite' : 'Favorite';
    button.classList.add('favorite-button');
    button.setAttribute('onClick', `toggleFavorite(this, '${item.id}', '${item.server}', '${item.secret}', '${item.title.replace(/'/g, "\\'").replace(/"/g, '\\"')}', '${item.owner}')`);
    info.appendChild(button);

    container.appendChild(info);
    return container;
}

function toggleFavorite(button, photoId, server, secret, title, owner) {
    if (isFavorite(photoId)) {
        removeFavorite(photoId);
        button.textContent = 'Favorite';
        message(`Photo (${photoId}) removed form favorites`);
    } else {
        addFavorite(photoId, server, secret, title, owner);
        button.textContent = 'Unfavorite';
        message(`Photo (${photoId}) added to favorites`);
    }
}

function addFavorite(photoId, server, secret, title, owner) {
    let photo = {
        id: photoId,
        server: server,
        secret: secret,
        title: title,
        owner: owner
    };
    saveToLocalStorage(photo);
}

let saveToLocalStorage = (obj) => {
    let user = localStorage.getItem('CURRENT_USER');
    let items = localStorage.getItem(`${user}`);

    if (items) {
        items = JSON.parse(items);
        items.push(obj);
    } else {
        items = [obj];
    }
    localStorage.setItem(user, JSON.stringify(items));
};

function removeFavorite(photoId) {
    let user = localStorage.getItem('CURRENT_USER');
    let items = localStorage.getItem(`${user}`);
    if (items) {
        items = JSON.parse(items);
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === photoId) {
                items.splice(i, 1);
                localStorage.setItem(`${user}`, JSON.stringify(items));
                break;
            }
        }
    }
}

function isFavorite(photoId) {
    let user = localStorage.getItem('CURRENT_USER');
    let items = localStorage.getItem(user);
    if (items) {
        items = JSON.parse(items);
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === photoId) {
                return true;
            }
        }
    }
    return false;
}
