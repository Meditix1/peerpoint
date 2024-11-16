$(document).ready(function () {
    document.getElementById('registrationForm').addEventListener('submit', async function (event) {
        event.preventDefault() // prevent page refresh
        
        const formData = new FormData(this);
        const password = formData.get('password');
        const email = formData.get('email');

        // Check if the email exists. If returns true, means cannot create the account as it exists already
        var acc_exists;
        await fetch(`/account/checkAccountExists?email=${encodeURIComponent(email)}`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(function (data) {
            console.log(data); 
            acc_exists = data;
            if(acc_exists) {
                alert("Email already exists, please use another email.")
            }
        }).catch(function (error) {
            console.error('Error:', error);
        });
        
        if(!acc_exists) {
            fetch('/account/createAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: password,
                    email: email
                })
            }).then(function(response) {
                console.log(response)
            })
        }
        


    });
})
