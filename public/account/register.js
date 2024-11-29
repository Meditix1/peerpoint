$(document).ready(function () {
    document.getElementById('registrationForm').addEventListener('submit', async function (event) {
        event.preventDefault() // prevent page refresh

        var formData = new FormData(this);
        var email = formData.get('email');
        var password = formData.get('password');
        var confirmPassword = formData.get('confirmPassword');
        var username = formData.get('username');

        // check if password == confirmPassword
        if (password != confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        fetch('/account/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                email: email,
                username: username
            })
        }).then(async function (response) {
            if (response.ok) {
                alert("Account successfully created!");
                window.location.href = "./login.html";
            }
            else {
                let json = await response.json();
                alert(json.message)
            }
        }).catch(function (err) {
            console.log(err)
            alert("Error");
        })
    });
})
