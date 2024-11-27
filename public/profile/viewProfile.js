const token = sessionStorage.getItem('authToken');

$(document).ready(function () {
    setProfilePicture();

    $("#updateUsernameBtn").on("click", async function () {
        var inputValue = $("#username").text();
        var { value: newUsername } = await Swal.fire({
            title: "Update username",
            input: "text",
            inputValue,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "This is a required field!";
                }
            }
        });

        if (newUsername) {
            // Loading popup
            Swal.fire({
                title: 'Updating...',
                text: 'Please wait while we update your username.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await fetchWithAuth("/account/updateUsername", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    newUsername: newUsername,
                    token: token
                })
            }).then(function (response) {
                return response.json();
            }).then(async function (res) {
                if (res.error) {
                    if (res.error.code == 23505) {
                        Swal.fire("Username already in use!");
                    }
                }
                else if (res.status == 200) {
                    // set new token
                    sessionStorage.setItem("authToken", res.token);
                    await Swal.fire("Sucessfully updated username!");
                    window.location.reload();
                }
            }).catch(function (err) {
                Swal.fire("Error please try again!");
            })
        }
    })

    $("#editProfilePic").on("click", async function () {
        const { value: file } = await Swal.fire({
            title: "Update Profile Picture",
            text: "Image cannot exceed 3 MB!",
            input: "file",
            inputAttributes: {
                "accept": "image/*",
                "aria-label": "Upload your profile picture"
            },
            inputAutoFocus: false,
        });
    
        if (file) {
            if(file.size > 3900000) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Please upload a file less than 3 MB.',
                });
                return;
            }
            // Loading popup
            Swal.fire({
                title: 'Uploading...',
                text: 'Please wait while we update your profile picture.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
    
            var b64string = await convertImgToB64(file);
            if(b64string.length > 5000000) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Please upload a file less than 3 MB.',
                });
                return;
            }
            
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
            }).then(async function (res) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your profile picture has been updated.',
                });
                sessionStorage.removeItem("profilePic");
                window.location.reload();
            }).catch(function (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'There was an error updating your profile picture. Please try again.',
                });
            });
        }
    });
    

});

function setProfilePicture() {
    if (sessionStorage.getItem("profilePic") != undefined) {
        $('#profilePicPage').attr('src', sessionStorage.getItem("profilePic"));
        $('#username').text(decoded.user.username); // this var is from headerManager.js
    } else {
        setTimeout(() => {
            setProfilePicture();
        }, 1000);
    }
}

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