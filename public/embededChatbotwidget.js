(function () {
    'use strict';

    // Configuration
    const WIDGET_CONFIG = {
        baseUrl: 'https://www.app.ecosysteme.ai', // Your deployed URL
        defaultWidth: '420px',
        defaultHeight: '600px',
        mobileWidth: '90%',
        mobileHeight: 'calc(100vh - 100px)',
        borderRadius: '10px',
        zIndex: '1000'
    };

    // Widget state
    let widgetState = {
        isOpen: false,
        iframe: null,
        toggleButton: null,
        agentId: null
    };

    // Utility functions
    const isMobile = () => window.innerWidth < 768;

    const getWidgetDimensions = () => {
        if (isMobile()) {
            return {
                width: WIDGET_CONFIG.mobileWidth,
                height: WIDGET_CONFIG.mobileHeight
            };
        }
        return {
            width: WIDGET_CONFIG.defaultWidth,
            height: WIDGET_CONFIG.defaultHeight
        };
    };

    const createToggleButton = () => {
        const button = document.createElement('div');
        button.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: #3b82f6;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                z-index: ${WIDGET_CONFIG.zIndex};
                transition: all 0.3s ease;
            ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
            </div>
        `;

        button.addEventListener('click', toggleWidget);
        return button;
    };

    const createIframe = () => {
        const iframe = document.createElement('iframe');
        const dimensions = getWidgetDimensions();
        iframe.src = `${WIDGET_CONFIG.baseUrl}/embededChatbot?id=${widgetState.agentId}`;
        iframe.style.cssText = `
    position: fixed;
    bottom: ${isMobile() ? '90px' : '90px'};
    right: ${isMobile() ? '5%' : '20px'};
    width: ${dimensions.width};
    height: ${dimensions.height};
    border: none;
    border-radius: ${WIDGET_CONFIG.borderRadius};
    z-index: ${parseInt(WIDGET_CONFIG.zIndex) + 1};
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
`;


        // Add fade-in animation
        setTimeout(() => {
            iframe.style.opacity = '1';
            iframe.style.transform = 'translateY(0)';
        }, 100);

        return iframe;
    };

    const showWidget = () => {
        if (widgetState.iframe) return;

        widgetState.iframe = createIframe();
        document.body.appendChild(widgetState.iframe);
        widgetState.isOpen = true;

        // Hide toggle button when widget is open
        if (widgetState.toggleButton) {
            widgetState.toggleButton.style.display = 'none';
        }
    };

    const hideWidget = () => {
        if (!widgetState.iframe) return;

        widgetState.iframe.style.opacity = '0';
        widgetState.iframe.style.transform = 'translateY(20px)';

        setTimeout(() => {
            if (widgetState.iframe && widgetState.iframe.parentNode) {
                widgetState.iframe.parentNode.removeChild(widgetState.iframe);
            }
            widgetState.iframe = null;
            widgetState.isOpen = false;

            // Show toggle button again
            if (widgetState.toggleButton) {
                widgetState.toggleButton.style.display = 'flex';
            }
        }, 300);
    };

    const toggleWidget = () => {
        if (widgetState.isOpen) {
            hideWidget();
        } else {
            showWidget();
        }
    };

    // Handle window resize
    const handleResize = () => {
        if (widgetState.iframe && widgetState.isOpen) {
            const dimensions = getWidgetDimensions();
            widgetState.iframe.style.width = dimensions.width;
            widgetState.iframe.style.height = dimensions.height;
        }
    };

    // Initialize widget
    const init = (agentId) => {
        if (!agentId) {
            console.error('Chatbot Widget: Agent ID is required');
            return;
        }

        widgetState.agentId = agentId;

        // Create toggle button
        widgetState.toggleButton = createToggleButton();
        document.body.appendChild(widgetState.toggleButton);

        // Add event listeners
        window.addEventListener('resize', handleResize);

        // Auto-show widget if specified in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('chatbot') === 'open') {
            showWidget();
        }
    };

    // Public API
    window.ChatbotWidget = {
        init: init,
        show: showWidget,
        hide: hideWidget,
        toggle: toggleWidget,
        isOpen: () => widgetState.isOpen
    };

    // Auto-initialize if script has data attributes
    document.addEventListener('DOMContentLoaded', () => {
        const script = document.querySelector('script[data-agent-id]');
        if (script) {
            const agentId = script.getAttribute('data-agent-id');
            init(agentId);
        }
    });

})();