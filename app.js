const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const topicRoutes = require('./routes/topicRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

// Configuración de Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Hacer io disponible en todas las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Usar las rutas
app.use('/', topicRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
