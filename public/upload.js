const preview = document.getElementById('preview');
const button = document.getElementById('upload')

let file = {};

function onFileChanged(event) {
    preview.alt = 'Loading';
    preview.src = '';
    file = event.srcElement.files[0]; 
    let fr = new FileReader();
    fr.onload = function(event) { preview.src = event.target.result; button.disabled = false; };
    fr.readAsDataURL(file);
}

function onUploadClicked(event) {
    const formData = new FormData();
    formData.append('username', 'owlblocks');
    formData.append('gif', file);
    fetch('/api/upload/gif', {
        method: 'POST',
        body: formData /*,
        headers: {
            'Content-Type': 'multipart/form-data'
        }*/
    })
        .then((res) => console.log(res))
        .catch((err) => ("Error", err));
}

let fileInput = document.getElementById('fileinput');
if(fileInput) {
    fileInput.addEventListener('change', onFileChanged);
}
button.addEventListener('click', onUploadClicked);