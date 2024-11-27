const socket = io('http://localhost:5000')

socket.on('chat-message', data => {

    let msg = data.message;
    let profilePic = data.profilePic;

    let msgElement = constructReceivedMsg(msg, profilePic);
    addNewMessageElement(msgElement);
})

const chatForm = $('#chatForm');
const msgInput = $('#messageInput');

chatForm.on('submit', function () {
    event.preventDefault();
    var message = msgInput.val();
    var profilePic = sessionStorage.getItem("profilePic");
    socket.emit('send-chat-message', {message: message, profilePic: profilePic});
    msgInput.val('')
    var msgElement = constructSentMsg(message, profilePic);
    addNewMessageElement(msgElement);
});

const messageContainer = $("#messages");

function addNewMessageElement(msgElement) {
    if($("#hint")) {
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