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

const preview = document.getElementById('preview');
const button = document.getElementById('upload')
const fileInput = document.getElementById('fileinput');

async function getUsername() {
    let res = await fetch('/api/auth/ping', {
        method: 'GET'
    });
    let json = await res.json();
    return json.username;
}

let username = {};
getUsername().then((res) => { username = res; })

let file = {};

const maxSize = 2097152;

function onFileChanged(event) {
    file = event.srcElement.files[0];
    if(file.size > maxSize) {
        alert(`Max file size: ${maxSize} bytes`);
        file = {};
        return;
    }
    preview.alt = 'Loading';
    preview.src = '';
    let fr = new FileReader();
    fr.onload = function(event) {
        preview.onload = function(event) {
            if(preview.width !== 100 || preview.height !== 100) {
                alert(`File must be 100x100px png, but was ${preview.width}x${preview.height}`);
                file = {};
                reset();
                preview.alt = '';
            }
        }
        preview.src = event.target.result;
        button.disabled = false;
    };
    fr.readAsDataURL(file);
}

function reset() {
    preview.src = '';
    preview.alt = 'File uploaded successfully!';
    fileInput.value = '';
    button.disabled = true;
}

function onUploadClicked(event) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('avatar', file);
    fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData /*,
        headers: {
            'Content-Type': 'multipart/form-data'
        }*/
    })
        .then(async (res) => {
            reset();
            location.reload();
            /*
            let name = (await res.json()).filename;
            console.log(name);
            let avatarImg = document.getElementById('avatar');
            avatarImg.src = `/data/avatars/${name}`; */
        })
        .catch((err) => ("Error", err));
}

fileInput.addEventListener('change', onFileChanged);
button.addEventListener('click', onUploadClicked);