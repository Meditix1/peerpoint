const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const groupId = params.get('id');

const token = sessionStorage.getItem("authToken");

fetchWithAuth(`/groups/getGroupDetails?group_id=` + groupId, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
}).then(function (response) {
    return response.json();
}).then(function(res) {
    console.log(res)
    $('#grpDesc').text(res.description);
    $('#grpName').text(res.group_name);

    var createdAt = new Date(res.created_at);

    const options = {
        year: 'numeric',
        month: 'long', // 'short' for abbreviated month names
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    
    const formattedDate = createdAt.toLocaleString('en-US', options);
    console.log(formattedDate);
    $('#createdAt').text(formattedDate);
    var grpMembersHtmlString = "";
    for(var m in res.group_members) {
        let member = res.group_members[m];
        console.log(member)
        grpMembersHtmlString += `<li>
                    <img alt="Profile picture of member 1" height="50"
                        src="https://storage.googleapis.com/a1aa/image/fbWk0TX86Mwf7UEFk1eWmYtXi6VyuZaA80lfM98lF62V5jPPB.jpg"
                        width="50" />
                    <div class="member-info">
                        <span>
                            ${member.username}
                        </span>
                        <span>
                            Role: ${member.group_role}
                        </span>
                    </div>
                </li>`
    }
    $('#groupMemberList').html(grpMembersHtmlString)
})
.catch(function (error) {
    alert("Error please check console")
    console.error('Error:', error);
});