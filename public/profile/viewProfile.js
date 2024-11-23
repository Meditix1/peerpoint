const token = sessionStorage.getItem('authToken');

$(document).ready(function () {
    document.getElementById('uploadForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const fileInput = document.getElementById('pfpUpload');

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            var b64string = await convertImgToB64(file);
            console.log(b64string)

            fetchWithAuth('/account/uploadProfilePic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    b64string: b64string,
                    token: token
                })
            }).then(function (res) {
                alert("Successfully updated profile picture!");
                sessionStorage.removeItem("profilePic");
            }).catch(function (err) {
                alert("Error")
            })
        } else {
            fileInfo.textContent = 'No file selected.';
        }
    });
});

function convertImgToB64(file) {
    return new Promise((resolve, reject) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(file);
        } else {
            reject(new Error("No file provided"));
        }
    });
}