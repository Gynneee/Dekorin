// Destiny AI Frontend - DekorIn
// Configuration
const API_BASE = 'http://localhost:3000';
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// DOM Elements
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// State
let isLoading = false;
let messageHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('🤖 Destiny AI Initialized');
  checkServerStatus();
  setupEventListeners();
  loadWelcomeMessage();
});

// Check if server is online
async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      console.log('✅ Server online');
    } else {
      showError('Server offline. Please start the backend server.');
    }
  } catch (error) {
    showError('Cannot connect to server. Make sure backend is running on port 3000.');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Send button click
  sendBtn.addEventListener('click', sendMessage);
  
  // Enter key to send
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
  
  // Auto-resize textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  });
  
  // History button
  const historyBtn = document.querySelector('[aria-label="History"]');
  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      if (messageHistory.length > 0) {
        alert(`Conversation History:\n\n${messageHistory.map(m => `${m.role}: ${m.content}`).join('\n\n')}`);
      } else {
        alert('No conversation history yet.');
      }
    });
  }
  
  // Clear button (using Options button)
  const optionsBtn = document.querySelector('[aria-label="Options"]');
  if (optionsBtn) {
    optionsBtn.addEventListener('click', () => {
      if (confirm('Clear conversation history?')) {
        clearConversation();
      }
    });
  }
}

// Load welcome message
function loadWelcomeMessage() {
  const welcomeMsg = {
    role: 'bot',
    content: 'Halo DekorMate! ✨ Saya Destiny AI dari DekorIn. Saya siap membantu kamu memilih wallpaper yang sempurna untuk ruangan impian kamu! 🏠\n\nMau tanya tentang produk, hitung kebutuhan wallpaper, atau minta saran desain? Yuk chat! 💬',
    timestamp: new Date()
  };
  
  // Remove default welcome message
  const defaultWelcome = chatContainer.querySelector('.bot-message');
  if (defaultWelcome) {
    defaultWelcome.remove();
  }
  
  addMessageToUI(welcomeMsg);
}

// Send message
async function sendMessage() {
  const message = chatInput.value.trim();
  
  if (!message || isLoading) return;
  
  // Add user message to UI
  const userMsg = {
    role: 'user',
    content: message,
    timestamp: new Date()
  };
  
  addMessageToUI(userMsg);
  messageHistory.push({ role: 'user', content: message });
  
  // Clear input
  chatInput.value = '';
  chatInput.style.height = 'auto';
  
  // Show loading
  isLoading = true;
  sendBtn.disabled = true;
  showTypingIndicator();
  
  try {
    // Send to backend
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
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add bot response to UI
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

// Add message to UI
function addMessageToUI(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = message.role === 'user' ? 'user-message' : 'bot-message';
  
  if (message.role === 'bot') {
    // Bot message with logo
    const logo = document.createElement('img');
    logo.src = 'src/Home/Destinyaicolored.png';
    logo.alt = 'Destiny AI';
    messageDiv.appendChild(logo);
  }
  
  // Message content
  const contentP = document.createElement('p');
  
  // Format message content
  let formattedContent = message.content;
  
  // Handle bold text (**text**)
  formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle line breaks
  formattedContent = formattedContent.replace(/\n/g, '<br>');
  
  // Handle numbered lists
  formattedContent = formattedContent.replace(/^(\d+)\.\s/gm, '<br>$1. ');
  
  contentP.innerHTML = formattedContent;
  messageDiv.appendChild(contentP);
  
  // Add to container
  chatContainer.appendChild(messageDiv);
  
  // Scroll to bottom with smooth animation
  setTimeout(() => {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
}

// Show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'bot-message typing-indicator';
  typingDiv.id = 'typing-indicator';
  
  const logo = document.createElement('img');
  logo.src = 'src/Home/Destinyaicolored.png';
  logo.alt = 'Destiny AI';
  typingDiv.appendChild(logo);
  
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'typing-dots';
  dotsContainer.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  
  typingDiv.appendChild(dotsContainer);
  chatContainer.appendChild(typingDiv);
  
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: 'smooth'
  });
}

// Remove typing indicator
function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// Clear conversation
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
    
    // Clear UI
    chatContainer.innerHTML = '';
    messageHistory = [];
    
    // Reload welcome message
    loadWelcomeMessage();
    
  } catch (error) {
    console.error('Failed to clear conversation:', error);
  }
}

// Show error message
function showError(message) {
  const errorMsg = {
    role: 'bot',
    content: `⚠️ ${message}`,
    timestamp: new Date(),
    isError: true
  };
  
  addMessageToUI(errorMsg);
}

// Quick reply buttons (optional enhancement)
function addQuickReplies() {
  const quickReplies = [
    { text: '🏠 Lihat Katalog', message: 'Tampilkan katalog wallpaper' },
    { text: '📐 Hitung Kebutuhan', message: 'Hitung wallpaper untuk ruangan 5x4 meter tinggi 3 meter' },
    { text: '🎨 Saran Desain', message: 'Rekomendasikan wallpaper untuk kamar tidur minimalis' },
    { text: '💰 Info Harga', message: 'Berapa harga wallpaper di DekorIn?' }
  ];
  
  const quickReplyDiv = document.createElement('div');
  quickReplyDiv.className = 'quick-replies';
  quickReplyDiv.style.cssText = `
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
    flex-wrap: wrap;
  `;
  
  quickReplies.forEach(reply => {
    const button = document.createElement('button');
    button.textContent = reply.text;
    button.style.cssText = `
      background: linear-gradient(90deg, #2a4c27, #47ab4a);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      cursor: pointer;
      white-space: nowrap;
      transition: transform 0.2s;
    `;
    
    button.addEventListener('click', () => {
      chatInput.value = reply.message;
      sendMessage();
      quickReplyDiv.remove();
    });
    
    button.addEventListener('mousedown', () => {
      button.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', () => {
      button.style.transform = 'scale(1)';
    });
    
    quickReplyDiv.appendChild(button);
  });
  
  // Add after welcome message if no messages yet
  if (messageHistory.length === 0) {
    chatContainer.appendChild(quickReplyDiv);
  }
}

// Call quick replies on load
setTimeout(() => {
  addQuickReplies();
}, 1000);

// Utility: Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

// Export for debugging
window.destinyAI = {
  sendMessage,
  clearConversation,
  checkServerStatus,
  messageHistory
};

console.log('💬 Destiny AI ready! Type a message to start chatting.');
console.log('🔧 Debug commands: window.destinyAI.checkServerStatus(), window.destinyAI.clearConversation()');