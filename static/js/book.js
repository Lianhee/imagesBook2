class BookViewer {
    constructor() {
        this.currentPage = 0;
        this.pages = [];
        this.canvas = document.getElementById('book-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isAnimating = false;
        this.fullscreen = false;
        this.zoomLevel = 1;
        this.panOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        this.transitionProgress = 0;
        
        this.initializeEvents();
        this.resize();
    }

    initializeEvents() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextPage();
            if (e.key === 'ArrowLeft') this.previousPage();
            if (e.key === '+') this.zoomIn();
            if (e.key === '-') this.zoomOut();
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (this.zoomLevel > 1) {
                this.isDragging = true;
                this.lastMousePos = {
                    x: e.clientX,
                    y: e.clientY
                };
                this.canvas.classList.add('panning');
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMousePos.x;
                const deltaY = e.clientY - this.lastMousePos.y;
                this.panOffset.x += deltaX;
                this.panOffset.y += deltaY;
                this.lastMousePos = {
                    x: e.clientX,
                    y: e.clientY
                };
                this.render();
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.classList.remove('panning');
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });

        // Add clear button functionality
        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-secondary';
        clearBtn.innerHTML = '<i class="bi bi-trash"></i>';
        clearBtn.title = 'Clear All Images';
        clearBtn.addEventListener('click', () => this.clearImages());
        document.querySelector('.controls').appendChild(clearBtn);

        document.getElementById('prev-btn').addEventListener('click', () => this.previousPage());
        document.getElementById('next-btn').addEventListener('click', () => this.nextPage());
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('zoom-in-btn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoom-out-btn').addEventListener('click', () => this.zoomOut());
        document.getElementById('reset-zoom-btn').addEventListener('click', () => this.resetZoom());
    }

    clearImages() {
        if (confirm('Are you sure you want to clear all saved images?')) {
            localStorage.removeItem('bookViewerImages');
            this.pages = [];
            this.currentPage = 0;
            document.getElementById('upload-container').style.display = 'block';
            document.getElementById('viewer-container').style.display = 'none';
            document.getElementById('thumbnails').innerHTML = '';
        }
    }

    zoomIn() {
        if (this.zoomLevel < 3) {
            this.zoomLevel *= 1.2;
            this.canvas.classList.toggle('can-pan', this.zoomLevel > 1);
            this.render();
        }
    }

    zoomOut() {
        if (this.zoomLevel > 0.5) {
            this.zoomLevel /= 1.2;
            if (this.zoomLevel < 1) {
                this.panOffset = { x: 0, y: 0 };
            }
            this.canvas.classList.toggle('can-pan', this.zoomLevel > 1);
            this.render();
        }
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.panOffset = { x: 0, y: 0 };
        this.canvas.classList.remove('can-pan');
        this.render();
    }

    resize() {
        const container = document.getElementById('book-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.render();
    }

    async loadImages(imageUrls) {
        this.pages = [];
        for (let url of imageUrls) {
            const img = new Image();
            img.src = url;
            await new Promise(resolve => {
                img.onload = resolve;
            });
            this.pages.push(img);
        }
        this.render();
        this.updateThumbnails();
    }

    render() {
        if (!this.pages.length) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const currentImage = this.pages[this.currentPage];
        
        const ratio = Math.min(
            this.canvas.width / currentImage.width,
            this.canvas.height / currentImage.height
        );
        
        const baseWidth = currentImage.width * ratio;
        const baseHeight = currentImage.height * ratio;
        const width = baseWidth * this.zoomLevel;
        const height = baseHeight * this.zoomLevel;
        
        let x = (this.canvas.width - width) / 2;
        let y = (this.canvas.height - height) / 2;
        
        if (this.zoomLevel > 1) {
            x += this.panOffset.x;
            y += this.panOffset.y;
        }

        if (this.isAnimating) {
            this.ctx.save();
            const centerX = this.canvas.width / 2;
            const progress = this.transitionProgress;
            
            const gradient = this.ctx.createLinearGradient(
                centerX - width / 2,
                0,
                centerX + width / 2,
                0
            );
            gradient.addColorStop(0, 'rgba(0,0,0,0.2)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            this.ctx.transform(
                Math.cos(progress * Math.PI),
                0,
                progress / 2,
                1,
                x + width / 2 * (1 - Math.cos(progress * Math.PI)),
                y
            );
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, width, height);
        }
        
        this.ctx.drawImage(currentImage, x, y, width, height);
        
        if (this.isAnimating) {
            this.ctx.restore();
        }
    }

    async nextPage() {
        if (this.isAnimating || this.currentPage >= this.pages.length - 1) return;
        this.isAnimating = true;
        
        const frames = 30;
        for (let i = 0; i <= frames; i++) {
            this.transitionProgress = i / frames;
            this.render();
            await new Promise(resolve => setTimeout(resolve, 16));
        }
        
        this.currentPage++;
        this.resetZoom();
        this.isAnimating = false;
        this.transitionProgress = 0;
        this.render();
    }

    async previousPage() {
        if (this.isAnimating || this.currentPage <= 0) return;
        this.isAnimating = true;
        
        const frames = 30;
        for (let i = frames; i >= 0; i--) {
            this.transitionProgress = i / frames;
            this.render();
            await new Promise(resolve => setTimeout(resolve, 16));
        }
        
        this.currentPage--;
        this.resetZoom();
        this.isAnimating = false;
        this.transitionProgress = 0;
        this.render();
    }

    updateThumbnails() {
        const container = document.getElementById('thumbnails');
        container.innerHTML = '';
        
        this.pages.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            thumb.innerHTML = `<img src="${img.src}" alt="Page ${index + 1}">`;
            thumb.addEventListener('click', () => {
                this.currentPage = index;
                this.resetZoom();
                this.render();
            });
            container.appendChild(thumb);
        });
    }

    toggleFullscreen() {
        const container = document.getElementById('book-container');
        if (!this.fullscreen) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        this.fullscreen = !this.fullscreen;
        this.resize();
    }
}

window.bookViewer = new BookViewer();
