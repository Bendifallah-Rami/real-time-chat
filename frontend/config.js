// Configuration for different environments
const config = {
    development: {
        wsUrl: 'ws://localhost:8080',
        apiUrl: 'http://localhost:8080'
    },
    production: {
        // Replace this with your actual deployed backend URL
        wsUrl: 'wss://your-backend-url.onrender.com',
        apiUrl: 'https://your-backend-url.onrender.com'
    }
};

// Auto-detect environment - Force development for local file access
const isProduction = window.location.protocol === 'https:' && 
                    window.location.hostname !== 'localhost' &&
                    window.location.hostname !== '127.0.0.1' &&
                    !window.location.protocol.startsWith('file:');

console.log('🔧 Environment Detection:', {
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    isProduction: isProduction
});

const currentConfig = config[isProduction ? 'production' : 'development'];

console.log('🚀 Using config:', currentConfig);

// Export for use in other files
window.APP_CONFIG = currentConfig;
