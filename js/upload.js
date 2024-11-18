document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    // Parse hash on page load
    if (window.location.hash) {
        try {
            const compressedData = window.location.hash.slice(1); // Remove #
            const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
            const imageUrls = JSON.parse(decompressed);
            if (imageUrls && imageUrls.length > 0) {
                window.bookViewer.loadImages(imageUrls);
                document.getElementById('upload-container').style.display = 'none';
                document.getElementById('viewer-container').style.display = 'block';
            }
        } catch (error) {
            console.error('Error parsing URL hash:', error);
        }
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
            
            // Get existing images from hash if any
            let allImages = [];
            if (window.location.hash) {
                try {
                    const compressedData = window.location.hash.slice(1);
                    const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
                    allImages = JSON.parse(decompressed);
                } catch (error) {
                    console.error('Error parsing existing hash:', error);
                }
            }
            
            allImages = [...allImages, ...imageDataUrls];
            
            // Update URL hash with compressed data
            const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(allImages));
            window.location.hash = compressed;
            
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
