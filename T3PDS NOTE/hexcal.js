function calculateHex() {
    const hexInput = document.getElementById('hexInput').value;
    const resultElement = document.getElementById('hexResult');
    
    // Validate hex input
    if (!/^[0-9A-Fa-f]+$/.test(hexInput)) {
        resultElement.textContent = 'Invalid Hex';
        return;
    }

    try {
        // Convert hex to decimal, subtract 1, then back to hex
        const decimalValue = parseInt(hexInput, 16);
        const resultValue = decimalValue - 1;
        
        // Handle negative results
        if (resultValue < 0) {
            resultElement.textContent = 'Negative';
        } else {
            resultElement.textContent = resultValue.toString(16).toUpperCase();
        }
    } catch (e) {
        resultElement.textContent = 'Error';
    }
}

function copyResult() {
    const resultElement = document.getElementById('hexResult');
    const resultText = resultElement.textContent;
    const button = event.target;
    
    // Only copy if there's a valid result
    if (resultText && resultText !== 'Invalid Hex' && resultText !== 'Error' && resultText !== 'Negative') {
        navigator.clipboard.writeText(resultText).then(() => {
            // Visual feedback
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    } else {
        button.textContent = 'Nothing to copy';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    }
}

// Allow pressing Enter key to calculate
document.getElementById('hexInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateHex();
    }
});