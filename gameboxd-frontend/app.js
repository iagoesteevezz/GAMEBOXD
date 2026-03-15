const API_LOCAL_URL = 'http://localhost:8080/api/juegos';
const RAWG_API_KEY = '71aa0ada5fd74ec8b71f1c7b3e52854b';
let resultadosBusquedaTemporal = [];

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
        resultadosBusquedaTemporal = datos.results;
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

        // 1. Estructura con la cajita flotante invisible
        tarjeta.innerHTML = `
            <div class="contenedor-poster-hover">
                <img src="${juego.background_image || 'https://via.placeholder.com/200x300?text=Sin+Imagen'}" alt="${juego.name}">
                
                <div class="menu-hover-letterboxd">
                    <button class="btn-accion-icono" title="Añadir a mi Diario">➕</button>
                    </div>
            </div>
            
            <h3>${juego.name}</h3>
            <p>${juego.released ? juego.released.substring(0, 4) : 'TBA'}</p>
        `;

        // 2. Si haces clic en cualquier parte de la tarjeta, viajas a la página del juego
        tarjeta.onclick = () => {
            window.location.href = `juego.html?id=${juego.id}`;
        };

        // 3. EL TRUCO: Configuramos el clic del botón "+"
        const btnLog = tarjeta.querySelector('.btn-accion-icono');
        btnLog.onclick = (event) => {
            // ¡Esta línea es la magia! Evita que el clic "atraviese" el botón y toque la tarjeta
            event.stopPropagation(); 
            
            // Aquí llamas a la función que ya tenías para abrir la ventana de registrar
            abrirModalLog(juego.id); // Si tu función se llama diferente (ej. mostrarModalRegistro), cámbialo aquí
        };

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

// --- CONTADOR DE CARACTERES EN TIEMPO REAL ---
const cajaResena = document.getElementById('resena-log');
const contadorResena = document.getElementById('contador-resena');

if (cajaResena && contadorResena) {
    cajaResena.addEventListener('input', function() {
        const longitudActual = this.value.length;
        contadorResena.innerText = `${longitudActual} / 1000`;
        
        // Un detallito: si se acerca al límite (por ejemplo, a partir de 950), lo ponemos rojo
        if (longitudActual >= 950) {
            contadorResena.style.color = '#ff5252'; // Rojo de alerta
        } else {
            contadorResena.style.color = '#9ab'; // Vuelve al color original
        }
    });
}

// --- LÓGICA DEL DIARIO (LOG)
// --- LÓGICA DEL DIARIO (LOG) ---

let juegoActualParaLog = null; 

function abrirModalLog(idRawg) {
    const usuarioGuardado = localStorage.getItem('usuarioGameboxd');
    if (!usuarioGuardado) {
        alert("¡Debes iniciar sesión para registrar juegos!");
        window.location.href = 'login.html';
        return;
    }

    // Buscamos el juego. ID de RAWG suele ser número, así que comparamos con ==
    juegoActualParaLog = resultadosBusquedaTemporal.find(j => j.id == idRawg);

    if (!juegoActualParaLog) {
        alert("Error al recuperar los datos del juego. Intenta buscarlo de nuevo.");
        return;
    }

    document.getElementById('titulo-juego-modal').innerText = `Registrar: ${juegoActualParaLog.name}`;
    
    const urlPortada = juegoActualParaLog.background_image ? juegoActualParaLog.background_image : 'https://via.placeholder.com/150x220?text=Sin+Portada';
    document.getElementById('portada-juego-modal').src = urlPortada;

    document.getElementById('modal-log').style.display = 'flex';
    document.getElementById('fecha-log').valueAsDate = new Date();
}

function cerrarModal() {
    document.getElementById('modal-log').style.display = 'none';
    // No vaciamos juegoActualParaLog aquí para evitar errores si el fetch tarda
    document.getElementById('form-log').reset(); 
    document.getElementById('contador-resena').innerText = '0 / 1000';
}

async function enviarLogFinal() {
    // Comprobación de seguridad
    if (!juegoActualParaLog) {
        alert("No hay ningún juego seleccionado.");
        return;
    }

    const usuarioGuardado = localStorage.getItem('usuarioGameboxd');
    const usuario = JSON.parse(usuarioGuardado);

    const fecha = document.getElementById('fecha-log').value;
    const resena = document.getElementById('resena-log').value;
    const estrellaSeleccionada = document.querySelector('input[name="rating"]:checked');
    const nota = estrellaSeleccionada ? estrellaSeleccionada.value : 0;

    if (!fecha || nota == 0) {
        alert("Por favor, selecciona una puntuación con las estrellas y pon una fecha.");
        return;
    }

    const juegoParaGuardar = {
        titulo: juegoActualParaLog.name,
        descripcion: "Añadido desde RAWG",
        desarrollador: "Desconocido",
        fechaLanzamiento: juegoActualParaLog.released || "2000-01-01",
        portadaUrl: juegoActualParaLog.background_image,
        usuarioId: usuario.id,
        puntuacion: parseFloat(nota),
        resena: resena,
        fechaJugado: fecha
    };

    try {
        const respuesta = await fetch(API_LOCAL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(juegoParaGuardar)
        });

        if (respuesta.ok) {
            alert(`¡"${juegoActualParaLog.name}" registrado con ${nota} estrellas!`);
            cerrarModal();
            juegoActualParaLog = null; // Ahora sí lo vaciamos
        } else {
            const errorTexto = await respuesta.text();
            console.error("Error backend:", errorTexto);
            alert("El servidor no pudo guardar el juego. Revisa los tipos de datos en Java.");
        }
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error de conexión con el servidor. ¿Está Java encendido?");
    }
}