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
    friends;
    pinned;

    username;

    constructor() {
        this.gifs = new Map();
        this.favorites = new Set();
        this.users = new Map();
        this.friends = new Set();
        this.pinned = new Set();
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
        let friends = JSON.parse(localStorage.getItem('friends'));
        if(friends) {
            this.friends = new Set(friends);
        }
        let pinned = JSON.parse(localStorage.getItem('pinned'));
        if(pinned) {
            this.pinned = new Set(pinned);
        }
    }

    addUser(name) {
        let user = new User(name);
        this.users.set(name, user);
    }

    createGifElem(gif, favorite) {
        // console.log(favorite);
        let gifElem = document.createElement('div');
        gifElem.classList.add('gif');
        let btn = document.createElement('button');
        btn.classList.add('favorite');
        btn.onclick = function() {data.toggleFavorite(gifElem)};
        let btnImg = document.createElement('img');
        btnImg.src = favorite ? 'full_star.png' : 'empty_star.png';
        btn.appendChild(btnImg);
        gifElem.appendChild(btn);
        let gifImg = document.createElement('img');
        gifImg.src = `/data/gifs/${gif}`;
        gifImg.style = 'height:300px';
        gifElem.appendChild(gifImg);

        this.gifs.set(gifElem, gif);
        return gifElem;
    }

    createPinnedElem(name) {
        let elem = document.createElement('li');
        elem.classList.add('nav-item');
        let avatar = document.createElement('img');
        avatar.style.height = '30px';
        avatar.src = 'account.png';
        elem.appendChild(avatar);
        let link = document.createElement('a');
        link.classList.add('secondary-link');
        link.href = `user.html?user=${name}`;
        link.textContent = name;
        link.style.paddingLeft = '10px';
        elem.appendChild(link);

        return elem;
    }

    createFriendElem(name) {
        let elem = document.createElement('li');
        elem.classList.add('nav-item');
        let avatar = document.createElement('img');
        avatar.style.height = '30px';
        avatar.src = 'account.png';
        elem.appendChild(avatar);
        if(this.pinned.has(name)) {
            let pin = document.createElement('img');
            pin.style.height = '30px';
            pin.src = 'pin.png';
            elem.appendChild(pin);
        }
        let link = document.createElement('a');
        link.classList.add('secondary-link');
        link.href = `user.html?user=${name}`;
        link.textContent = name;
        link.style.paddingLeft = '10px';
        elem.appendChild(link);

        return elem;
    }

    sampleGifs() {
        this.addUser('Tom');
        this.addUser('Dick');
        this.addUser('Harry')
        this.addUser('Sally');
        
        this.username = 'Tom';

        for(const user of this.users.values()) {
            if(user.name === this.username)
                continue;
            this.friends.add(user.name);
        }

        this.pinned.add('Dick');
        this.pinned.add('Sally');

        this.users.get('Tom').addGIF('sample/fizzidyuk.gif');
        this.users.get('Tom').addGIF('sample/jeepers.gif');
        this.users.get('Sally').addGIF('sample/the_only_sane_person.gif');

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
        let gif = this.getGIFFromElem(elem);
        let img = this.getFavoriteButtonImage(elem);
        fetch(`/api/user/${this.username}/togglefavorite/${gif}`, {
            method: 'POST'
        }).then(async (res) => {
            console.log(res);
            let json = await res.json();
            if(json.favorites.includes(gif)) {
                img.src = 'full_star.png';
            }
            else {
                img.src = 'empty_star.png';
            }
            this.rebuildFavorites(json.favorites);
        });
    }

    rebuildFavorites(favorites) {
        let favoriteElems = document.getElementById('favorites');
        if(favoriteElems) {
            favoriteElems.innerHTML = '';
            for(const id of favorites) {
                favoriteElems.appendChild(this.createGifElem(id, true));
            }
        }
    }

    rebuildPinnedFriends(pinned) {
        let pinnedFriends = document.getElementById('pinned-friends');
        if(pinnedFriends) {
            for(const name of pinned) {
                pinnedFriends.appendChild(this.createPinnedElem(name));
            }
        }
    }
}

const data = new Data();

async function redirect() {
    let res = await fetch('/api/auth/ping', {
        method: 'GET'
    });
    let json = await res.json();
    if(json.username) {
        data.username = json.username;
    }
    else {
        location.assign('login.html');
    }
    
}

redirect().then(() => {
    let username = document.getElementById('username');
    if(username) {
        username.textContent = data.username;
    }

    const params = new URLSearchParams(document.location.search);
    let userpage = params.get('user');
    if(!userpage) {
        userpage = data.username;
    }
    let userGifs = document.getElementById('userpage');
    let friendList = document.getElementById('friend-list');

    fetch(`/api/user/${data.username}`, {
        method: 'GET'
    }).then(async (res) => {
        let json = await res.json();
        json.friends ??= [];
        json.pinned ??= [];
        json.favorites ??= [];
        if(friendList) {
            for(const friend of json.friends) {
                friendList.appendChild(data.createFriendElem(friend));
            }
        }

        data.rebuildPinnedFriends(json.pinned);
        data.rebuildFavorites(json.favorites);
        if(userGifs) {
            fetch(`/api/user/${userpage}`, {
                method: 'GET'
            }).then(async (res2) => {
                let json2 = await res2.json();
                json2.gifs ??= [];
                
                for(const gif of json2.gifs) {
                    userGifs.appendChild(data.createGifElem(gif, json.favorites.includes(gif)));
                }
            });
        }
    });

    
});

/*
fetch('/api/user/owlblocks/pin/monti', {
    method: 'POST'
})
*/