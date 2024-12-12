document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Dark Mode Toggle
    const darkToggle = document.querySelector('.dark-mode-toggle');
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Parallax effect on hero background
    const heroBg = document.getElementById('heroBg');
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX*2) / 90;
        const y = (window.innerHeight - e.pageY*2) / 90;
        heroBg.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Testimonial Carousel
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let autoplayInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }

    // Autoplay for testimonials
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        carousel.addEventListener('mouseover', stopAutoplay);
        carousel.addEventListener('mouseout', startAutoplay);
    }

    showSlide(currentSlide);
    startAutoplay();

    // Scroll-to-top button
    const scrollBtn = document.querySelector('.scroll-to-top');
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

    // GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in and slide-up for sections
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
                // After animation, if there's a title, trigger underline animation
                const title = section.querySelector('.section-title');
                if (title) {
                    title.classList.add('animate-underline');
                }
            }
        });
    });

    // Showcase Carousel (horizontal scroll)
    const showcaseCarousel = document.querySelector('.showcase-carousel');
    const prevCarouselBtn = document.querySelector('.showcase-carousel-prev');
    const nextCarouselBtn = document.querySelector('.showcase-carousel-next');

    if (showcaseCarousel && prevCarouselBtn && nextCarouselBtn) {
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
});
