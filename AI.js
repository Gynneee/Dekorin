const API_BASE = 'http://localhost:3000';
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const historyBtn = document.getElementById('history-btn');

const clearChatOverlay = document.getElementById('clearChatOverlay');
const clearChatPopup = document.getElementById('clearChatPopup');
const cancelClearBtn = document.getElementById('cancelClearBtn');
const confirmClearBtn = document.getElementById('confirmClearBtn');

const historyOverlay = document.getElementById('historyOverlay');
const historyPopup = document.getElementById('historyPopup');
const historyContent = document.getElementById('historyContent');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');

let isLoading = false;
let messageHistory = [];

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  checkServerStatus();
  setupEventListeners();
  loadWelcomeMessage();
});

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 12 + 's';
    particle.style.animationDuration = (Math.random() * 6 + 10) + 's';
    particlesContainer.appendChild(particle);
  }
}

async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) {
      console.warn('⚠️ Server offline');
    }
  } catch (error) {
    console.warn('⚠️ Cannot connect to server. Backend might not be running.');
  }
}

function setupEventListeners() {
  sendBtn.addEventListener('click', sendMessage);
  
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  });
  
  if (historyBtn) {
    historyBtn.addEventListener('click', showHistoryPopup);
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', showClearPopup);
  }

  cancelClearBtn.addEventListener('click', hideClearPopup);
  confirmClearBtn.addEventListener('click', () => {
    hideClearPopup();
    clearConversation();
  });
  clearChatOverlay.addEventListener('click', hideClearPopup);

  closeHistoryBtn.addEventListener('click', hideHistoryPopup);
  historyOverlay.addEventListener('click', hideHistoryPopup);
}

function loadWelcomeMessage() {
  const welcomeMsg = {
    role: 'bot',
    content: 'Halo DekorMate! ✨ Saya Destiny AI dari DekorIn. Saya siap membantu kamu memilih wallpaper yang sempurna untuk ruangan impian kamu! 🏠\n\nMau tanya tentang produk, hitung kebutuhan wallpaper, atau minta saran desain? Yuk chat! 💬',
    timestamp: new Date()
  };
  
  const defaultWelcome = chatContainer.querySelector('.bot-message');
  if (defaultWelcome) {
    defaultWelcome.remove();
  }
  
  addMessageToUI(welcomeMsg);
  
  setTimeout(() => {
    addQuickReplies();
  }, 600);
}

async function sendMessage() {
  const message = chatInput.value.trim();
  
  if (!message || isLoading) return;
  
  const userMsg = {
    role: 'user',
    content: message,
    timestamp: new Date()
  };
  
  addMessageToUI(userMsg);
  messageHistory.push({ role: 'user', content: message });
  
  chatInput.value = '';
  chatInput.style.height = 'auto';
  removeQuickReplies();
  
  isLoading = true;
  sendBtn.disabled = true;
  
  showTypingIndicator();
  
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        sessionId: SESSION_ID
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response');
    }
    
    const data = await response.json();
    
    removeTypingIndicator();
    
    const botMsg = {
      role: 'bot',
      content: data.message,
      timestamp: new Date(),
      metadata: data.metadata
    };
    
    addMessageToUI(botMsg);
    messageHistory.push({ role: 'assistant', content: data.message });
    
  } catch (error) {
    console.error('Error:', error);
    
    removeTypingIndicator();
    
    const errorMsg = {
      role: 'bot',
      content: '❌ Maaf DekorMate, saya mengalami kendala teknis. Pastikan server backend sudah berjalan dan coba lagi ya! 🙏',
      timestamp: new Date(),
      isError: true
    };
    
    addMessageToUI(errorMsg);
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }
}

function addMessageToUI(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = message.role === 'user' ? 'user-message' : 'bot-message';
  
  if (message.role === 'bot') {
    const logo = document.createElement('img');
    logo.src = 'src/Home/Destinyaicolored.png';
    logo.alt = 'Destiny AI';
    messageDiv.appendChild(logo);
  }
  
  const contentP = document.createElement('p');
  
  let formattedContent = message.content;
  
  formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formattedContent = formattedContent.replace(/\n/g, '<br>');
  formattedContent = formattedContent.replace(/^(\d+)\.\s/gm, '<br>$1. ');
  
  contentP.innerHTML = formattedContent;
  messageDiv.appendChild(contentP);
  
  chatContainer.appendChild(messageDiv);
  
  setTimeout(() => {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
}

function showTypingIndicator() {
  removeTypingIndicator();
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.id = 'typing-indicator';
  
  const logo = document.createElement('img');
  logo.src = 'src/Home/Destinyaicolored.png';
  logo.alt = 'Destiny AI';
  typingDiv.appendChild(logo);
  
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'typing-dots';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dotsContainer.appendChild(dot);
  }
  
  typingDiv.appendChild(dotsContainer);
  chatContainer.appendChild(typingDiv);
  
  setTimeout(() => {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, 50);
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

async function clearConversation() {
  try {
    await fetch(`${API_BASE}/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: SESSION_ID
      })
    });
    
    chatContainer.innerHTML = '';
    messageHistory = [];
    
    loadWelcomeMessage();
    
  } catch (error) {
    console.error('Failed to clear conversation:', error);
  }
}

function showError(message) {
  const errorMsg = {
    role: 'bot',
    content: `⚠️ ${message}`,
    timestamp: new Date(),
    isError: true
  };
  
  addMessageToUI(errorMsg);
}

function addQuickReplies() {
  if (document.querySelector('.quick-replies')) return;
  
  const quickReplies = [
    { text: '🏠 Lihat Katalog', message: 'Tampilkan katalog wallpaper' },
    { text: '📐 Hitung Kebutuhan', message: 'Hitung wallpaper untuk ruangan 5x4 meter tinggi 3 meter' },
    { text: '🎨 Saran Desain', message: 'Rekomendasikan wallpaper untuk kamar tidur minimalis' },
    { text: '💰 Info Harga', message: 'Berapa harga wallpaper di DekorIn?' }
  ];
  
  const quickReplyDiv = document.createElement('div');
  quickReplyDiv.className = 'quick-replies';
  
  quickReplies.forEach(reply => {
    const button = document.createElement('button');
    button.textContent = reply.text;
    
    button.addEventListener('click', () => {
      chatInput.value = reply.message;
      sendMessage();
      quickReplyDiv.remove();
    });
    
    quickReplyDiv.appendChild(button);
  });
  
  if (messageHistory.length === 0) {
    chatContainer.appendChild(quickReplyDiv);
  }
}

function removeQuickReplies() {
  const quickReplyDiv = document.querySelector('.quick-replies');
  if (quickReplyDiv) {
    quickReplyDiv.remove();
  }
}

function showClearPopup() {
  clearChatOverlay.classList.add('show');
  clearChatPopup.classList.add('show');
  document.body.classList.add('no-scroll');
}

function hideClearPopup() {
  clearChatOverlay.classList.remove('show');
  clearChatPopup.classList.remove('show');
  document.body.classList.remove('no-scroll');
}

function showHistoryPopup() {
  historyContent.innerHTML = '';

  if (messageHistory.length === 0) {
    historyContent.innerHTML = '<p class="no-history">No conversation history yet.</p>';
  } else {
    messageHistory.forEach(msg => {
      const msgDiv = document.createElement('div');
      const role = msg.role === 'assistant' ? 'bot' : 'user';
      msgDiv.className = `history-message ${role}`;
      msgDiv.textContent = msg.content;
      historyContent.appendChild(msgDiv);
    });
  }

  historyOverlay.classList.add('show');
  historyPopup.classList.add('show');
  document.body.classList.add('no-scroll');
}

function hideHistoryPopup() {
  historyOverlay.classList.remove('show');
  historyPopup.classList.remove('show');
  document.body.classList.remove('no-scroll');
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

window.destinyAI = {
  sendMessage,
  clearConversation,
  checkServerStatus,
  messageHistory,
  showTypingIndicator,
  removeTypingIndicator
};