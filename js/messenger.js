const show_messages = document.getElementById('show-messages');
let messageID = 0;

const clearMessage = (id) => {
    setTimeout(() => {
        document.getElementById('message-' + id).remove();
    }, 3000);
}

const message = (text) => {
    if (show_messages.checked) {
        let msg = document.createElement('div');
        msg.id = `message-${messageID}`;
        msg.textContent = `${text}`;
        messenger.appendChild(msg);
        clearMessage(messageID);
        messageID++;
    }
}
