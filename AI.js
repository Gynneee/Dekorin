const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const chatContainer = document.getElementById('chat-container');
const backendURL = 'http://localhost:3000/chat';

function displayMessage(message, sender) {
  const welcomeLogo = document.querySelector('.welcome-logo');
  const welcomeText = document.querySelector('.welcome-text');
  if (welcomeLogo) welcomeLogo.style.display = 'none';
  if (welcomeText) welcomeText.style.display = 'none';

  const messageDiv = document.createElement('div');
  
  if (sender === 'user') {
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
  } else {
    messageDiv.className = 'bot-message';
    const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    messageDiv.innerHTML = `
      <img src="src/Home/Destinyaicolored.png" alt="bot logo" />
      <p>${formattedMessage}</p>
    `;
  }
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessageToAI(userMessage) {
  try {
    const response = await fetch(backendURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    displayMessage(data.message, 'bot');

  } catch (error) {
    console.error('Error:', error);
    displayMessage('Oops! Sepertinya ada masalah. Coba lagi nanti.', 'bot');
  }
}

function handleSendChat() {
  const userMessage = chatInput.value.trim();
  
  if (userMessage) {
    displayMessage(userMessage, 'user');
    sendMessageToAI(userMessage);
    chatInput.value = '';
  }
}

sendBtn.addEventListener('click', handleSendChat);

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSendChat();
  }
});