const registerBtn = document.getElementById('register-btn');
const usernameField = document.getElementById('username-field');
const passwordField = document.getElementById('password-field');
const confirmField = document.getElementById('confirm-field');

function register(username, password) {
    if(passwordField.value !== confirmField.value) {
        // Passwords must match
        return;
    }
    let body = {username: username, password: password};
    fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }})
        .then((res => {
            if(res.ok) {
                console.log('Successfully Registered');
                location.assign('index.html');
            }
            else {
                console.log('Registration Failed');
            }
        }))
        .catch((err) => ("Error", err))
}



function onTextChanged() {
    registerBtn.disabled = (!usernameField.value ||
                            !passwordField.value ||
                            !confirmField.value /* ||
                            passwordField.value !== confirmField.value*/);
}

registerBtn.onclick = () => {register(usernameField.value, passwordField.value)};
usernameField.onchange, passwordField.onchange, confirmField.onchange = onTextChanged;
