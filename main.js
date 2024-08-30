// Manejo de recursos en LocalStorage
function obtenerRecursos() {
    return JSON.parse(localStorage.getItem('recursos')) || [];
}

function guardarRecursos(recursos) {
    localStorage.setItem('recursos', JSON.stringify(recursos));
}

// Función para mostrar mensajes de alerta
function mostrarAlerta(mensaje, tipo = 'success') {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `<div class="bg-${tipo === 'success' ? 'green' : 'red'}-500 text-white p-4 rounded-lg">${mensaje}</div>`;
    alertContainer.classList.remove('hidden');
    setTimeout(() => {
        alertContainer.classList.add('hidden');
    }, 3000);
}

// Función para manejar la selección de estrellas
function manejarEstrellas() {
    const estrellas = document.querySelectorAll('#rating-container i');
    estrellas.forEach(estrella => {
        estrella.addEventListener('click', (event) => {
            const rating = event.target.getAttribute('data-value');
            document.getElementById('rating').value = rating;
            actualizarEstrellas(rating);
        });
    });
}

function actualizarEstrellas(rating) {
    const estrellas = document.querySelectorAll('#rating-container i');
    estrellas.forEach(estrella => {
        estrella.classList.toggle('text-yellow-500', estrella.getAttribute('data-value') <= rating);
    });
}

function validarFormulario(nombre, genero, plataforma, estado, formato, fecha, valoracion) {
    if (!nombre || !genero || !plataforma || !formato || !estado) {
        mostrarAlerta('Todos los campos obligatorios deben ser completados', 'error');
        return false;
    }

    // Validar la fecha solo si el estado es "Terminado"
    if (estado === 'Terminado') {
        if (!fecha) {
            mostrarAlerta('La fecha de terminación es obligatoria cuando el estado es Terminado', 'error');
            return false;
        }

        if (new Date(fecha) > new Date()) {
            mostrarAlerta('La fecha de terminación no puede ser en el futuro', 'error');
            return false;
        }
    }

    if ((estado === 'En progreso' || estado === 'Pendiente') && fecha) {
        mostrarAlerta('La fecha no debe ser completada cuando el estado es En progreso o Pendiente', 'error');
        return false;
    }

    // Validar que la valoración esté entre 1 y 5
    if (valoracion < 1 || valoracion > 5) {
        mostrarAlerta('La valoración debe estar entre 1 y 5 estrellas', 'error');
        return false;
    }

    return true;
}

// Función para habilitar o deshabilitar el campo de fecha según el estado
function manejarEstadoCambio() {
    const estado = document.getElementById('status').value;
    const fechaInput = document.getElementById('completion-date');
    
    if (estado === 'En progreso' || estado === 'Pendiente' ) {
        fechaInput.disabled = true; 
        fechaInput.value = '';      
    } else {
        fechaInput.disabled = false; 
    }

}

document.getElementById('status').addEventListener('change', manejarEstadoCambio);


document.addEventListener('DOMContentLoaded', manejarEstadoCambio);

// Función para mostrar la lista de recursos
function mostrarRecursos() {
    const recursos = obtenerRecursos();
    const lista = document.getElementById('resource-list');
    lista.innerHTML = '';

    recursos.forEach((recurso, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${recurso.nombre}</td>
            <td>${recurso.genero}</td>
            <td>${recurso.plataforma.join(', ')}</td>
            <td>${recurso.estado.join(', ')}</td>
            <td>${recurso.formato.join(', ')}</td>
            <td>${recurso.fecha}</td>
            <td>${'⭐'.repeat(recurso.valoracion)}</td>
            <td>${recurso.resena}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarRecurso(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarRecurso(${index})">Eliminar</button>
            </td>
        `;
        lista.appendChild(fila);
    });
}

// Función para añadir o actualizar un recurso
document.getElementById('resource-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('resource-name').value;
    const genero = document.getElementById('genre').value;
    const plataforma = Array.from(document.getElementById('platform').selectedOptions).map(option => option.value);
    const estado = Array.from(document.getElementById('status').selectedOptions).map(option => option.value);
    const formato = Array.from(document.getElementById('format').selectedOptions).map(option => option.value);
    const fecha = document.getElementById('completion-date').value;
    const valoracion = document.getElementById('rating').value;
    const resena = document.getElementById('review').value;

    if (!validarFormulario(nombre, genero, plataforma, estado, formato, fecha, valoracion)) return;

    const recursos = obtenerRecursos();
    const recurso = { nombre, genero, plataforma, estado, formato, fecha, valoracion, resena };

    recursos.push(recurso);
    guardarRecursos(recursos);
    mostrarAlerta('Recurso añadido exitosamente');
    mostrarRecursos();
    this.reset();
    actualizarEstrellas(0); // Resetear las estrellas visuales
});

// Función para editar un recurso
function editarRecurso(index) {
    const recursos = obtenerRecursos();
    const recurso = recursos[index];

    document.getElementById('resource-name').value = recurso.nombre;
    document.getElementById('genre').value = recurso.genero;
    document.getElementById('platform').value = recurso.plataforma;
    document.getElementById('status').value = recurso.estado;
    document.getElementById('format').value = recurso.formato;
    document.getElementById('completion-date').value = recurso.fecha;
    document.getElementById('rating').value = recurso.valoracion;
    document.getElementById('review').value = recurso.resena;

    eliminarRecurso(index); // Eliminar recurso para actualizarlo}
    mostrarAlerta('Recurso actualizado exitosamente');
}

// Función para eliminar un recurso
function eliminarRecurso(index) {
    const recursos = obtenerRecursos();
    recursos.splice(index, 1);
    guardarRecursos(recursos);
    mostrarRecursos();
    mostrarAlerta('Recurso eliminado exitosamente');
}

// Función para filtrar recursos
function filtrarRecursos() {
    const nombreFiltro = document.getElementById('search-bar').value.toLowerCase();
    const estadoFiltro = document.getElementById('filter-status').value;
    const formatoFiltro = document.getElementById('filter-format').value;
    const plataformaFiltro = document.getElementById('filter-platform').value;

    const recursos = obtenerRecursos();
    const lista = document.getElementById('resource-list');
    lista.innerHTML = '';

    recursos.forEach((recurso, index) => {
        if (
            (nombreFiltro === '' || recurso.nombre.toLowerCase().includes(nombreFiltro)) &&
            (estadoFiltro === '' || recurso.estado.includes(estadoFiltro)) &&
            (formatoFiltro === '' || recurso.formato.includes(formatoFiltro)) &&
            (plataformaFiltro === '' || recurso.plataforma.includes(plataformaFiltro))
        ) {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${recurso.nombre}</td>
                <td>${recurso.genero}</td>
                <td>${recurso.plataforma.join(', ')}</td>
                <td>${recurso.estado.join(', ')}</td>
                <td>${recurso.formato.join(', ')}</td>
                <td>${recurso.fecha}</td>
                <td>${'⭐'.repeat(recurso.valoracion)}</td>
                <td>${recurso.resena}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editarRecurso(${index})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarRecurso(${index})">Eliminar</button>
                </td>
            `;
            lista.appendChild(fila);
        }
    });
}


document.getElementById('search-bar').addEventListener('input', filtrarRecursos);
document.getElementById('filter-status').addEventListener('change', filtrarRecursos);
document.getElementById('filter-format').addEventListener('change', filtrarRecursos);
document.getElementById('filter-platform').addEventListener('change', filtrarRecursos);




// Inicialización de la lista y manejo de estrellas
document.addEventListener('DOMContentLoaded', () => {
    mostrarRecursos();
    manejarEstrellas();
});
