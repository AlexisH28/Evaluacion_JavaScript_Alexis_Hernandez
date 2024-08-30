// Manejo de recursos en LocalStorage
function obtenerRecetas() {
    return JSON.parse(localStorage.getItem('recetas')) || [];
}

function guardarRecetas(recetas) {
    localStorage.setItem('recetas', JSON.stringify(recetas));
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

//Función para validar correctamente el formulario
function validarFormulario(nombre, ingredientes, instrucciones, categoria, porciones, tiempo, dificultad) {
    if (!nombre || !ingredientes || !instrucciones || !categoria || !porciones || !tiempo || !dificultad) {
        mostrarAlerta('Todos los campos deben ser completados', 'error');
        return false;
    }

    if (ingredientes.split(',').length < 3) {
        mostrarAlerta('Deben haber al menos 3 ingredientes', 'error');
        return false;
    }

    if (instrucciones.split('.').length < 5) {
        mostrarAlerta('Deben haber al menos 5 instrucciones', 'error');
        return false;
    }

    if (!Number.isInteger(porciones) || porciones <= 0) {
        mostrarAlerta('La cantidad de porciones debe ser un número entero positivo', 'error');
        return false;
    }

    if (!Number.isInteger(tiempo) || tiempo <= 0) {
        mostrarAlerta('El tiempo de preparación debe ser un número entero positivo', 'error');
        return false;
    }

    if (!['Fácil', 'Medio', 'Difícil'].includes(dificultad)) {
        mostrarAlerta('La dificultad debe ser Fácil, Medio o Difícil', 'error');
        return false;
    }
    return true;
}

document.getElementById('category').addEventListener('change', manejarEstadoCambio);


document.addEventListener('DOMContentLoaded', manejarEstadoCambio);

// Función para mostrar la lista de recetas
function mostrarRecetas() {
    const recetas = obtenerRecetas();
    const lista = document.getElementById('recipe-list');
    lista.innerHTML = '';

    recetas.forEach((receta, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${receta.nombre}</td>
            <td>${receta.ingredientes}</td>
            <td>${receta.instrucciones}</td>
            <td>${receta.categoria}</td>
            <td>${receta.porciones}</td>
            <td>${receta.tiempo}</td>
            <td>${receta.dificultad}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarReceta(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarReceta(${index})">Eliminar</button>
            </td>
        `;
        lista.appendChild(fila);
    });
}

// Función para añadir o actualizar una receta
document.getElementById('recipe-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('recipe-name').value;
    const ingredientes = document.getElementById('ingredients').value;
    const instrucciones = document.from(document.getElementById('instructions').selectedOptions).value;
    const categoria = document.from(document.getElementById('category').selectedOptions).map(option => option.value);
    const porciones = document.from(document.getElementById('portions').selectedOptions).value;
    const tiempo = document.getElementById('cooking-time').value;
    const dificultad = document.getElementById('difficulty-level').map(option => option.value);

    if (!validarFormulario(nombre, ingredientes, instrucciones, categoria, porciones, tiempo, dificultad)) return;

    const recetas = obtenerRecetas();
    const receta = { nombre, ingredientes, instrucciones, categoria, porciones, tiempo, dificultad};

    recetas.push(receta);
    guardarRecetas(recetas);
    mostrarAlerta('Receta añadida exitosamente');
    mostrarRecetas();
    this.reset();
});

// Función para editar una receta
function editarReceta(index) {
    const recetas = obtenerRecursos();
    const receta = recetas[index];

    document.getElementById('recipe-name').value = receta.nombre;
    document.getElementById('ingredients').value = receta.ingredientes;
    document.getElementById('instructions').value = receta.instrucciones;
    document.getElementById('category').value = receta.categoria;
    document.getElementById('portions').value = receta.porciones;
    document.getElementById('cooking-time').value = receta.tiempo;
    document.getElementById('difficulty-level').value = receta.dificultad;

    eliminarReceta(index);
    mostrarAlerta('Receta actualizada exitosamente');
}

// Función para eliminar una receta
function eliminarReceta(index) {
    const recetas = obtenerRecetas();
    recetas.splice(index, 1);
    guardarRecetas(recetas);
    mostrarRecetas();
    mostrarAlerta('Receta eliminada exitosamente');
}

// Función para filtrar recursos
function filtrarRecetas() {
    const nombreFiltro = document.getElementById('search-bar').value.toLowerCase();
    const categoriaFiltro = document.getElementById('filter-category').value;
    const dificultadFiltro = document.getElementById('filter-difficulty-level').value;
    
    const recetas = obtenerRecetas();
    const lista = document.getElementById('recipe-list');
    lista.innerHTML = '';

    recetas.forEach((receta, index) => {
        if(
            (nombreFiltro === '' || receta.nombre.toLowerCase().includes(nombreFiltro)) &&
            (categoriaFiltro === '' || receta.categoria.includes(categoriaFiltro)) &&
            (dificultadFiltro === '' || receta.dificultad.includes(dificultadFiltro)) &&
        ){
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${receta.nombre}</td>
                <td>${receta.ingredientes}</td>
                <td>${receta.instrucciones}</td>
                <td>${receta.categoria}</td>
                <td>${receta.porciones}</td>
                <td>${receta.tiempo}</td>
                <td>${receta.dificultad}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editarReceta(${index})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarReceta(${index})">Eliminar</button>
                </td>
            `;
            lista.appendChild(fila);
        }
    });
}


document.getElementById('search-bar').addEventListener('input', filtrarRecetas);
document.getElementById('filter-category').addEventListener('change', filtrarRecetas);
document.getElementById('filter-difficulty-level').addEventListener('change', filtrarRecetas);



// Inicialización de la lista
document.addEventListener('DOMContentLoaded', () => {
    mostrarRecetas();
});
