document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('musicUploadForm');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const musicListContainer = document.getElementById('musicListContainer');
    const audioPlayer = document.getElementById('audioPlayer');
    const nowPlaying = document.getElementById('nowPlaying');

    // Upload music
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);

        try {
            const response = await fetch('/api/music/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                alert('Music uploaded successfully');
                uploadForm.reset();
                loadMusicList();
            } else {
                alert(`Error uploading music: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading music');
        }
    });

    // Search music
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    async function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            try {
                const response = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                displayMusicList(data);
            } catch (error) {
                console.error('Error:', error);
                alert('Error searching music: ' + error.message);
            }
        }
    }

    // Load music list
    async function loadMusicList() {
        try {
            const response = await fetch('/api/music');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayMusicList(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Error loading music list: ' + error.message);
            musicListContainer.innerHTML = '<li>Error loading music list. Please try again later.</li>';
        }
    }

    // Display music list
    function displayMusicList(list) {
        musicListContainer.innerHTML = '';
        if (list.length === 0) {
            musicListContainer.innerHTML = '<li>No music available</li>';
        } else {
            list.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="music-item">
                        <span>${item.title} - ${item.artist}</span>
                        <div class="music-controls">
                            <button class="play-btn" data-id="${item.id}">Play</button>
                            <button class="delete-btn" data-id="${item.id}">Delete</button>
                        </div>
                    </div>
                    <div class="lyrics-container" id="lyrics-${item.id}" style="display: none;">
                        <h4>Lyrics:</h4>
                        <pre>${item.lyrics}</pre>
                    </div>
                `;
                musicListContainer.appendChild(li);
            });
        }

        // Add event listeners for play and delete buttons
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', () => playMusic(btn.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteMusic(btn.dataset.id));
        });
    }

    // Play music
    async function playMusic(id) {
        try {
            const response = await fetch(`/api/music/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            audioPlayer.src = `/upload/${data.filename}`;
            audioPlayer.play();
            nowPlaying.textContent = `Now Playing: ${data.title} - ${data.artist}`;
            
            // Hide all lyrics containers
            document.querySelectorAll('.lyrics-container').forEach(container => {
                container.style.display = 'none';
            });
            
            // Show lyrics for the current song
            const lyricsContainer = document.getElementById(`lyrics-${id}`);
            if (lyricsContainer) {
                lyricsContainer.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error playing music: ' + error.message);
        }
    }

    // Delete music
    async function deleteMusic(id) {
        if (confirm('Are you sure you want to delete this music?')) {
            try {
                const response = await fetch(`/api/music/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert('Music deleted successfully');
                loadMusicList();
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting music: ' + error.message);
            }
        }
    }

    // Initial load of music list
    loadMusicList();
});