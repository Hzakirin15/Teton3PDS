// rnin.js - complete functionality for RN IN template tool (background mode)

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements - only the ones we need visible
    const templateInput = document.getElementById('templateInput');
    const extractBtn = document.getElementById('extractBtn');
    const errorCodeSelect = document.getElementById('errorCodeSelect');
    const copyBtn = document.getElementById('copyTemplateBtn');
    const feedback = document.getElementById('feedback');

    // Hidden elements for background processing (created dynamically)
    let displaySerial = document.createElement('span');
    let displayTestcase = document.createElement('span');
    let displayErrorCode = document.createElement('span');
    let fullTemplatePreview = document.createElement('pre');

    // Set initial values
    displaySerial.textContent = '';
    displayTestcase.textContent = '';
    displayErrorCode.textContent = 'PXE-020';
    fullTemplatePreview.textContent = '';

    console.log('Element check:', {
        templateInput: !!templateInput,
        extractBtn: !!extractBtn,
        errorCodeSelect: !!errorCodeSelect,
        copyBtn: !!copyBtn,
        feedback: !!feedback
    });

    // Make template input empty by default
    if (templateInput) {
        templateInput.value = '';
    }

    // Extract serial number and test case name from template text
    function extractFields(text) {
        const fields = {
            serialNumber: null,
            testCaseName: null
        };

        // Extract Serial Number
        let serialMatch = text.match(/Serial Number:\s*([^\n]+)/i);
        if (!serialMatch) {
            serialMatch = text.match(/Serial\s*Number:\s*([^\n]+)/i);
        }
        if (serialMatch && serialMatch[1]) {
            fields.serialNumber = serialMatch[1].trim();
        }

        // Extract Test Case Name
        let testcaseMatch = text.match(/Test Case Name:\s*([^\n]+)/i);
        if (!testcaseMatch) {
            testcaseMatch = text.match(/Test\s*Case\s*Name:\s*([^\n]+)/i);
        }
        if (!testcaseMatch) {
            testcaseMatch = text.match(/Testcase\s*Name:\s*([^\n]+)/i);
        }
        if (testcaseMatch && testcaseMatch[1]) {
            fields.testCaseName = testcaseMatch[1].trim();
        }

        return fields;
    }

    // Update the extracted fields (background)
    function updateExtractedFields(serial, testcase) {
        displaySerial.textContent = serial || '';
        displayTestcase.textContent = testcase || '';
        
        if (errorCodeSelect) {
            displayErrorCode.textContent = errorCodeSelect.value;
        }
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
        if (!feedback) return;
        
        feedback.textContent = message;
        feedback.className = 'feedback-message';
        if (type) {
            feedback.classList.add(type);
        }
        
        clearTimeout(feedback._timeout);
        feedback._timeout = setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'feedback-message';
        }, 5000);
    }

    // Main extract function
    function extractAndUpdate() {
        if (!templateInput) {
            console.error('Template input not found');
            return;
        }
        
        const text = templateInput.value;
        
        if (!text || text.trim().length < 10) {
            showFeedback('⚠️ Please paste a valid template text first', 'error');
            return;
        }
        
        const fields = extractFields(text);
        
        if (fields.serialNumber && fields.testCaseName) {
            updateExtractedFields(fields.serialNumber, fields.testCaseName);
            
            if (errorCodeSelect) {
                const rnInTemplate = generateRNINTemplate(
                    fields.serialNumber,
                    fields.testCaseName,
                    errorCodeSelect.value
                );
                fullTemplatePreview.textContent = rnInTemplate;
            }
            
            showFeedback(`✅ Extracted: Serial ${fields.serialNumber} · Test ${fields.testCaseName}`, 'success');
        } else {
            let missing = [];
            if (!fields.serialNumber) missing.push('Serial Number');
            if (!fields.testCaseName) missing.push('Test Case Name');
            
            showFeedback(`⚠️ Could not find: ${missing.join(' and ')}. Please check the format.`, 'error');
            updateExtractedFields(fields.serialNumber, fields.testCaseName);
        }
    }

    // Copy function
    function copyTemplate() {
        console.log('Copy function called');
        
        const textToCopy = fullTemplatePreview.textContent;
        console.log('Text to copy:', textToCopy);
        
        if (!textToCopy || textToCopy.trim() === '') {
            showFeedback('⚠️ Nothing to copy. Please extract fields first.', 'error');
            return;
        }

        // Use modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    console.log('Copy successful using clipboard API');
                    showFeedback('📋 RN IN template copied to clipboard!', 'success');
                })
                .catch(err => {
                    console.warn('Clipboard API failed, trying fallback:', err);
                    fallbackCopy(textToCopy);
                });
        } else {
            fallbackCopy(textToCopy);
        }
    }

    // Fallback copy method
    function fallbackCopy(text) {
        console.log('Using fallback copy method');
        
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
            textarea.focus();
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            
            const successful = document.execCommand('copy');
            console.log('ExecCommand copy result:', successful);
            
            if (successful) {
                showFeedback('📋 RN IN template copied to clipboard!', 'success');
            } else {
                showFeedback('❌ Failed to copy. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
            showFeedback('❌ Failed to copy. Please try again.', 'error');
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
            displayErrorCode.textContent = this.value;
            
            const serial = displaySerial.textContent;
            const testcase = displayTestcase.textContent;
            
            if (serial && testcase) {
                const rnInTemplate = generateRNINTemplate(serial, testcase, this.value);
                fullTemplatePreview.textContent = rnInTemplate;
                showFeedback(`🔄 Error code updated to ${this.value}`, 'success');
            }
        });
    }

    // Event: Copy button click
    if (copyBtn) {
        console.log('Copy button found, adding event listener');
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Copy button clicked');
            copyTemplate();
        });
    } else {
        console.error('Copy button not found');
    }

    // Event: Keyboard shortcut
    if (templateInput) {
        templateInput.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                extractAndUpdate();
            }
        });

        templateInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                const text = this.value;
                if (text.includes('Serial Number:') && text.includes('Test Case Name:')) {
                    extractAndUpdate();
                }
            }, 200);
        });
    }

    console.log('✅ RN IN tool ready! (background mode)');
    console.log('💡 Tip: Press Ctrl+Enter to extract fields');
    console.log('📋 Copy will generate: RN IN + Serial + Test Case + Error Code');
});