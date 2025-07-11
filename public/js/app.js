// Main application JavaScript
class StaticWebsiteApp {
    constructor() {
        this.clientInfoElement = document.getElementById('client-info');
        this.init();
    }

    async init() {
        console.log('🚀 Static Website App initialized');
        this.setupEventListeners();
        await this.loadClientInfo();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Add click event listeners to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                this.animateCard(card);
            });
        });

        // Add hover effects to feature list items
        const featureListItems = document.querySelectorAll('.feature-list li');
        featureListItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addPulseEffect(item);
            });
        });
    }

    async loadClientInfo() {
        try {
            const response = await fetch('/api/client-info');
            const clientData = await response.json();
            this.displayClientInfo(clientData);
        } catch (error) {
            console.error('Error loading client info:', error);
            this.displayError('Failed to load client information');
        }
    }

    displayClientInfo(clientData) {
        const infoHTML = `
            <div class="client-info-item">
                <span class="client-info-label">🌐 IP Address:</span>
                <span class="client-info-value">${clientData.ip || 'Unknown'}</span>
            </div>
            <div class="client-info-item">
                <span class="client-info-label">⏰ Timestamp:</span>
                <span class="client-info-value">${new Date(clientData.timestamp).toLocaleString()}</span>
            </div>
            <div class="client-info-item">
                <span class="client-info-label">👤 User Agent:</span>
                <span class="client-info-value">${this.truncateUserAgent(clientData.userAgent)}</span>
            </div>
            <div class="client-info-item">
                <span class="client-info-label">📱 Screen Size:</span>
                <span class="client-info-value">${window.innerWidth} × ${window.innerHeight}</span>
            </div>
            <div class="client-info-item">
                <span class="client-info-label">🌍 Language:</span>
                <span class="client-info-value">${navigator.language || 'Unknown'}</span>
            </div>
            <div class="client-info-item">
                <span class="client-info-label">🔗 Protocol:</span>
                <span class="client-info-value">${window.location.protocol}</span>
            </div>
        `;
        
        this.clientInfoElement.innerHTML = infoHTML;
        this.addFadeInEffect(this.clientInfoElement);
    }

    displayError(message) {
        this.clientInfoElement.innerHTML = `
            <div class="client-info-item">
                <span class="client-info-label">❌ Error:</span>
                <span class="client-info-value">${message}</span>
            </div>
        `;
    }

    truncateUserAgent(userAgent) {
        if (!userAgent) return 'Unknown';
        return userAgent.length > 50 ? userAgent.substring(0, 50) + '...' : userAgent;
    }

    setupAnimations() {
        // Add intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections for scroll animations
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    animateCard(card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);
    }

    addPulseEffect(element) {
        element.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    }

    addFadeInEffect(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }

    // Utility method to format bytes
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Add CSS for pulse animation
const pulseCSS = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = pulseCSS;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StaticWebsiteApp();
});

// add style files dynamically with random query params
const style3 = document.createElement('link');
style3.rel = 'stylesheet';
style3.href = '/files/css/style.css?v=' + Math.random();
document.head.appendChild(style3);
const style2 = document.createElement('link');
style2.rel = 'stylesheet';
style2.href = '/files/css/animations.css?v=' + Math.random();
document.head.appendChild(style2);

// Add some console logging for debugging
console.log('📄 Static Website JavaScript loaded');
console.log('🌐 Current URL:', window.location.href);
console.log('📱 Screen size:', window.innerWidth, '×', window.innerHeight); 