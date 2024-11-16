const token = sessionStorage.getItem('authToken');

$(document).ready(function () {
    fetchWithAuth('/main/dashboard', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the request
        }
    }).then(function (response) {
        console.log(response);
    })
})
