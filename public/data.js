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
    friends;

    username;

    constructor() {
        this.gifs = new Map();
        this.friends = new Map();
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

    createFriendElem(name, pinned) {
        let elem = document.createElement('li');
        elem.classList.add('nav-item');
        let avatar = document.createElement('img');
        avatar.style.height = '30px';
        avatar.src = 'account.png';
        elem.appendChild(avatar);
        let pinButton = document.createElement('button');
        pinButton.onclick = function() {data.togglePin(elem)};
        let pin = document.createElement('img');
        pin.style.height = '30px';
        pin.src = pinned ? 'pin.png' : 'pin_empty.png';
        pinButton.appendChild(pin);
        elem.appendChild(pinButton);
        let link = document.createElement('a');
        link.classList.add('secondary-link');
        link.href = `user.html?user=${name}`;
        link.textContent = name;
        link.style.paddingLeft = '10px';
        elem.appendChild(link);

        this.friends.set(elem, name);

        return elem;
    }

    getGIFFromElem(elem) {
        return this.gifs.get(elem);
    }

    getFriendFromElem(elem) {
        return this.friends.get(elem);
    }

    getFavoriteButtonImage(elem) {
        elem = elem.querySelector('button');
        elem = elem.querySelector('img');
        return elem;
    }

    getPinButtonImage(elem) {
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
            // console.log(res);
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

    togglePin(elem) {
        let friend = this.getFriendFromElem(elem);
        let img = this.getPinButtonImage(elem);
        fetch(`/api/user/${this.username}/togglepin/${friend}`, {
            method: 'POST'
        }).then(async (res) => {
            let json = await res.json();
            if(json.pinned.includes(friend)) {
                img.src = 'pin.png';
            }
            else {
                img.src = 'pin_empty.png';
            }
            this.rebuildPinnedFriends(json.pinned);
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
            pinnedFriends.innerHTML = '';
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
                friendList.appendChild(data.createFriendElem(friend, json.pinned.includes(friend)));
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