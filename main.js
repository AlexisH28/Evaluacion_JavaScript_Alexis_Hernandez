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

// Función para validar correctamente el formulario
function validarFormulario(nombre, ingredientes, instrucciones, categoria, porciones, tiempo, dificultad) {
    if (!nombre || !ingredientes || !instrucciones || !categoria || !porciones || !tiempo || !dificultad) {
        mostrarAlerta('Todos los campos deben ser completados', 'error');
        return false;
    }

    if (ingredientes.split(',').length < 3) {
        mostrarAlerta('Deben haber al menos 3 ingredientes', 'error');
        return false;
    }

    if (instrucciones.split(',').length < 3) {
        mostrarAlerta('Deben haber al menos 3 instrucciones', 'error');
        return false;
    }

    if (!Number.isInteger(Number(porciones)) || porciones <= 0) {
        mostrarAlerta('La cantidad de porciones debe ser un número entero positivo', 'error');
        return false;
    }

    if (!Number.isInteger(Number(tiempo)) || tiempo <= 0) {
        mostrarAlerta('El tiempo de preparación debe ser un número entero positivo', 'error');
        return false;
    }

    if (!['facil', 'medio', 'dificil'].includes(dificultad)) {
        mostrarAlerta('El nivel de dificultad no es válido', 'error');
        return false;
    }

    return true;
}

// Función para llenar la tabla con recetas existentes
function llenarTabla(recetas) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    recetas.forEach((receta, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${receta.nombre}</td>
            <td>${receta.ingredientes}</td>
            <td>${receta.instrucciones}</td>
            <td>${receta.categoria}</td>
            <td>${receta.porciones}</td>
            <td>${receta.tiempo}</td>
            <td>${receta.dificultad}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarReceta(${index})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarReceta(${index})">Eliminar</button>
            </td>
        `;

        recipeList.appendChild(tr);
    });
}

// Función para agregar una receta nueva
document.getElementById('recipe-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById('recipe-name').value.trim();
    const ingredientes = document.getElementById('ingredients').value.trim();
    const instrucciones = document.getElementById('instructions').value.trim();
    const categoria = document.getElementById('category').value;
    const porciones = parseInt(document.getElementById('portions').value);
    const tiempo = parseInt(document.getElementById('cooking-time').value);
    const dificultad = document.getElementById('difficulty-level').value;

    if (!validarFormulario(nombre, ingredientes, instrucciones, categoria, porciones, tiempo, dificultad)) {
        return;
    }

    const recetas = obtenerRecetas();

    const nuevaReceta = {
        nombre,
        ingredientes,
        instrucciones,
        categoria,
        porciones,
        tiempo,
        dificultad
    };

    recetas.push(nuevaReceta);
    guardarRecetas(recetas);
    llenarTabla(recetas);
    mostrarAlerta('Receta añadida exitosamente');
    document.getElementById('recipe-form').reset();
});

document.getElementById('recipe-form').addEventListener('submit', agregarReceta);

// Función para agregar una receta nueva
function agregarReceta(event) {
    event.preventDefault();

    const nombre = document.getElementById('recipe-name').value.trim();
    const ingredientes = document.getElementById('ingredients').value.trim();
    const instrucciones = document.getElementById('instructions').value.trim();
    const categoria = document.getElementById('category').value;
    const porciones = parseInt(document.getElementById('portions').value);
    const tiempo = parseInt(document.getElementById('cooking-time').value);
    const dificultad = document.getElementById('difficulty-level').value;

    if (!validarFormulario(nombre, ingredientes, instrucciones, categoria, porciones, tiempo, dificultad)) {
        return;
    }

    const recetas = obtenerRecetas();

    const nuevaReceta = {
        nombre,
        ingredientes,
        instrucciones,
        categoria,
        porciones,
        tiempo,
        dificultad
    };

    recetas.push(nuevaReceta);
    guardarRecetas(recetas);
    llenarTabla(recetas);
    mostrarAlerta('Receta añadida exitosamente');
    document.getElementById('recipe-form').reset();
}

// Función para editar una receta existente
function editarReceta(index) {
    const recetas = obtenerRecetas();
    const receta = recetas[index];

    // Rellenar el formulario con los valores actuales de la receta
    document.getElementById('recipe-name').value = receta.nombre;
    document.getElementById('ingredients').value = receta.ingredientes;
    document.getElementById('instructions').value = receta.instrucciones;
    document.getElementById('category').value = receta.categoria;
    document.getElementById('portions').value = receta.porciones;
    document.getElementById('cooking-time').value = receta.tiempo;
    document.getElementById('difficulty-level').value = receta.dificultad;

    // Actualizar la receta al enviar el formulario
    document.getElementById('recipe-form').onsubmit = (event) => {
        event.preventDefault();

        // Capturar los nuevos valores del formulario
        const nuevoNombre = document.getElementById('recipe-name').value.trim();
        const nuevosIngredientes = document.getElementById('ingredients').value.trim();
        const nuevasInstrucciones = document.getElementById('instructions').value.trim();
        const nuevaCategoria = document.getElementById('category').value;
        const nuevasPorciones = parseInt(document.getElementById('portions').value);
        const nuevoTiempo = parseInt(document.getElementById('cooking-time').value);
        const nuevaDificultad = document.getElementById('difficulty-level').value;

        // Validar los nuevos valores del formulario
        if (!validarFormulario(nuevoNombre, nuevosIngredientes, nuevasInstrucciones, nuevaCategoria, nuevasPorciones, nuevoTiempo, nuevaDificultad)) {
            return;
        }

        // Actualizar la receta con los nuevos valores
        recetas[index] = {
            nombre: nuevoNombre,
            ingredientes: nuevosIngredientes,
            instrucciones: nuevasInstrucciones,
            categoria: nuevaCategoria,
            porciones: nuevasPorciones,
            tiempo: nuevoTiempo,
            dificultad: nuevaDificultad
        };

        // Guardar y actualizar la tabla
        guardarRecetas(recetas);
        llenarTabla(recetas);
        mostrarAlerta('Receta actualizada exitosamente');
        document.getElementById('recipe-form').reset();

        // Asignar nuevamente la función para agregar receta al formulario
        document.getElementById('recipe-form').onsubmit = agregarReceta;
    };
}

// Función para eliminar una receta existente
function eliminarReceta(index) {
    const recetas = obtenerRecetas();
    recetas.splice(index, 1);
    guardarRecetas(recetas);
    llenarTabla(recetas);
    mostrarAlerta('Receta eliminada exitosamente');
}

// Filtros y búsqueda
document.getElementById('search-bar').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const recetas = obtenerRecetas();

    const recetasFiltradas = recetas.filter(receta =>
        receta.nombre.toLowerCase().includes(query)
    );

    llenarTabla(recetasFiltradas);
});

document.getElementById('filter-category').addEventListener('change', (event) => {
    const category = event.target.value;
    const recetas = obtenerRecetas();

    const recetasFiltradas = recetas.filter(receta =>
        category ? receta.categoria === category : true
    );

    llenarTabla(recetasFiltradas);
});

document.getElementById('filter-difficulty-level').addEventListener('change', (event) => {
    const difficultyLevel = event.target.value;
    const recetas = obtenerRecetas();

    const recetasFiltradas = recetas.filter(receta =>
        difficultyLevel ? receta.dificultad === difficultyLevel : true
    );

    llenarTabla(recetasFiltradas);
});

// Inicializar la tabla al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    llenarTabla(obtenerRecetas());
});
