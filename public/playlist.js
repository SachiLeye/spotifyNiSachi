document.addEventListener('DOMContentLoaded', () => {
    const createPlaylistForm = document.getElementById('createPlaylistForm');
    const playlistList = document.getElementById('playlistList');

    createPlaylistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const playlistName = document.getElementById('playlistName').value;

        try {
            const response = await fetch('/api/playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playlistName }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Playlist created successfully');
                createPlaylistForm.reset();
                loadPlaylists();
            } else {
                alert(`Error creating playlist: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating playlist');
        }
    });

    async function loadPlaylists() {
        try {
            const response = await fetch('/api/playlist');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const playlists = await response.json();
            displayPlaylists(playlists);
        } catch (error) {
            console.error('Error:', error);
            alert('Error loading playlists: ' + error.message);
        }
    }

    function displayPlaylists(playlists) {
        playlistList.innerHTML = '';
        playlists.forEach(playlist => {
            const li = document.createElement('li');
            li.textContent = playlist.name;
            li.addEventListener('click', () => viewPlaylist(playlist.id));
            playlistList.appendChild(li);
        });
    }

    function viewPlaylist(playlistId) {
        // Implement view playlist functionality
        console.log(`View playlist: ${playlistId}`);
    }

    // Initial load of playlists
    loadPlaylists();
});