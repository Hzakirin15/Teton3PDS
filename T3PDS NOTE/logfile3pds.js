// logfile3pds.js - Teton Shortcut Link Manager
// Handles SN input, link generation, Enter key, and Open button actions

(function() {
    // Configuration object (JSON-like structure for endpoints)
    const TETON_CONFIG = {
        teton3pds: {
            baseUrl: "http://10.251.228.120:9882/node/",
            apiParam: "http%3A%2F%2F10.251.228.139",
            displayType: "full",
            projectId: "4"
        },
        teton2: {
            baseUrl: "http://10.251.228.120:9882/node/",
            apiParam: "http%3A%2F%2F10.251.228.149",
            displayType: "full",
            projectId: "4"
        }
    };

    // Helper function: build full URL for Teton3PDS
    function buildTeton3Url(sn) {
        if (!sn || sn.trim() === "") return null;
        const cleanSn = sn.trim();
        const config = TETON_CONFIG.teton3pds;
        return `${config.baseUrl}${cleanSn}?api=${config.apiParam}&display_type=${config.displayType}&project_id=${config.projectId}`;
    }

    // Helper function: build full URL for Teton2
    function buildTeton2Url(sn) {
        if (!sn || sn.trim() === "") return null;
        const cleanSn = sn.trim();
        const config = TETON_CONFIG.teton2;
        return `${config.baseUrl}${cleanSn}?api=${config.apiParam}&display_type=${config.displayType}&project_id=${config.projectId}`;
    }

    // DOM Elements
    const snTeton3Input = document.getElementById('snTeton3');
    const openTeton3Btn = document.getElementById('openTeton3Btn');
    const snTeton2Input = document.getElementById('snTeton2');
    const openTeton2Btn = document.getElementById('openTeton2Btn');

    // Store current generated URLs
    let currentTeton3Url = null;
    let currentTeton2Url = null;

    // Update button state (enable/disable based on valid URL)
    function updateButtonState() {
        if (openTeton3Btn) {
            openTeton3Btn.disabled = !currentTeton3Url;
        }
        if (openTeton2Btn) {
            openTeton2Btn.disabled = !currentTeton2Url;
        }
    }

    // Handle Teton3PDS input change/Enter
    function handleTeton3Input() {
        const sn = snTeton3Input.value;
        if (sn && sn.trim() !== "") {
            currentTeton3Url = buildTeton3Url(sn);
        } else {
            currentTeton3Url = null;
        }
        updateButtonState();
    }

    // Handle Teton2 input change/Enter
    function handleTeton2Input() {
        const sn = snTeton2Input.value;
        if (sn && sn.trim() !== "") {
            currentTeton2Url = buildTeton2Url(sn);
        } else {
            currentTeton2Url = null;
        }
        updateButtonState();
    }

    // Open Teton3 link in new window
    function openTeton3Link() {
        if (currentTeton3Url) {
            window.open(currentTeton3Url, '_blank', 'noopener,noreferrer');
        } else {
            // Optional: subtle feedback if no SN entered
            if (snTeton3Input.value.trim() === "") {
                snTeton3Input.style.borderColor = "#f59e0b";
                snTeton3Input.style.backgroundColor = "#fffbeb";
                setTimeout(() => {
                    snTeton3Input.style.borderColor = "#e2e8f0";
                    snTeton3Input.style.backgroundColor = "#ffffff";
                }, 1000);
            }
        }
    }

    // Open Teton2 link in new window
    function openTeton2Link() {
        if (currentTeton2Url) {
            window.open(currentTeton2Url, '_blank', 'noopener,noreferrer');
        } else {
            if (snTeton2Input.value.trim() === "") {
                snTeton2Input.style.borderColor = "#f59e0b";
                snTeton2Input.style.backgroundColor = "#fffbeb";
                setTimeout(() => {
                    snTeton2Input.style.borderColor = "#e2e8f0";
                    snTeton2Input.style.backgroundColor = "#ffffff";
                }, 1000);
            }
        }
    }

    // Event Listeners for Teton3
    if (snTeton3Input) {
        snTeton3Input.addEventListener('input', handleTeton3Input);
        snTeton3Input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleTeton3Input();
                if (currentTeton3Url) {
                    openTeton3Link();
                } else if (snTeton3Input.value.trim() !== "") {
                    // If SN exists but somehow URL not built (edge case), try direct build
                    const directUrl = buildTeton3Url(snTeton3Input.value);
                    if (directUrl) {
                        currentTeton3Url = directUrl;
                        updateButtonState();
                        openTeton3Link();
                    }
                }
            }
        });
    }

    if (openTeton3Btn) {
        openTeton3Btn.addEventListener('click', openTeton3Link);
    }

    // Event Listeners for Teton2
    if (snTeton2Input) {
        snTeton2Input.addEventListener('input', handleTeton2Input);
        snTeton2Input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleTeton2Input();
                if (currentTeton2Url) {
                    openTeton2Link();
                } else if (snTeton2Input.value.trim() !== "") {
                    const directUrl = buildTeton2Url(snTeton2Input.value);
                    if (directUrl) {
                        currentTeton2Url = directUrl;
                        updateButtonState();
                        openTeton2Link();
                    }
                }
            }
        });
    }

    if (openTeton2Btn) {
        openTeton2Btn.addEventListener('click', openTeton2Link);
    }

    // Initialize button states (disabled by default, no SN yet)
    updateButtonState();

    // Optional: Example JSON data structure for future expansion (embedded config)
    // This demonstrates the requested JSON aspect (config as JSON object)
    const systemConfig = {
        "applications": [
            {
                "name": "Teton3PDS",
                "baseEndpoint": "http://10.251.228.120:9882/node/",
                "apiGateway": "http://10.251.228.139",
                "project": 4,
                "displayMode": "full"
            },
            {
                "name": "Teton2",
                "baseEndpoint": "http://10.251.228.120:9882/node/",
                "apiGateway": "http://10.251.228.149",
                "project": 4,
                "displayMode": "full"
            }
        ],
        "settings": {
            "openInNewTab": true,
            "enableKeyboardShortcut": true
        }
    };

    // Log config to console for debugging (optional, shows JSON integration)
    console.log("Teton Shortcut App initialized with config:", systemConfig);

    // Small UX enhancement: clear warning on focus
    const inputs = [snTeton3Input, snTeton2Input];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                this.style.borderColor = "#e2e8f0";
                this.style.backgroundColor = "#ffffff";
            });
        }
    });

    // Additional feature: trim SN on blur to avoid accidental spaces
    if (snTeton3Input) {
        snTeton3Input.addEventListener('blur', function() {
            if (this.value.trim() !== this.value) {
                this.value = this.value.trim();
                handleTeton3Input();
            }
        });
    }

    if (snTeton2Input) {
        snTeton2Input.addEventListener('blur', function() {
            if (this.value.trim() !== this.value) {
                this.value = this.value.trim();
                handleTeton2Input();
            }
        });
    }
})();