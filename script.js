// script.js - For the home page

// --- Configuration ---
// Using DeepSeek API
const API_KEY = "sk-3fd9332a84e84d1a98220ea099481ceb";
// DeepSeek API endpoint
const API_URL = "https://api.deepseek.com/chat/completions";

// --- DOM Elements ---
const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('#send-btn');
const chatbox = document.querySelector('.chatbox');

// --- Conversation History ---
let conversationHistory = [
    {
        role: "system",
        content: "You are a helpful travel assistant for Cathay Pacific. Only answer questions related to airlines, destination information, travel suggestions, and flight information. Politely decline to answer any queries outside these topics. Keep responses concise and helpful."
    }
];

// --- Initialize with welcome message ---
window.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = "Welcome to Cathay AI Assistance! I'm your AI travel assistant. I can help you with flight information, destination details, travel suggestions, and anything else related to your journey. How can I assist you today?";
    chatbox.appendChild(createChatLi(welcomeMessage, 'chat-incoming'));
    
    // Add the welcome message to conversation history
    conversationHistory.push({
        role: "assistant",
        content: welcomeMessage
    });
});

// --- Core Functions ---
// Creates a message element and adds it to the chatbox
const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);
    const paragraph = document.createElement('p');
    
    // Check if message is for typing indicator
    if (message === 'typing') {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        paragraph.appendChild(typingDiv);
    } else {
        paragraph.textContent = message;
    }
    
    chatLi.appendChild(paragraph);
    return chatLi;
};

// Handles the process of getting a response from the AI
const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector('p');

    // Define the API request options for DeepSeek
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: conversationHistory,
            max_tokens: 500,
            temperature: 0.7,
            stream: false
        })
    };

    // Send the request to the API
    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Invalid API key. Please check your DeepSeek API key.');
                } else if (res.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again later.');
                } else {
                    throw new Error(`API error: ${res.status} ${res.statusText}`);
                }
            }
            return res.json();
        })
        .then(data => {
            // Remove typing indicator
            messageElement.innerHTML = '';
            
            // Display the AI's response
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const assistantMessage = data.choices[0].message.content.trim();
                messageElement.textContent = assistantMessage;
                
                // Add assistant's response to conversation history
                conversationHistory.push({
                    role: "assistant",
                    content: assistantMessage
                });
            } else {
                throw new Error('Unexpected response format from API');
            }
        })
        .catch((error) => {
            // Display an error message
            console.error('Error:', error);
            messageElement.innerHTML = '';
            messageElement.classList.add('error');
            messageElement.textContent = `Error: ${error.message}`;
        })
        .finally(() => {
            // Always scroll to the bottom after processing
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
};

// Main function to handle sending a message
const handleChat = () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Clear the input field immediately
    chatInput.value = '';

    // Add the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, 'chat-outgoing'));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Add user message to conversation history
    conversationHistory.push({
        role: "user",
        content: userMessage
    });

    // Show "Thinking..." with typing indicator before the AI responds
    setTimeout(() => {
        const incomingChatLi = createChatLi('typing', 'chat-incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

// Auto-resize textarea
chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// --- Event Listeners ---
sendChatBtn.addEventListener('click', handleChat);

// Allow sending a message by pressing Enter (but not Shift+Enter)
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

// Update flight status based on current time
function updateFlightStatus() {
    const now = new Date();
    const boardingTime = new Date();
    boardingTime.setHours(13, 45, 0); // 13:45 boarding time
    
    const statusElement = document.querySelector('.status-indicator');
    if (statusElement) {
        if (now > boardingTime) {
            statusElement.textContent = 'Boarding';
            statusElement.className = 'status-indicator boarding';
        } else {
            statusElement.textContent = 'On Time';
            statusElement.className = 'status-indicator on-time';
        }
    }
}

// Initialize flight status
document.addEventListener('DOMContentLoaded', updateFlightStatus);