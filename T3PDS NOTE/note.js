// Initialize variables
let zoomLevel = 1;
const minZoom = 0.5;
const maxZoom = 3;
const zoomStep = 0.1;

// Default notes
const defaultNotes = [
    "Always verify JBOG serial numbers before swapping",
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
function displayNotes(notes) {
    const notesDisplay = document.getElementById('notesDisplay');
    notesDisplay.innerHTML = '';
    
    notes.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.innerHTML = `
            <span class="note-number">${index + 1}.</span>
            <span class="note-text">${note}</span>
        `;
        notesDisplay.appendChild(noteItem);
    });
    
    // Update textarea for editing
    document.getElementById('notesTextarea').value = notes.join('\n');
}

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

// Zoom functions
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

// Copy notes to clipboard
async function copyNotesToClipboard() {
    const notesText = document.getElementById('notesTextarea').value;
    
    if (!notesText.trim()) {
        showNotification('No notes to copy', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(notesText);
        showNotification('Notes copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy notes', 'error');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('i');
    const text = document.getElementById('notificationText');
    
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
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
});