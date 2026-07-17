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
});
