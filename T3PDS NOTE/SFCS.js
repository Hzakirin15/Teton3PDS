// Store last copied values
let lastCopiedCommand = '';
let lastCopiedHobby = '';



// Add this at the top of your JS file
document.addEventListener('DOMContentLoaded', function() {
    // Set up toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update the dropdown options based on selection
            const lineTypeSelect = document.getElementById('lineType');
            lineTypeSelect.innerHTML = ''; // Clear existing options
            
            let options = [];
            switch(this.dataset.type) {
                case 'rnin':
                    options = ['RN', 'IN'];
                    break;
                case 'headnode':
                    options = ['WT', 'PT', 'BS', 'TN', 'TO', 'TP', 'IO', 'W3', 'SJ', 'KR'];
                    break;
                case 'jbog':
                    options = ['WT', 'PT', 'TN', 'TO', 'TP', 'IO', 'W3', 'SJ', 'KR'];
                    break;
                case 'rack':
                    options = ['CR', 'IN', 'WT'];
                    break;
                
            }
            
            // Add new options
            options.forEach(option => {
                const optElement = document.createElement('option');
                optElement.value = option;
                optElement.textContent = option;
                lineTypeSelect.appendChild(optElement);
            });
        });
    });
});

// Update your SingleCommand function to get the current line type
function SingleCommand() {
    const name = document.getElementById('name').value;
    const teuser = document.getElementById('teuser').value;
    const lineType = document.getElementById('lineType').value;
    const command = `SFCS_GET_RESULT Complete ${name || '[empty]'} LINE ${lineType} ${teuser || 'TEUSER'}`;
    const button = event.target;
    
    navigator.clipboard.writeText(command).then(() => {
        // Check if content is same as last copy
        if (command === lastCopiedCommand) {
            button.classList.add('same-content');
            button.classList.remove('new-content');
        } else {
            button.classList.add('new-content');
            button.classList.remove('same-content');
        }
        
        lastCopiedCommand = command;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        
        setTimeout(() => {
            button.textContent = originalText;
            // Reset color after 2 seconds
            setTimeout(() => {
                button.classList.remove('same-content', 'new-content');
            }, 200);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function setupsfcs() {
    const hobbyText = `source configs/global.cfg && source libs/libSFCSAPI.sh`; // Fixed text
    const button = event.target;
    
    navigator.clipboard.writeText(hobbyText).then(() => {
        // Visual feedback
        button.style.backgroundColor = '#2196F3';
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
}


// Add this to your existing JavaScript
function addSnField() {
    const container = document.getElementById('snContainer');
    const newInputWrapper = document.createElement('div');
    newInputWrapper.className = 'sn-input-wrapper';
    
    newInputWrapper.innerHTML = `
        <input type="text" class="blade-sn" placeholder="Blade SN">
        <button class="add-sn-btn" onclick="addSnField()">+</button>
    `;
    
    container.appendChild(newInputWrapper);
}

function generateMultiCommand() {
    const bladeSns = Array.from(document.querySelectorAll('.blade-sn'))
        .map(input => input.value.trim())
        .filter(value => value); // Remove empty values
    
    const lineType = document.getElementById('lineType').value;
    const teuser = document.getElementById('teuser').value;
    
    if (bladeSns.length === 0) {
        alert('Please enter at least one Blade SN');
        return;
    }
    
    const command = `for sn in ${bladeSns.join(' ')}; do SFCS_GET_RESULT Complete $sn LINE ${lineType} ${teuser || 'TEUSER'}; done`;
    
    const button = event.target;
    navigator.clipboard.writeText(command).then(() => {
        button.classList.add('new-content');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        
        setTimeout(() => {
            button.textContent = originalText;
            setTimeout(() => {
                button.classList.remove('new-content');
            }, 200);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

