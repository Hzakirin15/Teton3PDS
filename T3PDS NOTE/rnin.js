// rnin.js - complete functionality for RN IN template tool

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const templateInput = document.getElementById('templateInput');
    const extractBtn = document.getElementById('extractBtn');
    const errorCodeSelect = document.getElementById('errorCodeSelect');
    const copyBtn = document.getElementById('copyTemplateBtn');
    const feedback = document.getElementById('feedback');
    const displaySerial = document.getElementById('displaySerial');
    const displayTestcase = document.getElementById('displayTestcase');
    const displayErrorCode = document.getElementById('displayErrorCode');
    const fullTemplatePreview = document.getElementById('fullTemplatePreview');

    // Make template input empty by default
    templateInput.value = '';
    fullTemplatePreview.textContent = 'Paste your template above and click "Extract"';

    // Extract serial number and test case name from template text
    function extractFields(text) {
        const fields = {
            serialNumber: null,
            testCaseName: null
        };

        // Extract Serial Number
        const serialMatch = text.match(/Serial Number:\s*([^\n]+)/i);
        if (serialMatch && serialMatch[1]) {
            fields.serialNumber = serialMatch[1].trim();
        }

        // Extract Test Case Name
        const testcaseMatch = text.match(/Test Case Name:\s*([^\n]+)/i);
        if (testcaseMatch && testcaseMatch[1]) {
            fields.testCaseName = testcaseMatch[1].trim();
        }

        return fields;
    }

    // Update the extracted fields display
    function updateExtractedFields(serial, testcase) {
        displaySerial.textContent = serial || '—';
        displayTestcase.textContent = testcase || '—';
        
        // Update display with selected error code
        const selectedError = errorCodeSelect.value;
        displayErrorCode.textContent = selectedError;
    }

    // Generate RN IN template format
    function generateRNINTemplate(serial, testcase, errorCode) {
        return `RN IN
${serial}
${testcase}
${errorCode}`;
    }

    // Show feedback message
    function showFeedback(message, type = 'success') {
        feedback.textContent = message;
        feedback.className = 'feedback-message';
        if (type) {
            feedback.classList.add(type);
        }
        
        // Auto-hide after 5 seconds
        clearTimeout(feedback._timeout);
        feedback._timeout = setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'feedback-message';
        }, 5000);
    }

    // Main extract function
    function extractAndUpdate() {
        const text = templateInput.value;
        
        if (!text || text.trim().length < 10) {
            showFeedback('⚠️ Please paste a valid template text first', 'error');
            return;
        }
        
        const fields = extractFields(text);
        
        if (fields.serialNumber && fields.testCaseName) {
            // Update extracted display
            updateExtractedFields(fields.serialNumber, fields.testCaseName);
            
            // Generate and update full template preview with RN IN format
            const rnInTemplate = generateRNINTemplate(
                fields.serialNumber,
                fields.testCaseName,
                errorCodeSelect.value
            );
            fullTemplatePreview.textContent = rnInTemplate;
            
            showFeedback(`✅ Extracted: Serial ${fields.serialNumber} · Test ${fields.testCaseName}`, 'success');
        } else {
            let missing = [];
            if (!fields.serialNumber) missing.push('Serial Number');
            if (!fields.testCaseName) missing.push('Test Case Name');
            
            showFeedback(`⚠️ Could not find: ${missing.join(' and ')}. Please check the format.`, 'error');
            
            // Still update what we found
            updateExtractedFields(fields.serialNumber, fields.testCaseName);
        }
    }

    // Copy RN IN template to clipboard
    function copyTemplate() {
        const textToCopy = fullTemplatePreview.textContent;
        
        if (!textToCopy || textToCopy.trim() === '' || textToCopy === 'Paste your template above and click "Extract"') {
            showFeedback('⚠️ Nothing to copy. Please extract fields first.', 'error');
            return;
        }
        
        // Use modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showFeedback('📋 RN IN template copied to clipboard!', 'success');
                })
                .catch((err) => {
                    console.error('Clipboard error:', err);
                    // Fallback for clipboard errors
                    fallbackCopy(textToCopy);
                });
        } else {
            // Fallback for older browsers
            fallbackCopy(textToCopy);
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
        textarea.style.width = '1px';
        textarea.style.height = '1px';
        document.body.appendChild(textarea);
        
        try {
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            const success = document.execCommand('copy');
            if (success) {
                showFeedback('📋 RN IN template copied to clipboard!', 'success');
            } else {
                showFeedback('❌ Failed to copy. Please select and copy manually.', 'error');
            }
        } catch (err) {
            console.error('Copy error:', err);
            showFeedback('❌ Failed to copy. Please select and copy manually.', 'error');
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // Event: Extract button click
    if (extractBtn) {
        extractBtn.addEventListener('click', function(e) {
            e.preventDefault();
            extractAndUpdate();
        });
    }

    // Event: Error code selection change
    if (errorCodeSelect) {
        errorCodeSelect.addEventListener('change', function() {
            // Update displayed error code
            displayErrorCode.textContent = this.value;
            
            // Update the template preview with new error code
            const serial = displaySerial.textContent;
            const testcase = displayTestcase.textContent;
            
            if (serial && serial !== '—' && testcase && testcase !== '—') {
                const rnInTemplate = generateRNINTemplate(serial, testcase, this.value);
                fullTemplatePreview.textContent = rnInTemplate;
                showFeedback(`🔄 Error code updated to ${this.value}`, 'success');
            }
        });
    }

    // Event: Copy button click
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            copyTemplate();
        });
    }

    // Event: Keyboard shortcut Ctrl+Enter to extract
    if (templateInput) {
        templateInput.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                extractAndUpdate();
            }
        });

        // Auto-extract on paste (optional, but helpful)
        templateInput.addEventListener('paste', function(e) {
            // Wait for paste to complete
            setTimeout(() => {
                // Only auto-extract if content looks like template
                const text = this.value;
                if (text.includes('Serial Number:') && text.includes('Test Case Name:')) {
                    extractAndUpdate();
                }
            }, 200);
        });

        // Handle empty state
        templateInput.addEventListener('input', function() {
            const text = this.value;
            if (!text || text.trim() === '') {
                displaySerial.textContent = '—';
                displayTestcase.textContent = '—';
                fullTemplatePreview.textContent = 'Paste your template above and click "Extract"';
            }
        });
    }

    console.log('✅ RN IN tool ready!');
    console.log('💡 Tip: Press Ctrl+Enter to extract fields');
    console.log('📋 Copy will generate: RN IN + Serial + Test Case + Error Code');
});