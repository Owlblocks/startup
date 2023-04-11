
function login(username, password) {
    let body = {username: username, password: password};
    fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }})
        .then((res => {
            if(res.ok) {
                console.log('Logged in Successfully');
            }
            else {
                console.log('Login Failed');
            }
        }))
        .catch((err) => ("Error", err))
}

const loginBtn = document.getElementById('login-btn');
const usernameField = document.getElementById('username-field');
const passwordField = document.getElementById('password-field');

function onTextChanged() {
    loginBtn.disabled = (!usernameField.value || !passwordField.value);
}

loginBtn.onclick = () => {login(usernameField.value, passwordField.value)};
usernameField.onchange, passwordField.onchange = onTextChanged;
