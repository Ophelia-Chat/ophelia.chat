document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initYear();
    initDarkModeToggle();
    initHeroParallax();
    initTestimonialCarousel();
    initScrollToTop();
    initScrollAnimations();
    initShowcaseCarousel();
});

/**
 * Update the current year in the footer
 */
function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/**
 * Initialize dark mode toggle and time-based switching
 */
function initDarkModeToggle() {
    const darkToggle = document.querySelector('.dark-mode-toggle');
    if (!darkToggle) return;

    function isNightTime() {
        const hour = new Date().getHours();
        return hour >= 18 || hour < 6; // Between 6 PM and 6 AM
    }

    function setDarkMode(enabled) {
        document.body.classList.toggle('dark-mode', enabled);
        localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
    }

    // Check time and set dark mode on page load
    const storedPreference = localStorage.getItem('darkMode');
    if (storedPreference === null) {
        // Only apply time-based dark mode if user hasn't set a preference
        setDarkMode(isNightTime());
    } else {
        setDarkMode(storedPreference === 'enabled');
    }

    // Check time every minute
    setInterval(() => {
        if (localStorage.getItem('darkMode') === null) {
            setDarkMode(isNightTime());
        }
    }, 60000);

    // Manual toggle still works
    darkToggle.addEventListener('click', () => {
        const newState = !document.body.classList.contains('dark-mode');
        setDarkMode(newState);
    });
}

/**
 * Create a parallax effect for the hero background
 */
function initHeroParallax() {
    const canvas = document.getElementById('parallaxCanvas');
    const orbs = document.querySelectorAll('.orb');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Create particles
    function createParticles() {
        particles = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                hue: Math.random() * 30 + 330 // Pink hues
            });
        }
    }
    
    // Animate particles
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, i) => {
            // Update
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 100%, 75%, 0.1)`;
            ctx.fill();
            
            // Connect particles
            particles.forEach((otherParticle, j) => {
                if (i === j) return;
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `hsla(${particle.hue}, 100%, 75%, ${0.1 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Handle mouse movement
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (window.innerWidth - e.pageX * 2) / 20;
        mouseY = (window.innerHeight - e.pageY * 2) / 20;
        
        orbs.forEach((orb, index) => {
            const intensity = (index + 1) * 0.2;
            orb.style.transform = `translate(${mouseX * intensity}px, ${mouseY * intensity}px)`;
        });

        particles.forEach(particle => {
            particle.x += (mouseX - particle.x) * 0.01;
            particle.y += (mouseY - particle.y) * 0.01;
        });
    });
    
    // Initialize
    resizeCanvas();
    createParticles();
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // Cleanup on component unmount
    return () => {
        cancelAnimationFrame(animationFrame);
    };
}

/**
 * Initialize a testimonial carousel that displays random testimonials in sequence
 * and uses aria-live for screen reader announcements.
 */
function initTestimonialCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const carousel = document.querySelector('.testimonial-carousel');

    if (!carousel || slides.length === 0) return;

    let currentSlide = 0;
    let autoplayInterval;
    let usedIndexes = new Set();
    const AUTOPLAY_DELAY = 7000;

    // Add aria-live for screen readers to announce changes
    carousel.setAttribute('aria-live', 'polite');

    function getRandomSlideIndex() {
        if (usedIndexes.size === slides.length) {
            usedIndexes.clear();
        }
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * slides.length);
        } while (usedIndexes.has(randomIndex));
        usedIndexes.add(randomIndex);
        return randomIndex;
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            slide.style.opacity = i === index ? '1' : '0';
            // Optional: Could add aria-hidden attributes if needed
            slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });
    }

    function nextSlide() {
        currentSlide = getRandomSlideIndex();
        showSlide(currentSlide);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    showSlide(currentSlide);
    startAutoplay();

    carousel.addEventListener('mouseover', stopAutoplay);
    carousel.addEventListener('mouseout', startAutoplay);
}

/**
 * Initialize a scroll-to-top button for better navigation
 */
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Initialize scroll-triggered animations using GSAP and ScrollTrigger if available
 */
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-animation="fade-in-up"]').forEach((section) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            opacity: 0,
            y: 50,
            duration: 1,
            onComplete: () => {
                const title = section.querySelector('.section-title');
                if (title) {
                    title.classList.add('animate-underline');
                }
            }
        });
    });
}

/**
 * Initialize the showcase carousel with horizontal scrolling
 */
function initShowcaseCarousel() {
    const showcaseCarousel = document.querySelector('.showcase-carousel');
    const prevCarouselBtn = document.querySelector('.showcase-carousel-prev');
    const nextCarouselBtn = document.querySelector('.showcase-carousel-next');
    if (!showcaseCarousel || !prevCarouselBtn || !nextCarouselBtn) return;

    let currentCarouselSlide = 0;
    const carouselItems = document.querySelectorAll('.showcase-item');
    const itemsToShow = 2;
    const itemWidth = 320; // Approx width + gap

    function updateCarousel() {
        showcaseCarousel.style.transform = `translateX(-${currentCarouselSlide * itemWidth}px)`;
    }

    prevCarouselBtn.addEventListener('click', () => {
        currentCarouselSlide = Math.max(currentCarouselSlide - 1, 0);
        updateCarousel();
    });

    nextCarouselBtn.addEventListener('click', () => {
        if (currentCarouselSlide < carouselItems.length - itemsToShow) {
            currentCarouselSlide++;
            updateCarousel();
        }
    });
}
