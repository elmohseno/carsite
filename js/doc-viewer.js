document.addEventListener('DOMContentLoaded', () => {
    // Get all the necessary elements from the DOM
    const thumbnailLinks = document.querySelectorAll('.doc-thumb-link');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCloseBtn = document.getElementById('lightbox-close');
    const zoomSlider = document.getElementById('zoom-slider');

    if (!lightboxOverlay || !lightboxImage || !lightboxCloseBtn || !zoomSlider) {
        return; // Exit if essential elements are missing
    }

    // --- State variables for Zoom and Pan ---
    const minZoom = 1;
    const maxZoom = 4;
    let currentScale = 1;
    let isDraggingImage = false;
    let startX, startY;
    let initialTranslateX = 0, initialTranslateY = 0;
    let currentTranslateX = 0, currentTranslateY = 0;

    // --- Core Functions ---

    const openLightbox = (imageUrl) => {
        resetState();
        lightboxImage.setAttribute('src', imageUrl);
        lightboxOverlay.classList.add('visible');
    };

    const closeLightbox = () => {
        lightboxOverlay.classList.remove('visible');
        setTimeout(resetState, 300);
    };

    const resetState = () => {
        currentScale = 1;
        isDraggingImage = false;
        initialTranslateX = 0; initialTranslateY = 0;
        currentTranslateX = 0; currentTranslateY = 0;
        lightboxImage.style.transform = 'translate(0px, 0px) scale(1)';
        zoomSlider.value = 1;
    };

    const updateImageTransform = () => {
        lightboxImage.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
    };
    
    // --- Zoom Logic ---

    const handleWheel = (event) => {
        event.preventDefault();

        const zoomFactor = 1.1;
        if (event.deltaY < 0) { // Zoom in
            currentScale = Math.min(maxZoom, currentScale * zoomFactor);
        } else { // Zoom out
            currentScale = Math.max(minZoom, currentScale / zoomFactor);
        }
        
        // This mirrors the slider's behavior and prevents the image from being left off-center.
        // This is the ONLY part of the function that affects position.
        if (currentScale <= 1.05) {
            currentTranslateX = 0;
            currentTranslateY = 0;
        }

        zoomSlider.value = currentScale;
        updateImageTransform();
    };

    // --- Slider Drag and Click Logic ---
    
    const startSliderInteraction = (event) => {
        const sliderRect = zoomSlider.getBoundingClientRect();
        
        const updateSliderValue = (clientX) => {
            const newX = clientX - sliderRect.left;
            const percentage = Math.max(0, Math.min(1, newX / sliderRect.width));
            const newValue = minZoom + percentage * (maxZoom - minZoom);
            zoomSlider.value = newValue;
            zoomSlider.dispatchEvent(new Event('input'));
        };

        updateSliderValue(event.clientX);

        const handleMove = (moveEvent) => {
            updateSliderValue(moveEvent.clientX);
        };

        const endDrag = () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', endDrag);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', endDrag);
    };

    const handleSliderInput = (event) => {
        currentScale = parseFloat(event.target.value);
        if (currentScale <= 1.05) {
            currentTranslateX = 0;
            currentTranslateY = 0;
        }
        updateImageTransform();
    };

    // --- Image Pan Logic ---

    const onPanStart = (event) => {
        if (currentScale <= 1 || (event.button && event.button !== 0)) return;
        event.preventDefault();
        
        startX = event.pageX || event.touches[0].pageX;
        startY = event.pageY || event.touches[0].pageY;
        
        isDraggingImage = true;
        initialTranslateX = currentTranslateX;
        initialTranslateY = currentTranslateY;
        lightboxImage.style.transition = 'none';
    };

    const onPanMove = (event) => {
        if (!isDraggingImage) return;
        event.preventDefault();
        
        const currentX = event.pageX || event.touches[0].pageX;
        const currentY = event.pageY || event.touches[0].pageY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        currentTranslateX = initialTranslateX + deltaX;
        currentTranslateY = initialTranslateY + deltaY;
        updateImageTransform();
    };

    const onPanEnd = () => {
        isDraggingImage = false;
        lightboxImage.style.transition = '';
    };

    // --- Assign Event Listeners ---
    thumbnailLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(link.getAttribute('href'));
    }));

    lightboxImage.addEventListener('wheel', handleWheel, { passive: false });
    lightboxImage.addEventListener('mousedown', onPanStart);
    
    window.addEventListener('mousemove', onPanMove);
    window.addEventListener('mouseup', onPanEnd);
    
    zoomSlider.addEventListener('input', handleSliderInput);
    zoomSlider.addEventListener('mousedown', startSliderInteraction);
    
    lightboxCloseBtn.addEventListener('click', closeLightbox);
    
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});