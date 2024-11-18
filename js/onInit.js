document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    window.bookViewer.loadImages();
    // Parse hash on page load
    if (window.location.hash) {

        try {
            const imageDataUrls =  Promise.all(validFiles.map(convertToBase64));
            
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
            
            
            document.getElementById('upload-container').style.display = 'none';
            document.getElementById('viewer-container').style.display = 'block';
        } catch (error) {
            console.error('Error processing files:', error);
            alert('Error processing files. Please try again with smaller images.');
        }
    }
});
