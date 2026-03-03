/* Main JS for GlobalCart */

document.addEventListener('DOMContentLoaded', () => {
    // Header background change on scroll
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
            header.style.top = '0';
        } else {
            header.classList.remove('scrolled');
            header.style.top = '40px';
        }
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add to cart animation (visual only)
    const cartBtn = document.querySelector('.header-actions .btn');
    let cartCount = 0;

    // Delegate click events for dynamically added buttons if any, 
    // though here we can still use static attachment for now but we'll use a helper
    const handleAddToCart = (e) => {
        if (e.target.classList.contains('card-btn')) {
            cartCount++;
            cartBtn.textContent = `Cart (${cartCount})`;

            const originalText = e.target.textContent;
            e.target.textContent = 'Added!';
            e.target.style.backgroundColor = '#27ae60';

            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.backgroundColor = '';
            }, 1500);
        }
    };

    document.addEventListener('click', handleAddToCart);

    // Slider Class
    class GlobalSlider {
        constructor(containerId, options = {}) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;

            this.track = this.container.querySelector('.slider-track');
            this.prevBtn = this.container.querySelector('.prev');
            this.nextBtn = this.container.querySelector('.next');
            this.dotsContainer = this.container.querySelector('.slider-dots');
            this.items = this.container.querySelectorAll('.slider-item');

            this.currentIndex = 0;
            this.autoPlayDelay = options.autoPlayDelay || 5000;
            this.isPaused = false;

            this.init();
        }

        getVisibleItems() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        getMaxIndex() {
            return Math.max(0, this.items.length - this.getVisibleItems());
        }

        init() {
            if (this.items.length === 0) return;

            // Create dots
            if (this.dotsContainer) {
                this.dotsContainer.innerHTML = '';
                const maxIndex = this.getMaxIndex();
                for (let i = 0; i <= maxIndex; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => this.goToSlide(i));
                    this.dotsContainer.appendChild(dot);
                }
            }

            this.updateSlider();

            // Controls
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.next());
            }
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prev());
            }

            // Auto play
            this.startAutoPlay();

            // Pause on hover
            this.container.addEventListener('mouseenter', () => this.isPaused = true);
            this.container.addEventListener('mouseleave', () => this.isPaused = false);

            // Resize handling
            window.addEventListener('resize', () => {
                const maxIdx = this.getMaxIndex();
                if (this.currentIndex > maxIdx) this.currentIndex = maxIdx;
                this.initDots(); // Rebuild dots on resize since visible items might change
                this.updateSlider();
            });
        }

        initDots() {
            if (!this.dotsContainer) return;
            this.dotsContainer.innerHTML = '';
            const maxIndex = this.getMaxIndex();
            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === this.currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
            }
        }

        updateSlider() {
            if (this.items.length === 0) return;
            const itemWidth = this.items[0].offsetWidth + 32; // width + gap
            this.track.style.transform = `translateX(-${this.currentIndex * itemWidth}px)`;

            const dots = this.container.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateSlider();
        }

        next() {
            const maxIndex = this.getMaxIndex();
            if (this.currentIndex < maxIndex) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0;
            }
            this.updateSlider();
        }

        prev() {
            const maxIndex = this.getMaxIndex();
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = maxIndex;
            }
            this.updateSlider();
        }

        startAutoPlay() {
            setInterval(() => {
                if (!this.isPaused) {
                    this.next();
                }
            }, this.autoPlayDelay);
        }
    }

    // Initialize all sliders
    new GlobalSlider('categories-slider');
    new GlobalSlider('featured-slider');
    new GlobalSlider('gadgets-slider');
    new GlobalSlider('top-selling-slider');

    // Newsletter subscription handling
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = subscribeForm.querySelector('input');
            const button = subscribeForm.querySelector('button');

            if (input.value) {
                button.textContent = 'Subscribed!';
                button.style.backgroundColor = '#27ae60';
                input.value = '';
                input.disabled = true;
                button.disabled = true;
            }
        });
    }
});
