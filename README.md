# 💬 WebSocket Chat Application

A simple, real-time chat application built with WebSocket technology to demonstrate real-time communication between multiple users.

## 🚀 Features

- **Real-time messaging** - Messages appear instantly for all connected users
- **User count display** - See how many people are currently online
- **Message history** - New users can see the last 10 messages
- **Beautiful UI** - Modern, responsive design with smooth animations
- **Connection status** - Visual indicators for connection state
- **Auto-reconnection** - Automatically tries to reconnect if connection is lost
- **Input validation** - Username and message validation
- **Cross-platform** - Works on all modern browsers

## 📁 Project Structure

```
chatwebapp/
├── backend/
│   ├── package.json          # Node.js dependencies
│   └── server.js             # WebSocket server
└── frontend/
    ├── index.html            # Main HTML file
    ├── styles.css            # CSS styling
    └── script.js             # JavaScript client logic
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- A modern web browser

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the WebSocket server:
   ```powershell
   npm start
   ```

   The server will start on `http://localhost:8080`

   **Alternative:** For development with auto-restart:
   ```powershell
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Open `index.html` in your web browser by:
   - Double-clicking the file, or
   - Using a local server (recommended for development):
     ```powershell
     # If you have Python installed:
     python -m http.server 3000
     
     # Or if you have Node.js http-server:
     npx http-server -p 3000
     ```

## 🎯 How to Use

1. **Start the backend server** (follow Backend Setup above)
2. **Open the frontend** in your web browser
3. **Enter a username** when prompted
4. **Start chatting!** Type messages and press Enter to send
5. **Open multiple browser tabs/windows** to simulate multiple users

## 🔧 Technical Details

### Backend (WebSocket Server)
- Built with Node.js and the `ws` library
- Handles WebSocket connections and message broadcasting
- Stores message history (last 50 messages in memory)
- Tracks connected users count
- Handles graceful shutdowns

### Frontend (Client)
- Pure JavaScript (no frameworks)
- Modern ES6+ features
- Responsive CSS design with Flexbox/Grid
- WebSocket API for real-time communication
- Auto-reconnection logic
- Input validation and error handling

### WebSocket Messages
The application uses JSON messages with the following types:
- `chat` - User chat messages
- `system` - System notifications
- `userCount` - Online user count updates
- `history` - Message history for new users

## 🎨 UI Features

- **Gradient backgrounds** and modern styling
- **Smooth animations** for messages and interactions
- **Responsive design** that works on mobile and desktop
- **Connection status indicators** with color coding
- **Message bubbles** styled differently for own vs. other users
- **Typing character counter** with color coding
- **Error modals** for connection issues

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to connect to server"**
   - Make sure the backend server is running (`npm start` in backend folder)
   - Check that port 8080 is not blocked by firewall

2. **Messages not appearing**
   - Check browser console for JavaScript errors
   - Ensure WebSocket connection is established (green indicator in header)

3. **Server won't start**
   - Check if port 8080 is already in use
   - Make sure Node.js and npm are installed correctly

### Browser Requirements
- Chrome 16+
- Firefox 11+
- Safari 7+
- Edge 12+

## 🔧 Development Tips

1. **Testing multiple users:**
   - Open multiple browser tabs/windows
   - Use different browsers
   - Use incognito/private browsing mode

2. **Debugging:**
   - Check browser console for client-side logs
   - Check terminal for server-side logs
   - Both client and server have detailed logging

3. **Customization:**
   - Modify `styles.css` for UI changes
   - Edit `server.js` for backend logic
   - Update `script.js` for client behavior

## 📚 Learning Objectives

This project demonstrates:
- **WebSocket basics** - Real-time bidirectional communication
- **Event-driven programming** - Handling WebSocket events
- **Client-server architecture** - Separation of concerns
- **DOM manipulation** - Dynamic UI updates
- **Error handling** - Connection failures and recovery
- **Modern JavaScript** - ES6+ features and best practices
- **Responsive design** - CSS Flexbox and modern styling

## 🚀 Next Steps

To extend this project, you could add:
- User authentication
- Private messaging
- File/image sharing
- Emoji support
- Message persistence (database)
- Typing indicators
- User avatars
- Room/channel support

## 📄 License

This project is for educational purposes. Feel free to modify and use as needed!

---

**Happy coding! 🎉**
