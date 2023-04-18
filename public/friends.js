const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');

async function getUsername() {
    let res = await fetch('/api/auth/ping', {
        method: 'GET'
    });
    let json = await res.json();
    return json.username;
}

let username = {};
getUsername().then((res) => { username = res; })

function clearSearchResults() {
    searchResults.textContent = '';
}

function addFriend(name) {
    fetch(`/api/user/${username}/addfriend/${name}`, {
        method: 'POST',
    }).then((res) => {
        res.json().then((json) => {
            console.log(json);
        })
        clearSearchResults();
        location.reload();
    })
}

function addSearchResult(user) {
    if(user.username === username) {
        return;
    }
    let div = document.createElement('div');
    let label = document.createElement('label');
    let add = document.createElement('button');
    div.appendChild(label);
    div.appendChild(add);
    label.textContent = user.username;
    add.textContent = '[Add]';
    add.classList.add('btn');
    add.onclick = () => addFriend(user.username);
    searchResults.appendChild(div);
}

function search() {
    clearSearchResults();
    let text = searchBar.value;
    fetch('/api/user/search', {
        method: 'POST',
        body: JSON.stringify({searchString: text}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (res) => {
        let json = await res.json();
        for(const result of json) {
            addSearchResult(result);
        }
    });
}

searchButton.onclick = search;