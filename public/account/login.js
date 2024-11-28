$(document).ready(function () {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault() // prevent page refresh

        $('#errorMsg').hide();
        $('#loginBtn').attr("disabled", true);
        $("#loginBtn").html('<div class="spinner-grow" style="width: 1rem; height: 1rem;" role="status"><span class="sr-only">Loading...</span></div>');

        const formData = new FormData(this);
        const password = formData.get('password');
        const email = formData.get('email');

        await fetch('/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(async function (response) {
            if (response.status == 200) {
                // store jwt in session storage
                token = await response.json();
                sessionStorage.setItem('authToken', token);
                window.location.href = '/main/dashboard.html'

            }
            else if (response.status == 400) {
                $('#errorMsg').show();
            }
            else {
                alert("Error")
            }
        }).catch(function (err) {
            console.log(err)
            alert("Error pls check console")
        })

        $("#loginBtn").removeAttr("disabled");
        $("#loginBtn").html('Login');
    });
})