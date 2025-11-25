/* Initialize site */
console.log("Website initialized successfully!");

/*
  Parallax Tilt Effect for Feature Cards
  This script adds a 3D hover effect to elements with the class 'feature-card'.
*/
document.addEventListener('DOMContentLoaded', () => {
    // --- Tilt Effect Logic ---
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        // Add a wrapper for the glare effect
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

            // Adjust this value to change the tilt intensity
            const tiltIntensity = 15; // Higher value = more tilt

            const rotateX = (deltaY / centerY) * -tiltIntensity;
            const rotateY = (deltaX / centerX) * tiltIntensity;

            // Apply the 3D transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            
            // Update glare position
            glare.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
            glare.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            // Reset transform and glare on mouse leave
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            glare.style.opacity = '0';
        });
    });

    // --- Interactive Spotlight Logic ---
    var widget = document.getElementById('trustWidget');
    if (widget) {
        var rect;
        function updateVars(e) {
            if (!rect) rect = widget.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;
            widget.style.setProperty('--mx', x + '%');
            widget.style.setProperty('--my', y + '%');
        }
        widget.addEventListener('mousemove', updateVars);
        widget.addEventListener('mouseenter', function(){ rect = widget.getBoundingClientRect(); });
    }
});

/*
  Initialize other site scripts if any.
*/
// Set the copyright year (if not already set in HTML)
if (document.getElementById('year')) {
    document.getElementById('year').textContent = new Date().getFullYear();
}