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
}).then(function (res) {
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
    $('#createdAt').text(formattedDate);
    var grpMembersHtmlString = "";
    for (var m in res.group_members) {
        let member = res.group_members[m];
        grpMembersHtmlString += `<li>
                    <img alt="Profile picture of member 1" height="50" width="50"
                        src="https://storage.googleapis.com/a1aa/image/fbWk0TX86Mwf7UEFk1eWmYtXi6VyuZaA80lfM98lF62V5jPPB.jpg" />
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

    grpMembersHtmlString += `<li id="addMember" style="cursor:pointer;">
    <span class="material-symbols-outlined" style="font-size: 50px; margin-right: 10px;">
        add_circle
    </span>
    <div class="member-info">
        <span>Add Member</span>
    </div>
    </li>`
    $('#groupMemberList').html(grpMembersHtmlString)

    $("#addMember").on("click", async function () {
        var { value: newInviteEmail } = await Swal.fire({
            title: "Add new member",
            input: "text",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "This is a required field!";
                }
            }
        });

        if (newInviteEmail) {
            // Loading popup
            Swal.fire({
                title: 'Adding...',
                text: 'Please wait while we add this user to the project.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await fetchWithAuth("/groups/addNewMember", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    group_id: groupId,
                    invited_user_email: newInviteEmail
                })
            }).then(async function (response) {
                var json = await response.json();
                if (response.status == 400) {
                    if (json.error) {
                        Swal.fire(json.error)
                    }
                }
                else if (response.status == 200) {
                    Swal.fire("New member added!")
                }
            }).catch(function (err) {
                Swal.fire("Error please try again!");
            })
        }
    })
})
    .catch(function (error) {
        alert("Error please check console")
        console.error('Error:', error);
    });