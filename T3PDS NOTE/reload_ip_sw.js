// Store last copied values
let lastCopiedCommand = '';
let lastCopiedHobby = '';



function copyHobby() {
    const hobbyText = `./integrator_mode -m "1-48:1G;49-52:10G"`; // Fixed text
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


function copyOrangeTOR() {
    const hobbyText = `./integrator_mode -m "1-8:4x100G;9-10:40G;11-32:4x100G"`; // Fixed text
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