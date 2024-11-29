const token = sessionStorage.getItem('authToken');

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('createGrpForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // prevent page refresh
        const formData = new FormData(this);
        const name = formData.get('group-name');
        const description = formData.get('group-description');
        const jwt  = sessionStorage.getItem('authToken');
    
        await fetchWithAuth(`/groups/createGroup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                grpName: name,
                grpDesc: description,
                jwt: jwt
            })
        }).then(function (response) {
            console.log(response)
            if (response.ok) {
                alert("Successfully created a new group!");
                window.location.href = "./groupList.html";
            }
        }).catch(function (error) {
            alert("Error please check console")
            console.error('Error:', error);
        });
    });
})