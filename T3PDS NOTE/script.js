document.addEventListener('DOMContentLoaded', function() {
    const testCaseForm = document.getElementById('testCaseForm');
    const testCasesContainer = document.getElementById('testCasesContainer');
    const addNewBtn = document.getElementById('addNewBtn');
    const generateBtn = document.getElementById('generateBtn');
    const addErrorBtn = document.getElementById('addErrorBtn');
    const errorContainer = document.getElementById('errorContainer');

    let testCases = JSON.parse(localStorage.getItem('testCases')) || [];
    let errorCount = 0;

    // Load saved test cases
    renderTestCases();

    // Generate test case
    generateBtn.addEventListener('click', function() {
        const rackNumber = document.getElementById('rackNumber').value.trim();
        const position = document.getElementById('position').value;
        const caseNumber = document.getElementById('caseNumber').value.trim();
        const testCase = document.getElementById('testCase').value.trim();
        const action = document.getElementById('action').value.trim();
        
        // Collect all errors
        const errors = [];
        const mainError = document.getElementById('error').value.trim();
        if (mainError) errors.push(mainError);
        
        // Get additional errors
        const additionalErrors = document.querySelectorAll('#errorContainer input');
        additionalErrors.forEach(input => {
            if (input.value.trim()) {
                errors.push(input.value.trim());
            }
        });

        if (!rackNumber || !position || !caseNumber || !testCase || !action) {
            alert('Please fill in all required fields');
            return;
        }

        const newTestCase = {
            rackNumber,
            position,
            caseNumber,
            testCase,
            errors,
            action,
            id: Date.now()
        };

        testCases.push(newTestCase);
        saveToLocalStorage();
        renderTestCases();
        resetForm();
        testCaseForm.classList.add('hidden');
        errorCount = 0;
    });

    // Add Error button functionality
    addErrorBtn.addEventListener('click', function() {
        const errorInput = document.getElementById('error');
        const error = errorInput.value.trim();
        
        if (error) {
            errorCount++;
            const errorId = `error-${errorCount}`;
            
            // Create new error input group
            const errorItem = document.createElement('div');
            errorItem.className = 'error-item';
            errorItem.innerHTML = `
                <input type="text" id="${errorId}" value="${error}" placeholder="Additional error">
                <button class="remove-error-btn" data-errorid="${errorId}">×</button>
            `;
            
            errorContainer.appendChild(errorItem);
            errorInput.value = '';
            
            // Add event listener for remove button
            errorItem.querySelector('.remove-error-btn').addEventListener('click', function() {
                errorItem.remove();
            });
        }
    });

    // Add new test case button
    addNewBtn.addEventListener('click', function() {
        resetForm();
        testCaseForm.classList.remove('hidden');
        document.getElementById('rackNumber').focus();
    });

    // Event delegation for dynamic elements
    testCasesContainer.addEventListener('click', function(e) {
        const target = e.target;
        
        // Handle copy button
        if (target.classList.contains('copy-btn') || target.closest('.copy-btn')) {
            const btn = target.classList.contains('copy-btn') ? target : target.closest('.copy-btn');
            const id = parseInt(btn.getAttribute('data-id'));
            const testCase = testCases.find(tc => tc.id === id);
            if (testCase) {
                let errorsText = '';
                if (testCase.errors.length > 0) {
                    errorsText = ' : ' + testCase.errors.join(' : ');
                }
                const textToCopy = `${testCase.rackNumber} ${testCase.position} - [${testCase.caseNumber}] ${testCase.testCase}${errorsText} - ACTION : ${testCase.action}`;
                navigator.clipboard.writeText(textToCopy).then();
            }
        }
        
        // Handle edit button
        else if (target.classList.contains('edit-btn') || target.closest('.edit-btn')) {
            const btn = target.classList.contains('edit-btn') ? target : target.closest('.edit-btn');
            const id = parseInt(btn.getAttribute('data-id'));
            const testCase = testCases.find(tc => tc.id === id);
            
            if (testCase) {
                // Fill the form with the test case data
                document.getElementById('rackNumber').value = testCase.rackNumber;
                document.getElementById('position').value = testCase.position;
                document.getElementById('caseNumber').value = testCase.caseNumber;
                document.getElementById('testCase').value = testCase.testCase;
                document.getElementById('action').value = testCase.action;
                
                // Clear and repopulate error fields
                document.getElementById('error').value = '';
                errorContainer.innerHTML = '';
                errorCount = 0;
                
                // Add main error if exists
                if (testCase.errors.length > 0) {
                    document.getElementById('error').value = testCase.errors[0];
                    
                    // Add additional errors
                    for (let i = 1; i < testCase.errors.length; i++) {
                        errorCount++;
                        const errorId = `error-${errorCount}`;
                        const errorItem = document.createElement('div');
                        errorItem.className = 'error-item';
                        errorItem.innerHTML = `
                            <input type="text" id="${errorId}" value="${testCase.errors[i]}" placeholder="Additional error">
                            <button class="remove-error-btn" data-errorid="${errorId}">×</button>
                        `;
                        errorContainer.appendChild(errorItem);
                        
                        // Add event listener for remove button
                        errorItem.querySelector('.remove-error-btn').addEventListener('click', function() {
                            errorItem.remove();
                        });
                    }
                }
                
                // Remove the test case from the list
                testCases = testCases.filter(tc => tc.id !== id);
                saveToLocalStorage();
                renderTestCases();
                
                // Show the form
                testCaseForm.classList.remove('hidden');
            }
        }
        
        // Handle delete button
        else if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
            const btn = target.classList.contains('delete-btn') ? target : target.closest('.delete-btn');
            const id = parseInt(btn.getAttribute('data-id'));
            
            if (confirm('Are you sure you want to delete this test case?')) {
                testCases = testCases.filter(tc => tc.id !== id);
                saveToLocalStorage();
                renderTestCases();
            }
        }
    });

    // ... (previous code remains the same until the renderTestCases function)

function renderTestCases() {
    testCasesContainer.innerHTML = '';
    
    if (testCases.length === 0) {
        testCasesContainer.innerHTML = '<p>No test cases yet. Click "Add New Test Case" to get started.</p>';
        return;
    }

    // Create a copy of the array and reverse it to show newest first
    const reversedTestCases = [...testCases].reverse();
    
    reversedTestCases.forEach(testCase => {
        const testCaseElement = document.createElement('div');
        testCaseElement.className = 'test-case-item';
        
        // Build the test case text with bold rack number and position
        let errorsText = '';
        if (testCase.errors.length > 0) {
            errorsText = ' : ' + testCase.errors.join(' : ');
        }
        
        const testCaseText = `
            <strong>${testCase.rackNumber} ${testCase.position}</strong> - 
            [${testCase.caseNumber}] ${testCase.testCase}${errorsText} - 
            ACTION : ${testCase.action}
        `;
        
        testCaseElement.innerHTML = `
            <div class="test-case-text">${testCaseText}</div>
            <div class="test-case-actions">
                <button class="action-btn copy-btn" data-id="${testCase.id}" title="Copy">
                    <span aria-label="Copy">📋</span>
                </button>
                <button class="action-btn edit-btn" data-id="${testCase.id}" title="Edit">
                    <span aria-label="Edit">✏️</span>
                </button>
                <button class="action-btn delete-btn" data-id="${testCase.id}" title="Delete">
                    <span aria-label="Delete">🗑️</span>
                </button>
            </div>
        `;
        
        testCasesContainer.appendChild(testCaseElement);
    });
}


    function resetForm() {
        document.getElementById('rackNumber').value = '';
        document.getElementById('position').value = '';
        document.getElementById('caseNumber').value = '';
        document.getElementById('testCase').value = '';
        document.getElementById('error').value = '';
        document.getElementById('error').placeholder = 'Enter error';
        document.getElementById('action').value = '';
        errorContainer.innerHTML = '';
        errorCount = 0;
    }

    function saveToLocalStorage() {
        localStorage.setItem('testCases', JSON.stringify(testCases));
    }
});