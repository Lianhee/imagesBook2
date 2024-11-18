# Book Viewer

A web-based image viewer implementing a book-like interface with dynamic page-turning animations featuring perspective transforms and shadow gradients. The application provides a lightweight, client-side only architecture enabling users to upload files, navigate through pages with interactive controls, and utilize advanced zoom capabilities including mouse wheel support and image panning.

## Features

- Drag & drop or file selection for image upload
- Interactive page-turning animations with perspective effects
- Zoom controls with mouse wheel support and image panning
- Thumbnail navigation
- Fullscreen mode
- Client-side only - no server required
- Dark mode support

## Usage

1. Visit the [GitHub Pages site](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME)
2. Upload images by:
   - Dragging them onto the drop zone
   - Using the file selection button
3. Navigate through pages using:
   - Arrow buttons
   - Left/right arrow keys
   - Thumbnail clicks
4. Control zoom using:
   - Mouse wheel
   - Zoom buttons (+/-)
   - Plus/minus keys
5. Pan images when zoomed in by:
   - Click and drag with mouse
   - Touch and drag on mobile devices

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2. Open `index.html` in your browser
3. Start uploading images and testing features

## Deployment

1. Fork this repository
2. Go to Settings > Pages
3. Under "Source", select "Deploy from a branch"
4. Select "main" branch and "/" (root) folder
5. Click Save
6. Your site will be available at https://YOUR_USERNAME.github.io/YOUR_REPO_NAME

## Technical Details

- Pure client-side implementation using vanilla JavaScript
- Canvas-based rendering for smooth animations
- Perspective transforms for realistic page turns
- Efficient memory management using URL.createObjectURL
- Responsive design with Bootstrap 5

## License

MIT License - See LICENSE file for details
