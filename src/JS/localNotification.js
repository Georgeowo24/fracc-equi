const btnNotify = document.getElementById('btn-notify-loc');

if (btnNotify) {
    btnNotify.addEventListener('click', () => {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                alert("¡Permiso concedido! Recibirás una notificación de prueba en 10 segundos.");
                
                setTimeout(() => {
                    sendNotification();
                }, 10000);
            } else {
                alert("No podremos enviarte notificaciones si no aceptas.");
            }
        });
    });
}

function sendNotification() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('¡Hora de practicar!', {
                body: '¿Ya resolviste tus fracciones de hoy? Entra a practicar.',
                icon: './src/images/icon-192.png',
                badge: './src/images/Logo.png',
                vibrate: [200, 100, 200],
                tag: 'training-reminder',
                actions: [
                    { action: 'open', title: 'Ir a practicar' }
                ]
            });
        });
    }
}