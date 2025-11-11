// Destiny AI Frontend - DekorIn (Premium Version)
// Configuration
const API_BASE = 'http://localhost:3000';
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// DOM Elements
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const historyBtn = document.getElementById('history-btn');

// State
let isLoading = false;
let messageHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('🤖 Destiny AI Premium Initialized');
  createParticles();
  checkServerStatus();
  setupEventListeners();
  loadWelcomeMessage();
});

// Create floating particles
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

// Check if server is online
async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      console.log('✅ Server online');
    } else {
      console.warn('⚠️ Server offline');
    }
  } catch (error) {
    console.warn('⚠️ Cannot connect to server. Backend might not be running.');
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
  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      if (messageHistory.length > 0) {
        alert(`Conversation History:\n\n${messageHistory.map(m => `${m.role}: ${m.content}`).join('\n\n')}`);
      } else {
        alert('No conversation history yet.');
      }
    });
  }
  
  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
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
  
  // Add quick replies after a short delay
  setTimeout(() => {
    addQuickReplies();
  }, 600);
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
  
  // Clear input and remove quick replies
  chatInput.value = '';
  chatInput.style.height = 'auto';
  removeQuickReplies();
  
  // Show loading with typing indicator
  isLoading = true;
  sendBtn.disabled = true;
  
  // IMPORTANT: Show typing indicator immediately
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
    
    // Remove typing indicator before showing response
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
    
    // Remove typing indicator on error
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

// Show typing indicator with bouncing dots
function showTypingIndicator() {
  // Remove existing indicator first (safety check)
  removeTypingIndicator();
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.id = 'typing-indicator';
  
  // Add logo
  const logo = document.createElement('img');
  logo.src = 'src/Home/Destinyaicolored.png';
  logo.alt = 'Destiny AI';
  typingDiv.appendChild(logo);
  
  // Add animated dots container
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'typing-dots';
  
  // Create 3 bouncing dots
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dotsContainer.appendChild(dot);
  }
  
  typingDiv.appendChild(dotsContainer);
  chatContainer.appendChild(typingDiv);
  
  // Scroll to show the typing indicator
  setTimeout(() => {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }, 50);
  
  console.log('✨ Typing indicator shown');
}

// Remove typing indicator
function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
    console.log('✨ Typing indicator removed');
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

// Quick reply buttons
function addQuickReplies() {
  // Check if quick replies already exist
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
  
  // Add after welcome message if no messages yet
  if (messageHistory.length === 0) {
    chatContainer.appendChild(quickReplyDiv);
  }
}

// Remove quick replies
function removeQuickReplies() {
  const quickReplyDiv = document.querySelector('.quick-replies');
  if (quickReplyDiv) {
    quickReplyDiv.remove();
  }
}

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
  messageHistory,
  showTypingIndicator,
  removeTypingIndicator
};

console.log('💬 Destiny AI Premium ready! Type a message to start chatting.');
console.log('🔧 Debug: window.destinyAI.showTypingIndicator() to test animation');