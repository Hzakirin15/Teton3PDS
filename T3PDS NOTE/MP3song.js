document.addEventListener('DOMContentLoaded', function() {
    // Audio element and control buttons
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const currentSongDisplay = document.getElementById('current-song');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const progressBar = document.querySelector('.progress');
    const songsContainer = document.getElementById('songs-container');
    
    // State variables
    let currentSong = null;
    let songs = [];
    
    // Simulated song data (in a real app, this would come from the server)
    // For demonstration, we'll use placeholder data
    const simulateSongs = [
        { title: "REBEL HEART MV", artist: "DJ Green", file: "REBEL HEART MV.mp3" },
        { title: "Night Forest", artist: "Nature Sounds", file: "song2.mp3" },
        { title: "Chill Beats", artist: "Lo-Fi Producer", file: "song3.mp3" },
        { title: "Morning Coffee", artist: "Acoustic Ensemble", file: "song4.mp3" },
        { title: "Urban Jungle", artist: "City Beats", file: "song5.mp3" }
    ];
    
    // Initialize the player
    function initPlayer() {
        // In a real application, you would fetch the list of songs from the server
        // For this example, we'll use the simulated data
        songs = simulateSongs;
        
        // Render the song list
        renderSongsList();
        
        // Set up event listeners for player controls
        setupEventListeners();
    }
    
    // Render the list of songs
    function renderSongsList() {
        songsContainer.innerHTML = '';
        
        songs.forEach((song, index) => {
            const songItem = document.createElement('li');
            songItem.className = 'song-item';
            
            songItem.innerHTML = `
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-actions">
                    <button class="song-btn play-song" data-index="${index}">Play</button>
                    <button class="song-btn pause-song" data-index="${index}">Pause</button>
                    <button class="song-btn stop-song" data-index="${index}">Stop</button>
                </div>
            `;
            
            songsContainer.appendChild(songItem);
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Main control buttons
        playBtn.addEventListener('click', playCurrentSong);
        pauseBtn.addEventListener('click', pauseCurrentSong);
        stopBtn.addEventListener('click', stopCurrentSong);
        
        // Song list buttons (using event delegation)
        songsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('play-song')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                playSong(index);
            } else if (e.target.classList.contains('pause-song')) {
                pauseCurrentSong();
            } else if (e.target.classList.contains('stop-song')) {
                stopCurrentSong();
            }
        });
        
        // Audio player events
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', function() {
            stopCurrentSong();
        });
        
        // Progress bar seeking
        document.querySelector('.progress-bar').addEventListener('click', function(e) {
            if (audioPlayer.duration) {
                const percent = e.offsetX / this.offsetWidth;
                audioPlayer.currentTime = percent * audioPlayer.duration;
                updateProgress();
            }
        });
    }
    
    // Play a specific song
    function playSong(index) {
        if (songs[index]) {
            currentSong = index;
            const song = songs[index];
            
            // Set the audio source
            audioPlayer.src = `song/${song.file}`;
            
            // Update the display
            currentSongDisplay.textContent = `${song.title} - ${song.artist}`;
            
            // Play the song
            audioPlayer.play()
                .then(() => {
                    console.log(`Playing: ${song.title}`);
                })
                .catch(error => {
                    console.error('Error playing song:', error);
                });
        }
    }
    
    // Play the current song
    function playCurrentSong() {
        if (currentSong !== null) {
            audioPlayer.play();
        } else if (songs.length > 0) {
            // If no song is selected, play the first one
            playSong(0);
        }
    }
    
    // Pause the current song
    function pauseCurrentSong() {
        audioPlayer.pause();
    }
    
    // Stop the current song
    function stopCurrentSong() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        updateProgress();
    }
    
    // Update the progress bar and time display
    function updateProgress() {
        if (audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = `${percent}%`;
            
            // Update time displays
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
            totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
        }
    }
    
    // Format time in minutes:seconds
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Initialize the player when the page loads
    initPlayer();
});