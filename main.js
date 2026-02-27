// Inicializar Lenis para Smooth Scroll (La clave para la sensación "Premium")
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

// Sincronizar Lenis con GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// ----------------------------------------------------------------------------
// CUSTOM CURSOR
// ----------------------------------------------------------------------------
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Rastrear posición del mouse
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot al instante
    gsap.to(cursorDot, {
        x: posX,
        y: posY,
        duration: 0,
    });

    // Outline con retraso (efecto smooth)
    gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: "power2.out"
    });
});

// Interacción en elementos "Magnéticos" o Hoverables
const hoverAbles = document.querySelectorAll('[data-cursor="hover"]');

hoverAbles.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorOutline, {
            scale: 1.5,
            backgroundColor: 'rgba(212, 175, 55, 0.1)', // Gold glow
            borderColor: 'transparent',
            duration: 0.3
        });
        gsap.to(cursorDot, {
            scale: 0,
            duration: 0.3
        });
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(cursorOutline, {
            scale: 1,
            backgroundColor: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            duration: 0.3
        });
        gsap.to(cursorDot, {
            scale: 1,
            duration: 0.3
        });
    });
});

// ----------------------------------------------------------------------------
// EFECTO MAGNÉTICO (Botones que siguen un poco al mouse)
// ----------------------------------------------------------------------------
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calcular la distancia desde el centro
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        // Limitar el movimiento para que no se escape mucho
        const xAxis = distX * 0.2;
        const yAxis = distY * 0.2;

        gsap.to(el, {
            x: xAxis,
            y: yAxis,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    el.addEventListener('mouseleave', () => {
        // Volver a posición original
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)" // Efecto rebote suave
        });
    });
});


// ----------------------------------------------------------------------------
// LOADER ANIMATION (Initial Reveal)
// ----------------------------------------------------------------------------
const tl = gsap.timeline();

// Evitar scroll durante la carga
document.body.style.overflow = 'hidden';

tl.to('.loader-text', {
    duration: 1.5,
    opacity: 1,
    y: 0,
    ease: "power4.out",
    delay: 0.5
})
    .to('.loader', {
        duration: 1,
        yPercent: -100,
        ease: "power4.inOut",
        onComplete: () => {
            document.body.style.overflow = ''; // Restaurar scroll
        }
    }, "+=0.5")
    .to('.hero-title-line', {
        y: 0,
        duration: 1.2,
        stagger: 0.2, // Cada línea entra con delay
        ease: "power4.out"
    }, "-=0.5")
    .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8")
    .to('.hero-btn', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8");

// ----------------------------------------------------------------------------
// FULLSCREEN MENU (GSAP)
// ----------------------------------------------------------------------------
const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');
const line1 = document.querySelector('.line-1');
const line2 = document.querySelector('.line-2');

let isMenuOpen = false;

// Timeline del menú, pausada por defecto
const menuTl = gsap.timeline({ paused: true });

menuTl.to(menuOverlay, {
    y: 0,
    duration: 0.8,
    ease: "power4.inOut"
})
    .from(menuLinks, {
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.4");

menuToggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        // Animamos el botón hamburguesa a una X (o similiar)
        gsap.to(line1, { rotation: 45, y: 5, duration: 0.3 });
        gsap.to(line2, { rotation: -45, y: -5, width: "100%", duration: 0.3 });
        menuTl.play();
    } else {
        // Volvemos estado original
        gsap.to(line1, { rotation: 0, y: 0, duration: 0.3 });
        gsap.to(line2, { rotation: 0, y: 0, width: "75%", duration: 0.3 });
        menuTl.reverse();
    }
});

// Cerrar menú al hacer clic en un enlace
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        gsap.to(line1, { rotation: 0, y: 0, duration: 0.3 });
        gsap.to(line2, { rotation: 0, y: 0, width: "75%", duration: 0.3 });
        menuTl.reverse();
    });
});

// ----------------------------------------------------------------------------
// 3D TILT EFFECT & GLOW FOR SERVICE CARDS
// ----------------------------------------------------------------------------
const cards = document.querySelectorAll('.service-card');

cards.forEach(card => {
    const cardContent = card.querySelector('.card-content');
    const cardGlow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();

        // Coordenadas relativas dentro de la tarjeta (de 0 a ancho/alto de tarjeta)
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculamos centro
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculamos rotación (-1 a 1 invertido)
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15 grados
        const rotateY = ((x - centerX) / centerX) * 15;

        // Mover el gradiente simulando luz
        gsap.to(cardGlow, {
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(212,175,55,0.4) 0%, transparent 60%)`,
            duration: 0.1
        });

        // Rotar tarjeta 3D
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power2.out"
        });

        // Efecto Parallax en el contenido interno (se levanta un poco)
        gsap.to(cardContent, {
            z: 50,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        // Reset
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)" // Efecto gelatina al soltar
        });

        gsap.to(cardContent, {
            z: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        });
    });
}); // <--- Aquí cerramos el forEach principal

// SCROLL ANIMATIONS (GSAP ScrollTrigger)
// ----------------------------------------------------------------------------

// 1. Animación del título de la sección de Servicios
gsap.to('.section-subtitle', {
    scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
    },
    y: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.to('.section-title', {
    scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
    },
    y: 0,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.2
});

// 2. Animación Parallax del "Maestro"
gsap.to('.about-img', {
    scrollTrigger: {
        trigger: '#about',
        start: 'top bottom', // Cuando el top de #about toca el bottom del viewport
        end: 'bottom top',   // Cuando el bottom del #about toca el top del viewport
        scrub: 1             // Smooth scrubbing
    },
    y: '20%',                // Desplaza la imagen hacia abajo creando efecto parallax profundo
    ease: "none"
});

// 3. Revelado de Textos de About
gsap.to('.block-title', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 70%'
    },
    y: 0,
    stagger: 0.1,
    duration: 1,
    ease: "power4.out"
});

// 4. Booking Section Zoom In Parallax
gsap.from('.booking-title', {
    scrollTrigger: {
        trigger: '#contact',
        start: 'top 90%',
        end: 'bottom bottom',
        scrub: 1
    },
    scale: 0.8,
    opacity: 0,
    y: 100
});

// 5. Animación Parallax de Historia
gsap.to('.history-img', {
    scrollTrigger: {
        trigger: '#historia',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    },
    y: '20%',
    ease: "none"
});

// Revelar textos de Historia
gsap.to('.section-subtitle', {
    scrollTrigger: {
        trigger: '#historia',
        start: 'top 70%'
    },
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power4.out"
});

gsap.to('.section-title', {
    scrollTrigger: {
        trigger: '#historia',
        start: 'top 70%'
    },
    y: 0,
    stagger: 0.1,
    duration: 1,
    ease: "power4.out"
});

// 6. Service Cards - AnimaciÓn al hover con interactividad
gsap.to(['.service-card', '.history-image-wrapper'], {
    scrollTrigger: {
        trigger: '.max-w-7xl',
        start: 'top center'
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
});

// ----------------------------------------------------------------------------
// WHATSAPP FUNCTIONALITY
// ----------------------------------------------------------------------------
function abrirWhatsApp(servicio) {
    let mensaje;
    if (servicio) {
        mensaje = `Hola! Me gustaría reservar el servicio de ${servicio}. ¿Cuál es tu disponibilidad?`;
    } else {
        mensaje = `Hola! Me gustaría agendar una cita en BarberCo. ¿Cuál es tu disponibilidad?`;
    }
    const numero = '5491234567890'; // Reemplazar con tu número de WhatsApp
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

