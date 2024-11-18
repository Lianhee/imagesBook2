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
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', async (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        const validFiles = Array.from(files).filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            return validTypes.includes(file.type);
        });

        if (validFiles.length === 0) {
            alert('Please upload valid image files (JPG, PNG, or GIF)');
            return;
        }

        const fileUrls = validFiles.map(file => URL.createObjectURL(file));
        window.bookViewer.loadImages(fileUrls);
        document.getElementById('upload-container').style.display = 'none';
        document.getElementById('viewer-container').style.display = 'block';
    }
});
