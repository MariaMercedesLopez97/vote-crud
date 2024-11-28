// Conectar al WebSocket
const socket = io();

// Escuchar actualizaciones de temas
socket.on('topics-updated', function(topics) {
    actualizarListaTemas(topics);
});

// Funciones para manejar el modal de edición
function mostrarEditar(id, title) {
    const modal = document.getElementById('editarModal');
    const tituloInput = document.getElementById('editarTemaTitulo');
    const idInput = document.getElementById('editarTemaId');
    
    modal.style.display = 'block';
    tituloInput.value = title;
    idInput.value = id;
}

function cerrarModal() {
    const modal = document.getElementById('editarModal');
    modal.style.display = 'none';
}

// Manejar el envío del formulario de edición
document.getElementById('editarTemaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editarTemaId').value;
    const title = document.getElementById('editarTemaTitulo').value;
    
    try {
        const response = await fetch(`/temas/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `title=${encodeURIComponent(title)}`
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar el tema');
        }
        cerrarModal();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el tema');
    }
});

// Función para eliminar un tema
async function eliminarTema(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este tema?')) {
        return;
    }
    
    try {
        const response = await fetch(`/temas/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar el tema');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el tema');
    }
}

// Función para votar por un tema
async function votar(id) {
    try {
        const response = await fetch(`/temas/${id}/votar`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Error al votar por el tema');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al votar por el tema');
    }
}

// Función para actualizar la lista de temas
function actualizarListaTemas(topics) {
    const listaTemas = document.getElementById('listaTemas');
    listaTemas.innerHTML = '';

    if (topics && topics.length > 0) {
        topics.forEach(topic => {
            const li = document.createElement('li');
            li.className = 'tema-item';
            li.setAttribute('data-id', topic.id);
            
            li.innerHTML = `
                <div class="tema-contenido">
                    <span class="tema-titulo">${topic.title}</span>
                    <span class="votos-count">Votos: ${topic.votes}</span>
                </div>
                <div class="tema-acciones">
                    <button class="votar-btn" onclick="votar(${topic.id})">Votar</button>
                    <button class="editar-btn" onclick="mostrarEditar(${topic.id}, '${topic.title}')">Editar</button>
                    <button class="eliminar-btn" onclick="eliminarTema(${topic.id})">Eliminar</button>
                </div>
            `;
            
            listaTemas.appendChild(li);
        });
    } else {
        listaTemas.innerHTML = '<li>No hay temas disponibles</li>';
    }
}
