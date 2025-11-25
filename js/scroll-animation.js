// Wait for the DOM to be fully loaded
window.addEventListener('load', () => {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger is not loaded!');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const pathContainer = document.querySelector('#scroll-path-container');
    const path = document.querySelector('#scroll-path');
    const pageWrapper = document.querySelector('#page-wrapper');
    
    if (!path || !pathContainer || !pageWrapper) {
        console.error('Required elements for scroll animation not found!');
        return;
    }

    // Creates a new, dynamic path that starts from the left
    const createArtisticPath = () => {
        const w = pageWrapper.scrollWidth;
        const h = pageWrapper.scrollHeight;
        
        // Define path points relative to the page dimensions
        const startX = 40; // Start near the left edge
        const startY = 250; // Start below the hero section

        // Points to create a flowing S-curve down the page
        const p1x = w * 0.85;
        const p1y = h * 0.25;

        const p2x = w * 0.15;
        const p2y = h * 0.5;

        const p3x = w * 0.9;
        const p3y = h * 0.75;

        const endX = w * 0.5;
        const endY = h - 250; // End above the footer

        // Using Bezier curves (C and S) for a smooth, flowing line
        const pathData = `M ${startX},${startY} C ${w * 0.3},${h * 0.1} ${w * 0.7},${h*0.15} ${p1x},${p1y} S ${w*0.3},${h*0.4} ${p2x},${p2y} S ${w*0.8},${h*0.65} ${p3x},${p3y} S ${w*0.6},${h-100} ${endX},${endY}`;
        
        return pathData;
    };

    // Updates the SVG container's dimensions and the path's shape
    const updatePathAndContainer = () => {
        const width = pageWrapper.scrollWidth;
        const height = pageWrapper.scrollHeight;

        // Set the SVG container to match the page wrapper's dimensions
        pathContainer.setAttribute('width', width);
        pathContainer.setAttribute('height', height);
        pathContainer.setAttribute('viewBox', `0 0 ${width} ${height}`);
        
        // Generate and set the new path data
        const newPathData = createArtisticPath();
        path.setAttribute('d', newPathData);
    };

    let scrollTriggerInstance;

    const initAnimation = () => {
        // Kill the old ScrollTrigger instance if it exists to prevent conflicts
        if (scrollTriggerInstance) {
            scrollTriggerInstance.kill();
        }
        
        // Update the path shape and dimensions
        updatePathAndContainer();

        // Use a small timeout to ensure the browser has calculated the new path length
        setTimeout(() => {
            const pathLength = path.getTotalLength();
            
            if (!pathLength || !isFinite(pathLength)) {
                console.warn('Could not calculate a valid path length. Retrying.');
                setTimeout(initAnimation, 200); // Retry if calculation fails
                return;
            }

            // Set initial state: path is fully "undrawn"
            path.style.strokeDasharray = pathLength;
            path.style.strokeDashoffset = pathLength;

            // Create the ScrollTrigger animation
            scrollTriggerInstance = ScrollTrigger.create({
                trigger: "#page-wrapper", // Animate based on the wrapper's scroll height
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2, // A slight smoothing effect
                onUpdate: (self) => {
                    // On scroll, update the strokeDashoffset to "draw" the path
                    const offset = pathLength * (1 - self.progress);
                    path.style.strokeDashoffset = offset;
                },
            });

            // Refresh ScrollTrigger to ensure calculations are correct
            ScrollTrigger.refresh();

        }, 100);
    };

    // Initial setup
    initAnimation();
    
    // Re-initialize animation on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        // Debounce resize event for better performance
        resizeTimeout = setTimeout(initAnimation, 300);
    });
    
    // --- Animation for the Final CTA Panel ---
    const ctaPanel = document.querySelector('#final-cta .cta-panel');
    if (ctaPanel) {
        gsap.from(ctaPanel, {
            opacity: 0,
            scale: 0.8,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#final-cta',
                start: 'top 70%',
                toggleActions: 'play none none none',
            }
        });
    }
});