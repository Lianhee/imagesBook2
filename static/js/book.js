class BookViewer {
    constructor() {
        this.currentPage = 0;
        this.pages = [];
        this.canvas = document.getElementById('book-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isAnimating = false;
        this.fullscreen = false;
        
        this.initializeEvents();
        this.resize();
    }

    initializeEvents() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextPage();
            if (e.key === 'ArrowLeft') this.previousPage();
        });

        document.getElementById('prev-btn').addEventListener('click', () => this.previousPage());
        document.getElementById('next-btn').addEventListener('click', () => this.nextPage());
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
    }

    resize() {
        const container = document.getElementById('book-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.render();
    }

    async loadImages(files) {
        this.pages = [];
        for (let file of files) {
            const img = new Image();
            img.src = `/uploads/${file}`;
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
        
        // Calculate aspect ratio to fit image
        const ratio = Math.min(
            this.canvas.width / currentImage.width,
            this.canvas.height / currentImage.height
        );
        
        const width = currentImage.width * ratio;
        const height = currentImage.height * ratio;
        const x = (this.canvas.width - width) / 2;
        const y = (this.canvas.height - height) / 2;
        
        this.ctx.drawImage(currentImage, x, y, width, height);
    }

    async nextPage() {
        if (this.isAnimating || this.currentPage >= this.pages.length - 1) return;
        this.isAnimating = true;
        
        // Page turn animation
        const steps = 20;
        for (let i = 0; i < steps; i++) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Create page curl effect
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        
        this.currentPage++;
        this.render();
        this.isAnimating = false;
    }

    async previousPage() {
        if (this.isAnimating || this.currentPage <= 0) return;
        this.isAnimating = true;
        
        const steps = 20;
        for (let i = 0; i < steps; i++) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Create reverse page curl effect
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        
        this.currentPage--;
        this.render();
        this.isAnimating = false;
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
