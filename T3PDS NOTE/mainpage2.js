document.addEventListener('DOMContentLoaded', function() {
    const appsContainer = document.getElementById('appsContainer');
    
    // App configuration with names, links, and icons
    const apps = [
        { 
            name: "Action", 
            file: "Action.html", 
            icon: "icon/Action.png",
            bgColor: "#f3ebc8"  // Purple accent
        },
        { 
            name: "Reload IP", 
            file: "Reload IP.html", 
            icon: "icon/reload.png",
            bgColor: "#d5eeeb"  // Blue accent
        },
        { 
            name: "Logfile Search", 
            file: "logfile3pds.html", 
            icon: "icon/swapping.png",
            bgColor: "rgb(220, 240, 243)"  // Blue accent
        },
        { 
            name: "SFCS", 
            file: "SFCS.html", 
            icon: "icon/server.webp",
            bgColor: "rgb(236, 198, 228)"  // Blue accent
        },
        { 
            name: "HEX Calculator", 
            file: "hexcal.html", 
            icon: "icon/calculator.png",
            bgColor: "rgb(203, 231, 236)"  // Blue accent
        },
        { 
            name: "Config SW Fixtures", 
            file: "reload_ip_sw.html", 
            icon: "icon/swapping.png",
            bgColor: "rgb(245, 209, 221)"  // Blue accent
        },
        { 
            name: "Power BI", 
            file: "powerbi.html", 
            icon: "icon/swapping.png",
            bgColor: "rgb(243, 220, 228)"  // Blue accent
        },
        { 
            name: "Snake", 
            file: "Snake.html", 
            icon: "icon/snake.webp",
            bgColor: "rgb(241, 217, 217)"  // Blue accent
        },
        { 
            name: "Tower Defense", 
            file: "towerdefense.html", 
            icon: "icon/tower.webp",
            bgColor: "rgb(200, 208, 233)"  // Blue accent
        },
        { 
            name: "Math Kids", 
            file: "Math.html", 
            icon: "icon/math.png",
            bgColor: "rgb(201, 208, 231)"  // Blue accent
        },
        
    ];

    
    // Create app icons
    function createAppIcons() {
        appsContainer.innerHTML = '';
        
        apps.forEach(app => {
            const appItem = document.createElement('div');
            appItem.className = 'app-item';
            appItem.onclick = () => window.location.href = app.file;
            
            const appIcon = document.createElement('div');
            appIcon.className = 'app-icon';
            appIcon.style.backgroundColor = app.bgColor;
            
            // Create icon image
            const iconImg = document.createElement('img');
            iconImg.src = app.icon;
            iconImg.alt = app.name;
            iconImg.onerror = function() {
                // Fallback to Font Awesome icon if image fails to load
                this.style.display = 'none';
                const fallbackIcon = document.createElement('i');
                fallbackIcon.className = 'fas fa-question';
                appIcon.appendChild(fallbackIcon);
            };
            appIcon.appendChild(iconImg);
            
            const appNameElement = document.createElement('div');
            appNameElement.className = 'app-name';
            appNameElement.textContent = app.name;
            
            appItem.appendChild(appIcon);
            appItem.appendChild(appNameElement);
            appsContainer.appendChild(appItem);
        });
    }
    
    // Initialize the app
    createAppIcons();
});