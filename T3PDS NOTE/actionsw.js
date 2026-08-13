// actionsw.js - Auto-generates when action is filled

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Action tool initializing...');
    
    // DOM elements
    const templateInput = document.getElementById('templateInput');
    const extractBtn = document.getElementById('extractBtn');
    const extractFeedback = document.getElementById('extractFeedback');
    const actionInput = document.getElementById('actionInput');
    const actionFeedback = document.getElementById('actionFeedback');
    const copyBtn = document.getElementById('copyBtn');
    const copyFeedback = document.getElementById('copyFeedback');

    // Store extracted fields
    let extractedData = {
        location: null,
        serialNumber: null,
        testCaseName: null,
        logUrl: null
    };
    
    // Store the generated output
    let currentOutput = '';
    let isDataExtracted = false;

    // Extract fields from template text
    function extractFields(text) {
        const fields = {
            location: null,
            serialNumber: null,
            testCaseName: null,
            logUrl: null
        };

        const locationMatch = text.match(/Location:\s*([^\n]+)/i);
        if (locationMatch && locationMatch[1]) {
            fields.location = locationMatch[1].trim();
        }

        const serialMatch = text.match(/Serial Number:\s*([^\n]+)/i);
        if (serialMatch && serialMatch[1]) {
            fields.serialNumber = serialMatch[1].trim();
        }

        const testcaseMatch = text.match(/Test Case Name:\s*([^\n]+)/i);
        if (testcaseMatch && testcaseMatch[1]) {
            fields.testCaseName = testcaseMatch[1].trim();
        }

        const logUrlMatch = text.match(/Log URL:\s*([^\n]+)/i);
        if (logUrlMatch && logUrlMatch[1]) {
            fields.logUrl = logUrlMatch[1].trim();
        }

        return fields;
    }

    // Show feedback message
    function showFeedback(element, message, type = 'success') {
        if (!element) return;
        
        element.textContent = message;
        element.className = 'feedback';
        if (type) {
            element.classList.add(type);
        }
        
        clearTimeout(element._timeout);
        element._timeout = setTimeout(() => {
            element.textContent = '';
            element.className = 'feedback';
        }, 3000);
    }

    // Generate final output with action
    function generateFinalOutput() {
        const action = actionInput.value.trim();
        
        if (!action) {
            // If no action, clear output but don't show error
            currentOutput = '';
            return;
        }

        if (!extractedData.location || !extractedData.serialNumber || 
            !extractedData.testCaseName || !extractedData.logUrl) {
            showFeedback(actionFeedback, '⚠️ Please extract fields first', 'error');
            return;
        }

        // Build the output with ONLY the fields we want
        currentOutput = `Location: ${extractedData.location}
Serial Number: ${extractedData.serialNumber}
Test Case Name: ${extractedData.testCaseName}
Log URL: ${extractedData.logUrl}

Action: ${action}`;

        console.log('✅ Auto-generated output:', currentOutput);
        showFeedback(actionFeedback, '✅ Generated! Ready to copy', 'success');
    }

    // Copy function - ONLY copies currentOutput
    function copyToClipboard() {
        console.log('📋 Copy button clicked');
        
        // Check if we have content to copy
        if (!currentOutput || currentOutput.trim() === '') {
            showFeedback(copyFeedback, '⚠️ Please enter an action', 'error');
            return;
        }

        // Use modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(currentOutput)
                .then(() => {
                    console.log('✅ Copied successfully!');
                    showFeedback(copyFeedback, '📋 Copied to clipboard!', 'success');
                })
                .catch((err) => {
                    console.error('Clipboard API error:', err);
                    fallbackCopy(currentOutput);
                });
        } else {
            fallbackCopy(currentOutput);
        }
    }

    // Fallback copy method
    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        
        try {
            textarea.focus();
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            
            const successful = document.execCommand('copy');
            console.log('Fallback copy result:', successful);
            
            if (successful) {
                showFeedback(copyFeedback, '📋 Copied to clipboard!', 'success');
            } else {
                showFeedback(copyFeedback, '❌ Failed to copy', 'error');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
            showFeedback(copyFeedback, '❌ Failed to copy', 'error');
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // Event: Extract button
    extractBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const text = templateInput.value;
        
        if (!text || text.trim().length < 5) {
            showFeedback(extractFeedback, '⚠️ Please paste valid template text', 'error');
            return;
        }
        
        const fields = extractFields(text);
        extractedData = fields;
        isDataExtracted = true;
        
        const missing = [];
        if (!fields.location) missing.push('Location');
        if (!fields.serialNumber) missing.push('Serial Number');
        if (!fields.testCaseName) missing.push('Test Case Name');
        if (!fields.logUrl) missing.push('Log URL');
        
        if (missing.length === 0) {
            showFeedback(extractFeedback, '✅ All fields extracted successfully!', 'success');
        } else {
            showFeedback(extractFeedback, `⚠️ Missing: ${missing.join(', ')}`, 'error');
        }
        
        // Auto-generate if action has value
        if (actionInput.value.trim()) {
            generateFinalOutput();
        }
    });

    // Event: Auto-generate when action input changes
    actionInput.addEventListener('input', function() {
        console.log('Action changed:', this.value);
        
        // Only generate if data is extracted
        if (isDataExtracted) {
            generateFinalOutput();
        } else {
            // If not extracted, show a hint
            if (this.value.trim()) {
                showFeedback(actionFeedback, '💡 Please extract fields first', 'error');
            } else {
                // Clear feedback if action is empty
                actionFeedback.textContent = '';
                actionFeedback.className = 'feedback';
                currentOutput = '';
            }
        }
    });

    // Also generate on Enter key
    actionInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isDataExtracted) {
                generateFinalOutput();
                showFeedback(actionFeedback, '✅ Generated!', 'success');
            }
        }
    });

    // Event: Copy button
    copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        copyToClipboard();
    });

    // Keyboard shortcut: Ctrl+Enter to extract
    templateInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            extractBtn.click();
        }
    });

    // Auto-extract on paste
    templateInput.addEventListener('paste', function() {
        setTimeout(() => {
            const text = this.value;
            if (text.includes('Location:') && text.includes('Serial Number:')) {
                extractBtn.click();
            }
        }, 200);
    });

    console.log('✅ Action tool ready!');
    console.log('💡 Type in the action field to auto-generate');
});