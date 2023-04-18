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
        alert(`Max file size: ${2097152} bytes`);
        file = {};
        return;
    }
    preview.alt = 'Loading';
    preview.src = '';
    let fr = new FileReader();
    fr.onload = function(event) { preview.src = event.target.result; button.disabled = false; };
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
    formData.append('gif', file);
    fetch('/api/upload/gif', {
        method: 'POST',
        body: formData /*,
        headers: {
            'Content-Type': 'multipart/form-data'
        }*/
    })
        .then((res) => reset())
        .catch((err) => ("Error", err));
}

fileInput.addEventListener('change', onFileChanged);
button.addEventListener('click', onUploadClicked);