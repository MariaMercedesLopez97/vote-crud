const express = require('express');
const router = express.Router();
const TopicController = require('../controllers/topicController');

// Ruta para mostrar todos los temas
router.get('/', TopicController.index);

// Ruta para crear un nuevo tema
router.post('/temas', TopicController.create);

// Ruta para actualizar un tema
router.post('/temas/:id', TopicController.update);

// Ruta para eliminar un tema
router.delete('/temas/:id', TopicController.delete);

// Ruta para votar por un tema
router.post('/temas/:id/votar', TopicController.vote);

module.exports = router;
