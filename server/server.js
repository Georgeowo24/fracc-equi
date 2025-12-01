const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- CONFIGURACIÓN VAPID ---
const publicVapidKey = 'TU_PUBLIC_KEY_AQUI';
const privateVapidKey = 'TU_PRIVATE_KEY_AQUI';

webpush.setVapidDetails(
  'mailto:jtorresromero30@gmail.com',
  publicVapidKey,
  privateVapidKey
);

let subscriptions = [];

// Ruta 1: El frontend pide la clave pública para suscribirse
app.get('/key', (req, res) => {
    res.json({ publicKey: publicVapidKey });
});

// Ruta 2: El frontend envía su suscripción y la guardamos
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
    console.log('Nueva suscripción guardada');
});

// Ruta 3: Disparar notificación a TODOS (para probar)
app.post('/send-notification', (req, res) => {
    const notificationPayload = JSON.stringify({
        title: '¡Hora de practicar!',
        body: 'Tus ejercicios de fracciones te esperan.',
        icon: './src/images/icon-192.png'
    });

    // Enviamos a todas las suscripciones guardadas
    const promises = subscriptions.map(sub => 
        webpush.sendNotification(sub, notificationPayload)
            .catch(err => console.error("Error enviando a uno:", err))
    );

    Promise.all(promises).then(() => res.json({ message: 'Enviado!' }));
});

const port = 3000;
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));