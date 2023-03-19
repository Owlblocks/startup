class GIF {
    user;
    src;
    id
    constructor(user, src) {
        this.user = user;
        this.src = src;
        this.id = `${user.name}:${src}`;
    }
}

class User {
    name;
    gifs;
    constructor(name) {
        this.name = name;
        this.gifs = new Map();
    }
    addGIF(src) {
        let gif = new GIF(this, src);
        this.gifs.set(src, gif)
    }
    
}

class Data {
    gifs;
    favorites;
    users;

    constructor() {
        this.gifs = new Map();
        this.favorites = new Set();
        this.users = new Map();
        this.loadData();
        if(this.gifs.size < 1) {
            this.sampleGifs();
        }
    }

    getGIFFromID(id) {
        id = id.split(':');
        return this.users.get(id[0]).gifs.get(id[1]);
    }

    loadData() {
        let favorites = JSON.parse(localStorage.getItem('favorites'));
        if(favorites) {
            this.favorites = new Set(favorites);
        }
        let users = JSON.parse(localStorage.getItem('users'));
        if(users) {
            this.users = new Map(users);
        }
    }

    addUser(name) {
        let user = new User(name);
        this.users.set(name, user);
    }

    createGifElem(gif) {
        let gifElem = document.createElement('div');
        gifElem.classList.add('gif');
        let btn = document.createElement('button');
        btn.classList.add('favorite');
        btn.onclick = function() {data.toggleFavorite(gifElem)};
        let btnImg = document.createElement('img');
        btnImg.src = this.favorites.has(gif.id) ? 'full_star.png' : 'empty_star.png';
        btn.appendChild(btnImg);
        gifElem.appendChild(btn);
        let gifImg = document.createElement('img');
        gifImg.src = gif.src;
        gifImg.style = 'height:300px';
        gifElem.appendChild(gifImg);

        this.gifs.set(gifElem, gif);
        return gifElem;
    }

    sampleGifs() {
        this.addUser('Tom');
        this.addUser('Dick');
        this.addUser('Sally');
        this.users.get('Tom').addGIF('sample/fizzidyuk.gif');
        this.users.get('Tom').addGIF('sample/jeepers.gif');
        localStorage.setItem('users', JSON.stringify([...this.users]));
    }

    getGIFFromElem(elem) {
        return this.gifs.get(elem);
    }

    getFavoriteButtonImage(elem) {
        elem = elem.querySelector('button');
        elem = elem.querySelector('img');
        return elem;
    }

    toggleFavorite(elem) {
        let gif = this.getGIFFromElem(elem).id;
        let img = this.getFavoriteButtonImage(elem);
        if(this.favorites.has(gif)) {
            this.favorites.delete(gif);
            img.src = 'empty_star.png';
        }
        else {
            this.favorites.add(gif);
            img.src = 'full_star.png';
        }

        localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
    }
}

const data = new Data();
let favorites = document.getElementsByName('favorites')[0];
if(favorites) {
    for(const id of data.favorites) {
        favorites.appendChild(data.createGifElem(data.getGIFFromID(id)));
    }
}
let userGifs = document.getElementsByName('userpage')[0];
if(userGifs) {
    for(const gif of data.users.get('Tom').gifs.values()) {
        userGifs.appendChild(data.createGifElem(gif));
    }
}