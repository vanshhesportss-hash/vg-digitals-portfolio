document.addEventListener('DOMContentLoaded', () => {
    // Mobile Responsive Drawer Handler
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            burgerMenu.classList.toggle('open');
        });
    }

    // Scroll-Driven Parabolic Basketball Arc Calculator
    const player = document.getElementById('scroll-player');
    const ball = document.getElementById('scroll-ball');
    const rim = document.querySelector('.rim');
    const container = document.querySelector('.hero-graphic-container');

    if (player && ball && container) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(scrollTop / (maxScroll * 0.15), 1); 

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const startX = 40;
            const endX = containerWidth - 110;
            const currentX = startX + (endX - startX) * scrollPercent;

            const peakHeight = 160; 
            const ballArcY = 4 * peakHeight * scrollPercent * (1 - scrollPercent);
            
            const startYPlayer = 0;
            const endYPlayer = -containerHeight + 160;
            const currentPlayerY = startYPlayer + (endYPlayer - startYPlayer) * scrollPercent;

            player.style.transform = `translate(${currentX - 40}px, ${currentPlayerY}px)`;
            ball.style.transform = `translate(${currentX - 60}px, ${currentPlayerY - ballArcY}px) rotate(${scrollPercent * 720}deg)`;

            if (scrollPercent >= 0.98) {
                rim.classList.add('rim-shake');
                player.textContent = '🏀💥'; 
            } else {
                rim.classList.remove('rim-shake');
                player.textContent = '🏃‍♂️';
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Responsive Drawer Handler
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            burgerMenu.classList.toggle('open');
        });
    }
});