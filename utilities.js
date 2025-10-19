// utilities.js - Shared utility functions across all pages

// Format time display
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Format date display
function formatDate(date) {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#005D63'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        font-weight: 600;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 5000);
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if user is logged in (simplified)
function checkAuthStatus() {
    return localStorage.getItem('cathayUser') !== null;
}

// Simulate login
function simulateLogin() {
    localStorage.setItem('cathayUser', JSON.stringify({
        name: 'Cathay Pacific Member',
        tier: 'Marco Polo',
        membershipNo: 'MP123456789'
    }));
    showNotification('Welcome back!', 'success');
}

// Simulate logout
function simulateLogout() {
    localStorage.removeItem('cathayUser');
    showNotification('You have been logged out', 'info');
}

// Initialize sign in/out button functionality
function initAuthButton() {
    const signInBtn = document.querySelector('.sign-in-btn');
    if (signInBtn) {
        if (checkAuthStatus()) {
            signInBtn.textContent = 'My Account';
            signInBtn.addEventListener('click', function() {
                if (confirm('Would you like to log out?')) {
                    simulateLogout();
                    signInBtn.textContent = 'Sign In / Sign Up';
                }
            });
        } else {
            signInBtn.addEventListener('click', function() {
                simulateLogin();
                signInBtn.textContent = 'My Account';
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAuthButton();
    
    // Add subtle animation to cards on load
    const cards = document.querySelectorAll('.itinerary-card, .destination-card, .facility-item, .meal-option');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});