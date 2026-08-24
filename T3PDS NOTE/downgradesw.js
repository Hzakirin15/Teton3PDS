// Store last copied values
let lastCopiedCommand = '';
let lastCopiedHobby = '';

function copyCommand() {
    const name = document.getElementById('name').value;
    const command = `./t2pds_sw_pex_fw_update.sh ${name || '[$K2V5_IP]'}`;
    const button = event.target;
    
    navigator.clipboard.writeText(command).then(() => {
        // Check if content is same as last copy
        if (command === lastCopiedCommand) {
            button.style.backgroundColor = '#4CAF50'; // Green for same content
            button.style.color = 'white';
        } else {
            button.style.backgroundColor = '#2196F3'; // Blue for new content
            button.style.color = 'white';
        }
        
        lastCopiedCommand = command;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        
        setTimeout(() => {
            button.textContent = originalText;
            // Reset color after 2 seconds
            setTimeout(() => {
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 200);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

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

function false1() {
    const hobbyText = `sudo su`; // Fixed text
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

function false2() {
    const hobbyText = `d1`; // Fixed text
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

function false3() {
    const hobbyText = `cd /root/users/YM2310005/t2pds_sw_pex_fw`; // Fixed text
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

function copyCommandbmc() {
    const namebmc = document.getElementById('namebmc').value;
    const command = `./nitro-bmc -i ${namebmc || '[$BMC_IP]'} fru print`;
    const button = event.target;
    
    navigator.clipboard.writeText(command).then(() => {
        // Check if content is same as last copy
        if (command === lastCopiedCommand) {
            button.style.backgroundColor = '#4CAF50'; // Green for same content
            button.style.color = 'white';
        } else {
            button.style.backgroundColor = '#2196F3'; // Blue for new content
            button.style.color = 'white';
        }
        
        lastCopiedCommand = command;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        
        setTimeout(() => {
            button.textContent = originalText;
            // Reset color after 2 seconds
            setTimeout(() => {
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 200);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}


function copyPurpleTOR() {
    const hobbyText = `./integrator_mode -d -m "1-2:Copper_4x10G;3-8:Copper_2x100G;9-12:Copper_1x40G;13-24:4x100G;25-32:Copper_4x100G"`; // Fixed text
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
    const hobbyText = `./integrator_mode -m "1-2:4x10G;3-8:2x100G;9-12:40G;13-32:Copper_4x100G"`; // Fixed text
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