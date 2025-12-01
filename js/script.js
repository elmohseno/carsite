/* Initialize site */
console.log("Website initialized successfully!");

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Hamburger Menu & Overlay Functionality ---
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".nav-links-mobile");
    const menuOverlay = document.querySelector(".menu-overlay");

    if (hamburger && mobileMenu && menuOverlay) {
        const toggleMenu = () => {
            hamburger.classList.toggle("active");
            mobileMenu.classList.toggle("active");
            menuOverlay.classList.toggle("active");
        };

        const closeMenu = () => {
            hamburger.classList.remove("active");
            mobileMenu.classList.remove("active");
            menuOverlay.classList.remove("active");
        };

        hamburger.addEventListener("click", toggleMenu);
        menuOverlay.addEventListener("click", closeMenu);
        
        document.querySelectorAll(".nav-links-mobile li a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });
    }

    // --- Parallax Tilt Effect for Feature Cards ---
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        const glare = document.createElement('div');
        glare.classList.add('glare');
        card.appendChild(glare);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            const tiltIntensity = 15;
            const rotateX = (deltaY / centerY) * -tiltIntensity;
            const rotateY = (deltaX / centerX) * tiltIntensity;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            glare.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
            glare.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            glare.style.opacity = '0';
        });
    });

    // --- Interactive Spotlight Logic for Trust Widget ---
    const widget = document.getElementById('trustWidget');
    if (widget) {
        let rect;
        function updateVars(e) {
            if (!rect) rect = widget.getBoundingClientRect();
            let x = ((e.clientX - rect.left) / rect.width) * 100;
            let y = ((e.clientY - rect.top) / rect.height) * 100;
            widget.style.setProperty('--mx', x + '%');
            widget.style.setProperty('--my', y + '%');
        }
        widget.addEventListener('mousemove', updateVars);
        widget.addEventListener('mouseenter', () => { rect = widget.getBoundingClientRect(); });
    }

    // --- Set Copyright Year ---
    if (document.getElementById('year')) {
        document.getElementById('year').textContent = new Date().getFullYear();
    }
});