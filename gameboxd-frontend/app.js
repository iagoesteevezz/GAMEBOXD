const API_LOCAL_URL = 'http://localhost:8080/api/juegos';
const RAWG_API_KEY = '71aa0ada5fd74ec8b71f1c7b3e52854b';

// 1. FUNCIÓN PARA CARGAR TUS JUEGOS 
async function cargarJuegosLocales() {
    try {
        const respuesta = await fetch(API_LOCAL_URL);
        const juegos = await respuesta.json();
        renderizarJuegos(juegos, "Mis Juegos Guardados");
    } catch (error) {
        console.error('Error al cargar locales:', error);
    }
}

// 2. FUNCIÓN PARA BUSCAR EN LA API EXTERNA (RAWG)
async function buscarEnRAWG() {
    const busqueda = document.getElementById('input-busqueda').value;
    if (!busqueda) return;

    const url = `https://api.rawg.io/api/games?search=${busqueda}&key=${RAWG_API_KEY}`;
    
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        // RAWG nos da los juegos en una lista llamada 'results'
        renderizarJuegos(datos.results, `Resultados para: ${busqueda}`, true);
    } catch (error) {
        console.error('Error en RAWG:', error);
    }
}

// 3. FUNCIÓN PARA PINTAR LAS TARJETAS (REUTILIZABLE)
function renderizarJuegos(lista, tituloSeccion, esBusquedaExternal = false) {
    const contenedor = document.getElementById('contenedor-juegos');
    contenedor.innerHTML = ''; // Limpiamos la pantalla
    
    // Actualizamos el título de la sección si quieres
    document.querySelector('h2').innerText = tituloSeccion;

    lista.forEach(juego => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-juego';

        // RAWG usa 'name' y 'background_image', tu Java usa 'titulo' y 'portadaUrl'
        // Usamos || para que elija la que exista
        const titulo = juego.name || juego.titulo;
        const imagen = juego.background_image || juego.portadaUrl || 'https://via.placeholder.com/150x220?text=Sin+Portada';
        const fecha = juego.released || juego.fechaLanzamiento || 'Sin fecha';

        tarjeta.innerHTML = `
            <img src="${imagen}" alt="${titulo}">
            <h3>${titulo}</h3>
            <p class="fecha">${fecha}</p>
            ${esBusquedaExternal ? `<button class="btn-add" onclick="guardarEnMiBD('${juego.id}')">➕ Añadir</button>` : ''}
        `;

        contenedor.appendChild(tarjeta);
    });
}
// Al cargar, que busque juegos populares por defecto
document.getElementById('input-busqueda').value = "Grand Theft Auto";
buscarEnRAWG();
document.getElementById('input-busqueda').value = ""; 

// --- LÓGICA DE SESIÓN (EL VIGILANTE) ---

function comprobarSesion() {
    // 1. Miramos en la "mochila" del navegador
    const usuarioGuardado = localStorage.getItem('usuarioGameboxd');
    const zonaUsuario = document.getElementById('zona-usuario');

    // 2. Si hay un usuario guardado y estamos en una página con la "zona-usuario"
    if (usuarioGuardado && zonaUsuario) {
        // Traducimos el texto a un objeto JavaScript
        const usuario = JSON.parse(usuarioGuardado);

        // 3. Cambiamos el HTML de esa zona
        zonaUsuario.innerHTML = `
            <span style="color: white; margin-right: 15px; font-size: 16px;">Hola, <strong>${usuario.username}</strong></span>
            <a href="perfil.html" style="color: #00e676; margin-right: 15px; text-decoration: none; font-weight: bold;">Mi Perfil</a>
            <button onclick="cerrarSesion()" style="background: transparent; border: 1px solid #ff5252; color: #ff5252; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.2s;">
                Cerrar Sesión
            </button>
        `;
    }
}

// Función para el botón de salir
function cerrarSesion() {
    // Vaciamos la mochila
    localStorage.removeItem('usuarioGameboxd');
    // Recargamos la página para que vuelvan a salir los botones por defecto
    window.location.reload();
}

// Le decimos a la página que ejecute al vigilante nada más cargar
document.addEventListener('DOMContentLoaded', comprobarSesion);