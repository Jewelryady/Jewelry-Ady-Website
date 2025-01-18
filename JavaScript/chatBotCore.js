const chatBody = document.getElementById('chatBody');
const chatContainer = document.getElementById('chatContainer');
const overlay = document.getElementById('overlay');
const chatButton = document.getElementById('chatButton');
const chatIcon = document.getElementById('chatIcon');

function toggleChat() {
    if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
        chatContainer.style.display = "block";
        overlay.style.display = "block";
        chatIcon.src = "images/Chat Bot/Chat Off.png"; // Change to chat off icon
    } else {
        chatContainer.style.display = "none";
        overlay.style.display = "none";
        chatIcon.src = "images/Chat Bot/Chat On.png"; // Change back to chat on icon
    }
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value;

    if (message.trim() === "") return;

    appendMessage(message, 'message-user');

    setTimeout(() => {
        let botResponse = getBotResponse(message);
        appendMessage(botResponse.message, 'message-bot');

        if (botResponse.button) {
            appendButton(botResponse.button.text, botResponse.button.link);
        }

        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);

    userInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendPresetMessage(presetMessage) {
    const userInput = document.getElementById('userInput');
    userInput.value = presetMessage;
    sendMessage();
}

function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', className);
    messageElement.innerText = message;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function appendButton(buttonText, link) {
    const buttonElement = document.createElement('button');
    buttonElement.classList.add('preset-button');
    buttonElement.innerText = buttonText;
    buttonElement.onclick = function () {
        window.location.href = link;
    };
    chatBody.appendChild(buttonElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(message) {
    const responses = {
        "In cât timp ajung coletele?": "Coletele ajung în 3-4 zile lucrătoare.",
        "Oferiți livrare express?": "Da, oferim livrare express.",
        "Ce servicii oferiți?": "Oferim o gamă variată de servicii.",
        "Salut": "Salut! Cum pot să te ajut?",
        "Ce servicii oferiți?": "Oferim o gamă variată de servicii."
    };

    if (responses[message]) {
        return { message: responses[message] };
    } else {
        return {
            message: "Pentru întrebări mai complexe, puteți întreba de operatorul nostru pe Telegram.",
            button: { text: "Contactați operatorul", link: "https://t.me/jewelryady" }
        };
    }
}
