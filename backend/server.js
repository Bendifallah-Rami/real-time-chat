const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// Store chat messages for new users
const messageHistory = [];

console.log('🚀 WebSocket Chat Server Starting...');

wss.on('connection', (ws, req) => {
    console.log('👤 New client connected');
    
    // Add client to the set
    clients.add(ws);
    
    // Send connection confirmation
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Connected to chat server!',
        timestamp: new Date().toISOString(),
        clientCount: clients.size
    }));
    
    // Send recent message history to new user
    if (messageHistory.length > 0) {
        ws.send(JSON.stringify({
            type: 'history',
            messages: messageHistory.slice(-10) // Send last 10 messages
        }));
    }
    
    // Broadcast user count update to all clients
    broadcastUserCount();
    
    // Handle incoming messages
    ws.on('message', (data) => {
        try {
            const messageData = JSON.parse(data);
            console.log('📨 Received:', messageData);
            
            if (messageData.type === 'chat') {
                const chatMessage = {
                    type: 'chat',
                    username: messageData.username || 'Anonymous',
                    message: messageData.message,
                    timestamp: new Date().toISOString(),
                    id: Date.now() + Math.random()
                };
                
                // Add to message history
                messageHistory.push(chatMessage);
                
                // Keep only last 50 messages in memory
                if (messageHistory.length > 50) {
                    messageHistory.shift();
                }
                
                // Broadcast message to all connected clients
                broadcastMessage(chatMessage);
            }
        } catch (error) {
            console.error('❌ Error parsing message:', error);
        }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
        console.log('👋 Client disconnected');
        clients.delete(ws);
        broadcastUserCount();
    });
    
    // Handle WebSocket errors
    ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
        clients.delete(ws);
    });
});

// Function to broadcast message to all clients
function broadcastMessage(message) {
    const messageString = JSON.stringify(message);
    
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageString);
        }
    });
    
    console.log(`📢 Broadcasted message to ${clients.size} clients`);
}

// Function to broadcast user count update
function broadcastUserCount() {
    const userCountMessage = JSON.stringify({
        type: 'userCount',
        count: clients.size,
        timestamp: new Date().toISOString()
    });
    
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(userCountMessage);
        }
    });
}

// Start the server
const PORT = process.env.PORT || 8080;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎯 WebSocket server is running on port ${PORT}`);
    console.log(`📡 WebSocket URL: ws://localhost:${PORT}`);
    console.log('💬 Ready to accept chat connections!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
