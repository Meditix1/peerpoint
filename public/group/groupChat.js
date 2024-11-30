const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const groupId = params.get('id');
const token = sessionStorage.getItem("authToken");
const socket = io('http://localhost:5000')

if (groupId == null || parseInt(groupId) == NaN) {
    $('.container').html("<h1>Invalid group</h1>");
}

function setDynamicMaxHeight() {
    const messagesContainer = document.getElementById('messages');
    const initialHeight = messagesContainer.scrollHeight; // Get the initial height
    messagesContainer.style.maxHeight = `${initialHeight}px`; // Set max height to initial height
}

document.addEventListener('DOMContentLoaded', async () => {
    setDynamicMaxHeight();

    const response = await fetchWithAuth(`/groups/getGroupDetails?group_id=${groupId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    const res = await response.json();
    $("#groupname").text(res.group_name)

    socket.emit('join-group', groupId);

    socket.on('chat-message', data => {
        let msg = data.message;
        let profilePic = data.profilePic;

        let msgElement = constructReceivedMsg(msg, profilePic);
        addNewMessageElement(msgElement);
        $("#messages").scrollTop($("#messages").height());
    });

    const chatForm = $('#chatForm');
    const msgInput = $('#messageInput');

    chatForm.on('submit', function () {
        event.preventDefault();
        var message = msgInput.val();
        var profilePic = sessionStorage.getItem("profilePic");
        socket.emit('send-chat-message', { groupId: groupId, message: message, profilePic: profilePic });
        msgInput.val('')
        var msgElement = constructSentMsg(message, profilePic);
        addNewMessageElement(msgElement);
        $("#messages").scrollTop($("#messages").height());

    });

    const messageContainer = $("#messages");

    function addNewMessageElement(msgElement) {
        if ($("#hint")) {
            $("#hint").remove();
        }
        messageContainer.append(msgElement);
    }

    function constructSentMsg(msgContent, profilePic) {
        var sentMsg = ` <div class="message d-flex align-items-start justify-content-end">
    <div class="me-3">
        <div class="bg-primary text-white p-2 rounded">
            <p class="mb-0">${msgContent}</p>
        </div>
    </div>
    <img src="${profilePic}" alt="avatar" class="avatar ml-2">
</div>`;
        return sentMsg;
    }

    function constructReceivedMsg(msgContent, profilePic) {
        var receivedMsg = `<div class="message d-flex align-items-start">
<img src="${profilePic}" alt="avatar" class="avatar mr-2">
<div class="ms-3">
    <div class="bg-info text-white p-2 rounded">
        <p class="mb-0">${msgContent}</p>
    </div>
</div>
</div>`;
        return receivedMsg;
    }

})