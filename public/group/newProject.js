const token = sessionStorage.getItem('authToken');

document.addEventListener('DOMContentLoaded', function(){
    var invitedMembers = [];
    document.getElementById('add-member').addEventListener('click', function () {
        const emailInput = document.getElementById('invite-members');
        const email = emailInput.value.trim();
        if (email) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${email} <span class="remove-member"><i class="fas fa-times"></i></span>`;
            document.getElementById('invited-members-list').appendChild(listItem);
            emailInput.value = '';
            listItem.querySelector('.remove-member').addEventListener('click', function () {
                listItem.remove();
                invitedMembers = invitedMembers.filter(a => a != email);
            });
            invitedMembers.push(email);
        }
    });
    
    document.getElementById('createGrpForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // prevent page refresh
        const formData = new FormData(this);
        const name = formData.get('group-name');
        const description = formData.get('group-description');
        const users = invitedMembers; // array of emails
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
                invitedMembers: users,
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