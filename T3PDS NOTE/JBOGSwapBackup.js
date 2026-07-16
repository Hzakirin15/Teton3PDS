// ============================
// PART 1: JBOG SWAP FUNCTIONALITY
// ============================

// JBOG swap mapping rules
const swapRules = {
    "JBOG0-JBOG1": ["Swap JBOG0 <> JBOG3", "Swap JBOG1 <> JBOG6"],
    "JBOG0-JBOG2": ["Swap JBOG0 <> JBOG7", "Swap JBOG2 <> JBOG4"],
    "JBOG0-JBOG4": ["Swap JBOG0 <> JBOG6", "Swap JBOG4 <> JBOG7"],
    "JBOG1-JBOG3": ["Swap JBOG1 <> JBOG6", "Swap JBOG3 <> JBOG5"],
    "JBOG1-JBOG5": ["Swap JBOG1 <> JBOG7", "Swap JBOG5 <> JBOG2"],
    "JBOG2-JBOG6": ["Swap JBOG2 <> JBOG4", "Swap JBOG6 <> JBOG3"],
    "JBOG3-JBOG7": ["Swap JBOG3 <> JBOG5", "Swap JBOG7 <> JBOG4"],
    "JBOG4-JBOG5": ["Swap JBOG4 <> JBOG7", "Swap JBOG5 <> JBOG2"],
    "JBOG4-JBOG6": ["Swap JBOG4 <> JBOG2", "Swap JBOG6 <> JBOG1"],
    "JBOG5-JBOG7": ["Swap JBOG5 <> JBOG3", "Swap JBOG7 <> JBOG2"],
    "JBOG6-JBOG7": ["Swap JBOG6 <> JBOG1", "Swap JBOG7 <> JBOG4"]
};

// Store selections in browser memory
let selections = {
    accelerator1: null,
    accelerator2: null
};

// Store serial numbers
let serialNumbers = {};

// Load selections from localStorage on page load
function loadSelections() {
    const savedSelections = localStorage.getItem('jBOGSelections');
    const savedSerials = localStorage.getItem('jBOGSerials');
    
    if (savedSelections) {
        selections = JSON.parse(savedSelections);
        
        // Restore selections in UI
        if (selections.accelerator1) {
            selectOption('accelerator1', selections.accelerator1);
            document.getElementById('selected1').textContent = selections.accelerator1;
        }
        
        if (selections.accelerator2) {
            selectOption('accelerator2', selections.accelerator2);
            document.getElementById('selected2').textContent = selections.accelerator2;
        }
        
        // Load serial numbers
        if (savedSerials) {
            serialNumbers = JSON.parse(savedSerials);
        }
        
        // If both selections exist, show swap instructions
        if (selections.accelerator1 && selections.accelerator2) {
            updateSwapInstructions();
        }
    }
}

// Save selections to localStorage
function saveSelections() {
    localStorage.setItem('jBOGSelections', JSON.stringify(selections));
}

// Save serial numbers to localStorage
function saveSerialNumbers() {
    localStorage.setItem('jBOGSerials', JSON.stringify(serialNumbers));
}

// Select an option and update UI
function selectOption(acceleratorId, value) {
    // Remove selected class from all options in the accelerator
    const options = document.querySelectorAll(`#${acceleratorId} .option`);
    options.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to the clicked option
    const selectedOption = document.querySelector(`#${acceleratorId} .option[data-value="${value}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
}

// Update swap instructions based on selections
function updateSwapInstructions() {
    const swapInstructions = document.getElementById('swapInstructions');
    
    // Check if both accelerators have selections
    if (!selections.accelerator1 || !selections.accelerator2) {
        return;
    }
    
    // Check if same accelerator is selected twice
    if (selections.accelerator1 === selections.accelerator2) {
        swapInstructions.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Please select two different JBOGs from the accelerators.</p>
            </div>
        `;
        return;
    }
    
    // Create the key for the swap rules (sorted to handle both orders)
    const key1 = `${selections.accelerator1}-${selections.accelerator2}`;
    const key2 = `${selections.accelerator2}-${selections.accelerator1}`;
    
    const swapRule = swapRules[key1] || swapRules[key2];
    
    if (swapRule) {
        // Display swap instructions
        displaySwapInstructions(swapRule);
    } else {
        swapInstructions.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-exclamation-circle"></i>
                <p>No swap rule found for the selected combination (${selections.accelerator1} and ${selections.accelerator2}).</p>
            </div>
        `;
    }
}

// Display swap instructions
function displaySwapInstructions(swapRule) {
    const swapInstructions = document.getElementById('swapInstructions');
    
    swapInstructions.innerHTML = '';
    
    swapRule.forEach((part, index) => {
        const instructionDiv = document.createElement('div');
        instructionDiv.className = 'swap-instruction-item';
        instructionDiv.id = `instruction-${index}`;
        
        // Extract JBOG numbers from the swap instruction
        const jbogMatches = part.match(/JBOG\d/g);
        
        // Create HTML
        let instructionHTML = '<div class="swap-text">';
        let currentPos = 0;
        
        jbogMatches.forEach((jbog, jbogIndex) => {
            // Find the position of this JBOG in the string
            const jbogPos = part.indexOf(jbog, currentPos);
            
            // Add text before the JBOG
            instructionHTML += part.substring(currentPos, jbogPos);
            
            // Add the JBOG with serial input
            const inputId = `${jbog.toLowerCase()}-serial`;
            const savedSerial = serialNumbers[inputId] || '';
            
            instructionHTML += `
                <span class="swap-item">${jbog}</span>
                <span class="serial-input-container">
                    <span class="serial-label-inline">(</span>
                    <input type="text" 
                           class="serial-input-inline" 
                           id="${inputId}" 
                           placeholder="Serial" 
                           value="${savedSerial}"
                           data-jbog="${jbog}">
                    <span class="serial-label-inline">)</span>
                </span>
            `;
            
            currentPos = jbogPos + jbog.length;
        });
        
        // Add remaining text (including the <> arrows)
        instructionHTML += part.substring(currentPos);
        instructionHTML += '</div>';
        
        instructionDiv.innerHTML = instructionHTML;
        swapInstructions.appendChild(instructionDiv);
        
        // Add event listeners to the input boxes
        jbogMatches.forEach(jbog => {
            const inputId = `${jbog.toLowerCase()}-serial`;
            const inputElement = document.getElementById(inputId);
            
            if (inputElement) {
                inputElement.addEventListener('input', function() {
                    // Save serial number
                    serialNumbers[inputId] = this.value;
                    saveSerialNumbers();
                });
            }
        });
    });
}

// Copy all instructions to clipboard - FIXED VERSION
async function copyAllInstructionsToClipboard() {
    const swapInstructions = document.getElementById('swapInstructions');
    
    // Check if we have valid instructions (not the placeholder)
    const placeholder = swapInstructions.querySelector('.placeholder');
    if (placeholder) {
        showNotification('No instructions to copy. Please select JBOGs first.', 'error');
        return;
    }
    
    // Check if we have swap instruction items
    const instructionItems = swapInstructions.querySelectorAll('.swap-instruction-item');
    if (instructionItems.length === 0) {
        showNotification('No instructions to copy', 'error');
        return;
    }
    
    let textToCopy = '';
    
    // Extract text from each instruction item
    instructionItems.forEach((item, index) => {
        const swapTextElement = item.querySelector('.swap-text');
        if (swapTextElement) {
            // Clone the element to work with it
            const clone = swapTextElement.cloneNode(true);
            
            // Replace input values with their serial numbers
            const inputs = clone.querySelectorAll('.serial-input-inline');
            inputs.forEach(input => {
                const serial = input.value || '[SERIAL]';
                // Create a text node with the serial number
                const serialText = document.createTextNode(`(${serial})`);
                
                // Find the parent container and replace the input with serial text
                const container = input.closest('.serial-input-container');
                if (container) {
                    // Clear the container and add the serial text
                    container.innerHTML = '';
                    container.appendChild(document.createTextNode('('));
                    container.appendChild(document.createTextNode(serial));
                    container.appendChild(document.createTextNode(')'));
                }
            });
            
            // Get the text content
            const instructionText = clone.textContent || clone.innerText;
            
            // Clean up the text (remove extra spaces)
            const cleanedText = instructionText.replace(/\s+/g, ' ').trim();
            
            textToCopy += cleanedText;
            
            // Add comma between instructions (but not after the last one)
            if (index < instructionItems.length - 1) {
                textToCopy += ', ';
            }
        }
    });
    
    // If no text was extracted, show error
    if (!textToCopy.trim()) {
        showNotification('No valid instructions to copy', 'error');
        return;
    }
    
    // Try to copy to clipboard
    try {
        await navigator.clipboard.writeText(textToCopy);
        showNotification('Instructions copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy: ', err);
        console.error('Text attempted to copy:', textToCopy);
        
        // Fallback method for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showNotification('Instructions copied to clipboard!', 'success');
            } else {
                showNotification('Failed to copy instructions', 'error');
            }
        } catch (fallbackErr) {
            console.error('Fallback copy failed:', fallbackErr);
            showNotification('Failed to copy instructions', 'error');
        }
    }
}

// ============================
// PART 2: NOTES FUNCTIONALITY
// ============================

// Initialize variables for notes
let zoomLevel = 1;
const minZoom = 0.5;
const maxZoom = 3;
const zoomStep = 0.1;

// Default notes
const defaultNotes = [
    "Verify Pin Connector JBOG based on failure location",
    "Ensure system is in maintenance mode before proceeding",
    "Document all swap procedures in the system log",
    "Perform post-swap verification tests",
    "Notify relevant teams after completion"
];

// Load notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('jbogNotes');
    
    // Load notes
    let notes = defaultNotes;
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
    
    // Display notes
    displayNotes(notes);
    
    // Check if image exists
    checkImage();
}

// Display notes in the UI



// Save notes to localStorage
function saveNotes() {
    const notesText = document.getElementById('notesTextarea').value;
    const notesArray = notesText.split('\n').filter(note => note.trim() !== '');
    
    // If no notes, use default
    const notesToSave = notesArray.length > 0 ? notesArray : defaultNotes;
    
    // Save to localStorage
    localStorage.setItem('jbogNotes', JSON.stringify(notesToSave));
    
    // Display saved notes
    displayNotes(notesToSave);
    
    // Show notification
    showNotification('Notes saved successfully!');
    
    // Switch back to display mode
    switchToDisplayMode();
}

// Check if image exists
function checkImage() {
    const img = document.getElementById('swapImage');
    
    img.onerror = function() {
        console.warn('Image not found: NotePic/SwapJBOGpic.png');
    };
}

// Zoom functions for image
function zoomIn() {
    if (zoomLevel < maxZoom) {
        zoomLevel += zoomStep;
        applyZoom();
    }
}

function zoomOut() {
    if (zoomLevel > minZoom) {
        zoomLevel -= zoomStep;
        applyZoom();
    }
}

function resetZoom() {
    zoomLevel = 1;
    applyZoom();
}

function applyZoom() {
    const img = document.getElementById('swapImage');
    img.style.transform = `scale(${zoomLevel})`;
}

// Edit notes functions
function switchToEditMode() {
    document.getElementById('notesDisplay').style.display = 'none';
    document.getElementById('notesEdit').style.display = 'block';
}

function switchToDisplayMode() {
    document.getElementById('notesDisplay').style.display = 'flex';
    document.getElementById('notesEdit').style.display = 'none';
}

// ============================
// PART 3: INITIALIZATION
// ============================

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('i');
    const text = notification.querySelector('span');
    
    text.textContent = message;
    
    // Set icon and color based on type
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        notification.style.backgroundColor = '#d32f2f';
    } else {
        icon.className = 'fas fa-check-circle';
        notification.style.backgroundColor = '#2E7D32';
    }
    
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize the entire application
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing JBOG Swap Application...");
    
    // ===== JBOG SWAP FUNCTIONALITY =====
    // Load saved selections
    loadSelections();
    
    // Set up event listeners for accelerator 1 options
    const accelerator1Options = document.querySelectorAll('#accelerator1 .option');
    accelerator1Options.forEach(option => {
        option.addEventListener('click', function() {
            console.log("Accelerator 1 clicked:", this.getAttribute('data-value'));
            const value = this.getAttribute('data-value');
            selections.accelerator1 = value;
            selectOption('accelerator1', value);
            document.getElementById('selected1').textContent = value;
            saveSelections();
            
            if (selections.accelerator1 && selections.accelerator2) {
                updateSwapInstructions();
            }
        });
    });
    
    // Set up event listeners for accelerator 2 options
    const accelerator2Options = document.querySelectorAll('#accelerator2 .option');
    accelerator2Options.forEach(option => {
        option.addEventListener('click', function() {
            console.log("Accelerator 2 clicked:", this.getAttribute('data-value'));
            const value = this.getAttribute('data-value');
            selections.accelerator2 = value;
            selectOption('accelerator2', value);
            document.getElementById('selected2').textContent = value;
            saveSelections();
            
            if (selections.accelerator1 && selections.accelerator2) {
                updateSwapInstructions();
            }
        });
    });
    

    //modify senction --------------------------------------------------------------------------------

    //modify section end---------------------------------------------------------------------------------

    // Copy all button event listener
    document.getElementById('copyAllBtn').addEventListener('click', copyAllInstructionsToClipboard);
    
    // ===== NOTES FUNCTIONALITY =====
    // Load saved notes
    loadNotes();
    
    // Set up event listeners for zoom controls
    document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
    document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
    document.getElementById('resetZoomBtn').addEventListener('click', resetZoom);
    
    // Set up event listeners for notes editing
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
    document.getElementById('cancelEditBtn').addEventListener('click', switchToDisplayMode);
    
    // Make notes editable on click
    document.getElementById('notesDisplay').addEventListener('click', function() {
        switchToEditMode();
    });
    
    console.log("JBOG Swap Application initialized successfully!");
    
    // Add CSS class for selected options if not already in CSS
    const style = document.createElement('style');
    style.textContent = `
        .accelerator-selector .option.selected {
            background-color: #d24900;
            border-color: #ffee00;
            color: rgb(212, 255, 0);
            box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);;
        }
    `;
    document.head.appendChild(style);
});