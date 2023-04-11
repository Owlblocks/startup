function redirect() {
    fetch('/api/auth/ping', {
        method: 'GET'
    })
    .then(async (res) => {
        let json = await res.json();
        if(json.username) {

        }
        else {
            location.assign('login.html');
        }
    })
    .catch((err) => {
        console.log(err);
    })
    
}

console.log(document.cookie);

redirect();