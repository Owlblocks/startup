function logout() {
    fetch('/api/auth/logout', {
        method: 'POST'
    })
    .then((res) => {
        if(res.ok) {
            location.assign('login.html');
        }
    })
    .catch((err) => {console.log(err)})
}

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.onclick = logout;