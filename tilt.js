/**
 * Vanilla JS Tilt Effect
 * Adds a 3D tilt interaction to elements with class 'tilt-effect'
 */
class VanillaTilt {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.element.style.transition = 'transform 0.1s ease-out';
        this.element.style.transformStyle = 'preserve-3d';
    }

    onMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max tilt: 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }

    onMouseLeave() {
        this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        this.element.style.transition = 'transform 0.5s ease';
    }
}

// Initialize tilt on cards (only on desktop to save mobile performance)
if (window.innerWidth > 768) {
    const cards = document.querySelectorAll('.card, .material-box, .about-card, .contact-card');
    cards.forEach(card => new VanillaTilt(card));
}
