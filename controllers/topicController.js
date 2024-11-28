const Topic = require('../models/Topic');

class TopicController {
    // Mostrar todos los temas
    static async index(req, res) {
        try {
            const topics = await Topic.getAll();
            res.render('index', { topics });
        } catch (error) {
            console.error('Error getting topics:', error);
            res.status(500).send('Error al obtener los temas');
        }
    }

    // Crear un nuevo tema
    static async create(req, res) {
        try {
            const { title } = req.body;
            if (!title) {
                return res.status(400).send('El título es requerido');
            }
            const newTopicId = await Topic.create(title);
            const topics = await Topic.getAll();
            req.io.emit('topics-updated', topics);
            res.redirect('/');
        } catch (error) {
            console.error('Error creating topic:', error);
            res.status(500).send('Error al crear el tema');
        }
    }

    // Actualizar un tema
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { title } = req.body;
            if (!title) {
                return res.status(400).send('El título es requerido');
            }
            await Topic.update(id, title);
            const topics = await Topic.getAll();
            req.io.emit('topics-updated', topics);
            res.redirect('/');
        } catch (error) {
            console.error('Error updating topic:', error);
            res.status(500).send('Error al actualizar el tema');
        }
    }

    // Eliminar un tema
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Topic.delete(id);
            const topics = await Topic.getAll();
            req.io.emit('topics-updated', topics);
            res.json({ message: 'Tema eliminado exitosamente' });
        } catch (error) {
            console.error('Error deleting topic:', error);
            res.status(500).json({ error: 'Error al eliminar el tema' });
        }
    }

    // Votar por un tema
    static async vote(req, res) {
        try {
            const { id } = req.params;
            await Topic.vote(id);
            const topics = await Topic.getAll(); // Obtener lista actualizada y ordenada
            req.io.emit('topics-updated', topics); // Emitir actualización a todos los clientes
            res.json(topics);
        } catch (error) {
            console.error('Error voting for topic:', error);
            res.status(500).json({ error: 'Error al votar por el tema' });
        }
    }
}

module.exports = TopicController;
