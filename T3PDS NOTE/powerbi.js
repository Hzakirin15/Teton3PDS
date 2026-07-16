// powerbi.js
// Professional tablet-style dashboard: loads shortcuts from internal JSON data
// and renders exactly 5 app shortcut cards

(function() {
    // --------------------------------------------------------------
    // 1. DATA MODEL - JSON structured shortcut list (5 items)
    //    as requested: CT Power BI, Teton2PDS, Penrose, BF21, Nanaka, Ambrose?
    //    Actually requirement: "make 1 section to fill 5 app shortcut link"
    //    Provided list includes 6 names, but we MUST show exactly 5.
    //    Based on natural reading: The user listed:
    //    "CT Power BI, Teton2PDS, Penrose, BF21, Nanaka, Ambrose" = 6 items.
    //    The requirement says: "make 1 section to fill 5 app shortcut link"
    //    I will pick the first 5 meaningful unique shortcuts for clarity,
    //    But to respect the user intent, I'll include ALL but present only 5?
    //    Better: let's provide the first 5 from list (CT Power BI, Teton2PDS, Penrose, BF21, Nanaka)
    //    But also ensure Ambrose is included optionally? "list is below" includes 6.
    //    Since it says "5 app shortcut link" we design flexible JSON but render exactly 5.
    //    I will build an array with 5 curated items: omit one? or combine?
    //    For professional integrity: The user may have intended top 5, but to avoid missing
    //    any, I'll create config: by default display the 5 most used. I decide to show:
    //    "CT Power BI", "Teton2PDS", "Penrose", "BF21", "Nanaka".
    //    But we don't discard Ambrose; I add a friendly extra in a separate small area? Not needed.
    //    But requirement states exactly 5. So I'll exactly display 5 using given URLs.
    //    Use first 5 entries from the collection to meet spec.
    // --------------------------------------------------------------
    
    const shortcutsData = [
        {
            "id": 1,
            "name": "Teton3PDS",
            "description": "Core analytics & metrics",
            "url": "https://app.powerbi.com/view?r=eyJrIjoiMDg1Mzc2OWEtNGQ5OS00Nzc4LWIyOGUtZjM0NDlmYjllNzVmIiwidCI6ImRhNmUwNjI4LWZjODMtNGNhZi05ZGQyLTczMDYxY2JhYjE2NyIsImMiOjEwfQ%3D%3D&pageName=ReportSection6efd733c6349a7791304",
            "icon": "fa-server"
        },
        {
            "id": 2,
            "name": "Penrose",
            "description": "PDS Performance Dashboard",
            "url": "https://app.powerbi.com/view?r=eyJrIjoiMzFhZDhiZjYtOTQzMS00YmI4LWJhNjItNDE3NDMxYTMzZDliIiwidCI6ImRhNmUwNjI4LWZjODMtNGNhZi05ZGQyLTczMDYxY2JhYjE2NyIsImMiOjEwfQ%3D%3D&pageName=5272d7dc60e41494527b",
            "icon": "fa-database"
        },
        {
            "id": 3,
            "name": "BF21",
            "description": "Advanced visual insights",
            "url": "https://app.powerbi.com/view?r=eyJrIjoiNTc2YzBiNTctYmMyZi00Mzk5LWI2N2YtMzhiOTM5NDUwZGM5IiwidCI6ImRhNmUwNjI4LWZjODMtNGNhZi05ZGQyLTczMDYxY2JhYjE2NyIsImMiOjEwfQ%3D%3D",
            "icon": "fa-code-branch"
        },
        {
            "id": 4,
            "name": "Nanaka",
            "description": "Business forecast 2021+",
            "url": "https://app.powerbi.com/view?r=eyJrIjoiMjNhZmZlOGQtNjhhMS00ZjdiLThjZjMtNjA1MTFkZDEzZWQ2IiwidCI6ImRhNmUwNjI4LWZjODMtNGNhZi05ZGQyLTczMDYxY2JhYjE2NyIsImMiOjEwfQ%3D%3D&disablecdnExpiration=1773065997",
            "icon": "fa-chart-simple"
        },
        {
            "id": 5,
            "name": "Ambrose",
            "description": "Operational reporting suite",
            "url": "https://app.powerbi.com/view?r=eyJrIjoiMTY4Njc5M2MtNDgxNS00ZDJhLTgwZDYtM2QwZGZmMGNiNzZiIiwidCI6ImRhNmUwNjI4LWZjODMtNGNhZi05ZGQyLTczMDYxY2JhYjE2NyIsImMiOjEwfQ%3D%3D&pageName=ReportSection860b0a8080013301ec19",
            "icon": "fa-chart-gantt"
        }
        // Note: Ambrose is not displayed to strictly satisfy "5 app shortcut link"
        // But it's fully available if user wants, we can add optionally? Respecting exact requirement.
        // Yet we keep code extensible. If needed, we could show all 6 but spec says 5.
        // According to the request: "make 1 section to fill 5 app shortcut link"
    ];

    const shortcutsData1 = [
        {
            "id": 1,
            "name": "FPY Amber",
            "description": "Core analytics & metrics",
            "url": "https://app.powerbi.com/view?r=eyJrIjoiMDg1Mzc2OWEtNGQ5OS00Nzc4LWIyOGUtZjM0NDlmYjllNzVmIiwidCI6ImRhNmUwNjI4LWZjODMtNGNhZi05ZGQyLTczMDYxY2JhYjE2NyIsImMiOjEwfQ%3D%3D&pageName=ReportSection6efd733c6349a7791304",
            "icon": "fa-server"
        }
        // Note: Ambrose is not displayed to strictly satisfy "5 app shortcut link"
        // But it's fully available if user wants, we can add optionally? Respecting exact requirement.
        // Yet we keep code extensible. If needed, we could show all 6 but spec says 5.
        // According to the request: "make 1 section to fill 5 app shortcut link"
    ];

    // Helper: Friendly date update in header
    function updateHeaderDate() {
        const dateElement = document.getElementById('liveDate');
        if (dateElement) {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formatted = now.toLocaleDateString(undefined, options);
            dateElement.innerHTML = `<i class="far fa-calendar-alt" style="margin-right: 6px;"></i> ${formatted}`;
        }
    }

    // Create shortcut card DOM element from data object
    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'shortcut-card';
        
        // Determine icon class, fallback to fa-link
        let iconClass = item.icon && item.icon.startsWith('fa-') ? item.icon : 'fa-chalkboard-user';
        // custom per item name extra mapping (just in case)
        if (item.name === 'Teton3PDS') iconClass = 'fa-database';
        if (item.name === 'Penrose') iconClass = 'fa-server';
        if (item.name === 'BF21') iconClass = 'fa-microchip';
        if (item.name === 'Nanaka') iconClass = 'fa-folder-tree';
        if (item.name === 'Ambrose') iconClass = 'fa-chart-gantt';
        
        // Build card inner structure
        card.innerHTML = `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="card-link">
                <div class="card-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="card-title">${escapeHtml(item.name)}</div>
                
                <div class="launch-hint">
                    <i class="fas fa-external-link-alt"></i> <span>Launch dashboard</span>
                </div>
            </a>
        `;
        
        // Add a tiny ripple / open effect (optional accessibility)
        const link = card.querySelector('.card-link');
        if (link) {
            link.addEventListener('click', (e) => {
                // simple analytics-friendly: just open link, but we can show small toast? no needed.
                // but we ensure no default interference
            });
        }
        return card;
    }


    function createCard1(item) {
        const card = document.createElement('div');
        card.className = 'shortcut-card';
        
        // Determine icon class, fallback to fa-link
        let iconClass = item.icon && item.icon.startsWith('fa-') ? item.icon : 'fa-chalkboard-user';
        // custom per item name extra mapping (just in case)
        if (item.name === 'Teton3PDS') iconClass = 'fa-database';
        if (item.name === 'Penrose') iconClass = 'fa-server';
        if (item.name === 'BF21') iconClass = 'fa-microchip';
        if (item.name === 'Nanaka') iconClass = 'fa-folder-tree';
        if (item.name === 'Ambrose') iconClass = 'fa-chart-gantt';
        
        // Build card inner structure
        card.innerHTML = `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="card-link1">
                <div class="card-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="card-title">${escapeHtml(item.name)}</div>
                <div class="launch-hint">
                    <i class="fas fa-external-link-alt"></i> <span>Launch dashboard</span>
                </div>
            </a>
        `;
        
        // Add a tiny ripple / open effect (optional accessibility)
        const link = card.querySelector('.card-link1');
        if (link) {
            link.addEventListener('click', (e) => {
                // simple analytics-friendly: just open link, but we can show small toast? no needed.
                // but we ensure no default interference
            });
        }
        return card;
    }
    
    // Simple XSS protection
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
            return c;
        });
    }
    
    // Render all 5 shortcuts into grid container
    function renderShortcuts() {
        const gridContainer = document.getElementById('shortcutGrid');
        if (!gridContainer) {
            console.warn('Shortcut grid container not found');
            return;
        }
        
        // Clear loading/placeholder content
        gridContainer.innerHTML = '';
        
        // iterate over shortcutsData (exactly 5 items)
        shortcutsData.forEach(item => {
            const card = createCard(item);
            gridContainer.appendChild(card);
        });
        
        // If for any reason data length is less than 5, we ensure default meets expectation
        // but our shortcutsData length is 5, perfect.
        if (shortcutsData.length !== 5) {
            console.log(`Note: shortcuts count is ${shortcutsData.length}, expected 5.`);
        }
    }


    function renderShortcuts1() {
        const gridContainer1 = document.getElementById('shortcutGrid1');
        if (!gridContainer1) {
            console.warn('Shortcut grid container not found');
            return;
        }
        
        // Clear loading/placeholder content
        gridContainer1.innerHTML = '';
        
        // iterate over shortcutsData (exactly 5 items)
        shortcutsData1.forEach(item => {
            const card = createCard1(item);
            gridContainer1.appendChild(card);
        });
        
        // If for any reason data length is less than 5, we ensure default meets expectation
        // but our shortcutsData length is 5, perfect.
        if (shortcutsData.length !== 5) {
            console.log(`Note: shortcuts count is ${shortcutsData.length}, expected 5.`);
        }
    }
    
    // Optional: simple micro interaction - notify when any card is clicked (feedback friendly)
    function attachGlobalLaunchHint() {
        document.addEventListener('click', (e) => {
            const cardLink = e.target.closest('.card-link');
            if (cardLink && cardLink.href) {
                // provide subtle user feedback for tablet
                const toast = document.createElement('div');
                toast.className = 'toast-msg';
                toast.textContent = 'Opening dashboard ⋯';
                toast.style.opacity = '0';
                document.body.appendChild(toast);
                setTimeout(() => { toast.style.opacity = '1'; }, 5);
                setTimeout(() => {
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 400);
                }, 1300);
            }
        });
    }
    
    // Additional polish: handle external links security and optional "confirm" but better experience
    // we also verify no duplicate prevention
    
    // If user wants to store JSON separately, we also could export, but requirement fulfilled:
    // JavaScript uses JSON internal. Also we can simulate fetching but not needed.
    
    // implement dynamic background, consistent tablet view
    function adjustForTouch() {
        // make cards feel more tappable on tablets
        if ('ontouchstart' in window) {
            document.body.style.cursor = 'pointer';
            const style = document.createElement('style');
            style.textContent = `
                .shortcut-card {
                    cursor: pointer;
                    transition: transform 0.1s ease;
                }
                .shortcut-card:active {
                    transform: scale(0.98);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize full dashboard
    function init() {
        updateHeaderDate();
        renderShortcuts();
        renderShortcuts1();
        attachGlobalLaunchHint();
        adjustForTouch();
        // also set any additional title or meta
        console.log('PowerBI Shortcut Dashboard ready — 5 tablet shortcuts loaded');
    }
    
    // Run after DOM fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();