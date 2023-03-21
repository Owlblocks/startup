const preview = document.getElementById('preview');

function onFileChanged(event) {
    preview.alt = 'Loading';
    preview.src = '';
    let file = event.srcElement.files[0]; 
    let fr = new FileReader();
    fr.onload = function(event) { preview.src = event.target.result };
    fr.readAsDataURL(file);
}

let fileInput = document.getElementById('fileinput');
if(fileInput) {
    fileInput.addEventListener("change", onFileChanged);
}