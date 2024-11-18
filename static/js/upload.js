document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    // Load saved images on startup
    const savedImages = JSON.parse(localStorage.getItem('bookViewerImages') || '[]');
    if (savedImages.length > 0) {
        window.bookViewer.loadImages(savedImages);
        document.getElementById('upload-container').style.display = 'none';
        document.getElementById('viewer-container').style.display = 'block';
    }

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

    async function handleFiles(files) {
        const validFiles = Array.from(files).filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            return validTypes.includes(file.type);
        });

        if (validFiles.length === 0) {
            alert('Please upload valid image files (JPG, PNG, or GIF)');
            return;
        }

        try {
            const imageDataUrls = await Promise.all(validFiles.map(convertToBase64));
            
            // Get existing images
            const existingImages = JSON.parse(localStorage.getItem('bookViewerImages') || '[]');
            const allImages = [...existingImages, ...imageDataUrls];
            
            // Check localStorage size limit (roughly 5MB per image)
            const totalSize = new Blob([JSON.stringify(allImages)]).size;
            if (totalSize > 4.5 * 1024 * 1024) { // 4.5MB safety limit
                alert('Warning: Storage limit reached. Some images may not be saved permanently.');
            }
            
            try {
                localStorage.setItem('bookViewerImages', JSON.stringify(allImages));
            } catch (e) {
                console.error('Storage failed:', e);
                alert('Storage limit reached. Only the most recent images will be saved.');
                // Try to save at least the new images
                localStorage.setItem('bookViewerImages', JSON.stringify(imageDataUrls));
            }
            
            window.bookViewer.loadImages(allImages);
            document.getElementById('upload-container').style.display = 'none';
            document.getElementById('viewer-container').style.display = 'block';
        } catch (error) {
            console.error('Error processing files:', error);
            alert('Error processing files. Please try again with smaller images.');
        }
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
});
