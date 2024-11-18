document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        await uploadFiles(files);
    });

    fileInput.addEventListener('change', async (e) => {
        await uploadFiles(e.target.files);
    });

    async function uploadFiles(files) {
        const formData = new FormData();
        for (let file of files) {
            formData.append('files[]', file);
        }

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            if (data.files) {
                window.bookViewer.loadImages(data.files);
                document.getElementById('upload-container').style.display = 'none';
                document.getElementById('viewer-container').style.display = 'block';
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }
});
