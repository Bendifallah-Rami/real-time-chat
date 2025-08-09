class ChatApp {
    constructor() {
        this.ws = null;
        this.username = '';
        this.isConnected = false;
        this.messageHistory = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        
        this.initializeElements();
        this.setupEventListeners();
        this.connectWebSocket();
    }
    
    initializeElements() {
        // DOM elements
        this.usernameSetup = document.getElementById('usernameSetup');
        this.chatInterface = document.getElementById('chatInterface');
        this.usernameInput = document.getElementById('usernameInput');
        this.joinChatBtn = document.getElementById('joinChatBtn');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.userCount = document.getElementById('userCount');
        this.charCount = document.getElementById('charCount');
        this.errorModal = document.getElementById('errorModal');
        this.errorMessage = document.getElementById('errorMessage');
        this.retryBtn = document.getElementById('retryBtn');
    }
    
    setupEventListeners() {
        // Username setup
        this.joinChatBtn.addEventListener('click', () => this.joinChat());
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinChat();
        });
        
        // Message sending
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Character count
        this.messageInput.addEventListener('input', () => {
            const length = this.messageInput.value.length;
            this.charCount.textContent = `${length}/500`;
            
            if (length > 450) {
                this.charCount.style.color = '#ef4444';
            } else if (length > 400) {
                this.charCount.style.color = '#f59e0b';
            } else {
                this.charCount.style.color = '#94a3b8';
            }
        });
        
        // Retry connection
        this.retryBtn.addEventListener('click', () => {
            this.hideErrorModal();
            this.connectWebSocket();
        });
        
        // Auto-focus inputs
        this.usernameInput.focus();
    }
    
    connectWebSocket() {
        // Use configuration-based WebSocket URL
        const wsUrl = window.APP_CONFIG.wsUrl;
        console.log('🔌 Attempting to connect to:', wsUrl);
        
        try {
            this.updateConnectionStatus('connecting', 'Connecting...');
            this.ws = new WebSocket(wsUrl);
            console.log('✅ WebSocket object created successfully');
            
            this.ws.onopen = () => {
                console.log('✅ Connected to WebSocket server');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.updateConnectionStatus('connected', 'Connected');
                this.hideErrorModal();
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('❌ Error parsing message:', error);
                }
            };
            
            this.ws.onclose = (event) => {
                console.log('🔌 WebSocket connection closed:', event.code, event.reason);
                this.isConnected = false;
                this.updateConnectionStatus('disconnected', 'Disconnected');
                
                if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                    setTimeout(() => {
                        this.reconnectAttempts++;
                        console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                        this.connectWebSocket();
                    }, 2000 * this.reconnectAttempts);
                } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    this.showErrorModal('Connection lost. Please refresh the page or click retry.');
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.isConnected = false;
                this.updateConnectionStatus('disconnected', 'Connection Error');
                this.showErrorModal('Failed to connect to the chat server. Please make sure the server is running.');
            };
            
        } catch (error) {
            console.error('❌ Failed to create WebSocket connection:', error);
            this.showErrorModal('Failed to establish WebSocket connection.');
        }
    }
    
    handleMessage(data) {
        console.log('📨 Received message:', data);
        
        switch (data.type) {
            case 'system':
                this.addSystemMessage(data.message);
                break;
                
            case 'chat':
                this.addChatMessage(data);
                break;
                
            case 'userCount':
                this.updateUserCount(data.count);
                break;
                
            case 'history':
                this.loadMessageHistory(data.messages);
                break;
                
            default:
                console.log('Unknown message type:', data.type);
        }
    }
    
    joinChat() {
        const username = this.usernameInput.value.trim();
        
        if (!username) {
            this.showInputError(this.usernameInput, 'Please enter a username');
            return;
        }
        
        if (username.length < 2) {
            this.showInputError(this.usernameInput, 'Username must be at least 2 characters');
            return;
        }
        
        if (!this.isConnected) {
            this.showInputError(this.usernameInput, 'Not connected to server');
            return;
        }
        
        this.username = username;
        this.usernameSetup.style.display = 'none';
        this.chatInterface.style.display = 'flex';
        this.messageInput.focus();
        
        // Send join notification
        this.addSystemMessage(`Welcome, ${this.username}! You've joined the chat.`);
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message || !this.isConnected || !this.username) {
            return;
        }
        
        const messageData = {
            type: 'chat',
            username: this.username,
            message: message
        };
        
        try {
            this.ws.send(JSON.stringify(messageData));
            this.messageInput.value = '';
            this.charCount.textContent = '0/500';
            this.charCount.style.color = '#94a3b8';
        } catch (error) {
            console.error('❌ Failed to send message:', error);
            this.addSystemMessage('Failed to send message. Please try again.');
        }
    }
    
    addChatMessage(data) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${data.username === this.username ? 'own' : 'other'}`;
        
        const time = new Date(data.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageElement.innerHTML = `
            <div class="message-bubble">
                <div class="message-header">${this.escapeHtml(data.username)}</div>
                <div class="message-text">${this.escapeHtml(data.message)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.removeWelcomeMessage();
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    addSystemMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'system-message';
        messageElement.textContent = message;
        
        this.removeWelcomeMessage();
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    loadMessageHistory(messages) {
        messages.forEach(message => {
            if (message.type === 'chat') {
                this.addChatMessage(message);
            }
        });
    }
    
    removeWelcomeMessage() {
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
    }
    
    scrollToBottom() {
        // Use multiple approaches to ensure reliable scrolling
        const container = this.messagesContainer;
        
        // Immediate scroll
        container.scrollTop = container.scrollHeight;
        
        // Delayed scroll to handle dynamic content
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 10);
        
        // Additional scroll for very dynamic content
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
    
    updateConnectionStatus(status, text) {
        this.connectionStatus.textContent = text;
        this.statusIndicator.className = `status-indicator ${status}`;
        
        // Update send button state
        if (this.sendBtn) {
            this.sendBtn.disabled = status !== 'connected';
        }
    }
    
    updateUserCount(count) {
        this.userCount.textContent = count;
    }
    
    showErrorModal(message) {
        this.errorMessage.textContent = message;
        this.errorModal.style.display = 'flex';
    }
    
    hideErrorModal() {
        this.errorModal.style.display = 'none';
    }
    
    showInputError(input, message) {
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        // Create error message element
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 12px;
                margin-top: 4px;
                animation: slideIn 0.3s ease-out;
            `;
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        
        // Clear error after 3 seconds
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
            if (errorElement) {
                errorElement.remove();
            }
        }, 3000);
        
        input.focus();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the chat app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Chat App...');
    
    // Check if WebSocket is supported
    if (!window.WebSocket) {
        alert('Your browser does not support WebSocket. Please use a modern browser.');
        return;
    }
    
    // Create chat app instance
    window.chatApp = new ChatApp();
    
    // Add some helpful console messages
    console.log('💡 Chat App initialized!');
    console.log('📝 Tips:');
    console.log('  - Enter a username to join the chat');
    console.log('  - Type messages and press Enter to send');
    console.log('  - All connected users will see your messages in real-time');
    console.log('  - Connection status is shown in the header');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.chatApp) {
        // Check connection when page becomes visible
        if (!window.chatApp.isConnected) {
            console.log('🔄 Page became visible, checking connection...');
            window.chatApp.connectWebSocket();
        }
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.chatApp && window.chatApp.ws) {
        window.chatApp.ws.close(1000, 'Page unload');
    }
});
