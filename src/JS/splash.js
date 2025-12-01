document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    // Duración del splash screen en milisegundos
    const splashDuration = 500; 

    setTimeout(() => {
        splashScreen.classList.add('fade-out'); 
        
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none'; 
            mainContent.style.display = 'block'; 
            document.body.style.overflow = 'auto'; 
        }, { once: true }); 
    }, splashDuration);
});