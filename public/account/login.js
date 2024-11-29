$(document).ready(function () {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault() // prevent page refresh

        $('#warningText').hide();
        $('#loginBtn').attr("disabled", true);
        $("#loginBtn").html('<div class="spinner-grow" style="width: 1rem; height: 1rem;" role="status"><span class="sr-only"></span></div>');

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
            console.log("HI")
            if (response.status == 200) {
                // store jwt in session storage
                token = await response.json();
                sessionStorage.setItem('authToken', token);
                window.location.href = '/main/dashboard.html'

            }
            else if (response.status == 400) {
                $('#warningText').show();
                var res = await response.json();
                $("#warningText").text(res.message);
            }
            else {
                alert("Error")
            }
        }).catch(function (err) {
            console.log(err)
            console.log("ERRO")
            alert("Error pls check console")
        })

        $("#loginBtn").removeAttr("disabled");
        $("#loginBtn").html('Login');
    });
})