document.addEventListener('DOMContentLoaded', () => {
    // 1. Efecto Scroll en Header
    const header = document.querySelector('.main-header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    // Ejecutar una vez al inicio por si ya está desplazado
    handleScroll();

    // 2. Menú de Navegación Móvil
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
        menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
        menuToggleBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Evitar scroll en el fondo al estar abierto
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    menuToggleBtn.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer click en cualquier link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // 3. Intersection Observer para Revelado al Desplazar (Scroll Reveal)
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Dejar de observar una vez revelado
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null, // viewport
            threshold: 0.15, // 15% del elemento visible
            rootMargin: '0px 0px -50px 0px' // Margen inferior para que active un poco antes de verse todo
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback para navegadores antiguos
        revealElements.forEach(el => {
            el.classList.add('revealed');
        });
    }
    // 4. Inicializador de Carrusel de Productos
    const initCarousel = (trackId, prevBtnId, nextBtnId, indicatorsContainerId) => {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const indicatorsContainer = document.getElementById(indicatorsContainerId);

        if (!track || !prevBtn || !nextBtn) return;

        const items = track.querySelectorAll('.product-carousel-item');
        const totalSlides = items.length;
        let currentIndex = 0;

        // Indicadores
        let indicators = [];
        if (indicatorsContainer) {
            indicators = indicatorsContainer.querySelectorAll('.indicator');
        }

        const updateCarousel = (index) => {
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            // Desplazar track
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Actualizar indicadores
            indicators.forEach((ind, i) => {
                if (i === currentIndex) {
                    ind.classList.add('active');
                } else {
                    ind.classList.remove('active');
                }
            });
        };

        // Eventos botones
        prevBtn.addEventListener('click', () => {
            updateCarousel(currentIndex - 1);
        });

        nextBtn.addEventListener('click', () => {
            updateCarousel(currentIndex + 1);
        });

        // Eventos indicadores
        indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => {
                updateCarousel(i);
            });
        });

        // Soporte Swipe táctil
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, { passive: true });

        const handleGesture = () => {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                updateCarousel(currentIndex + 1);
            } else if (touchEndX - touchStartX > swipeThreshold) {
                updateCarousel(currentIndex - 1);
            }
        };
    };

    // Inicializar carruseles de Aftershaves y Ceras
    // Página index.html (Teaser)
    initCarousel('teaserAftershaveCarouselTrack', 'teaserAftershaveCarouselPrev', 'teaserAftershaveCarouselNext', 'teaserAftershaveCarouselIndicators');
    initCarousel('teaserWaxCarouselTrack', 'teaserWaxCarouselPrev', 'teaserWaxCarouselNext', 'teaserWaxCarouselIndicators');

    // Página productos.html (Catálogo)
    initCarousel('aftershaveCarouselTrack', 'aftershaveCarouselPrev', 'aftershaveCarouselNext', 'aftershaveCarouselIndicators');
    initCarousel('waxCarouselTrack', 'waxCarouselPrev', 'waxCarouselNext', 'waxCarouselIndicators');

    // 5. Efecto Parallax en la Imagen Hero
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrollValue = window.scrollY;
            heroImage.style.transform = `translateY(${scrollValue * 0.15}px) scale(1.08)`;
        }, { passive: true });
    }
});
