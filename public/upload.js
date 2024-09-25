document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadMusicForm');

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
            } else {
                alert(`Error uploading music: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading music');
        }
    });
});