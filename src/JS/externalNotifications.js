function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const btnNotifyExt = document.getElementById('btn-notify-ext');

if (btnNotifyExt) {
    btnNotifyExt.addEventListener('click', async () => {
        // 1. Reutilizamos el registro existente del SW
        const register = await navigator.serviceWorker.ready;

        // 2. Obtener clave del servidor
        const response = await fetch('http://localhost:3000/key'); 
        const { publicKey } = await response.json();
        const convertedVapidKey = urlBase64ToUint8Array(publicKey);

        // 3. Suscribirse
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        // 4. Guardar en backend
        await fetch('http://localhost:3000/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: { 'content-type': 'application/json' }
        });

        alert("¡Suscrito al servidor Push!");
    });
}



// Invoke-RestMethod -Method Post -Uri "http://localhost:3000/send-notification"
// curl -X POST http://localhost:3000/send-notification