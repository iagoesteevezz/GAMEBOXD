// --- juego.js ---

// 1. Averiguamos qué juego queremos ver leyendo la URL
const parametrosURL = new URLSearchParams(window.location.search);
const idJuego = parametrosURL.get('id');

// Tu clave de la API de RAWG
const RAWG_API_KEY = '71aa0ada5fd74ec8b71f1c7b3e52854b';

document.addEventListener('DOMContentLoaded', () => {
    // Si alguien entra a la página sin un ID (por ejemplo, haciendo clic directamente en juego.html)
    if (!idJuego) {
        document.getElementById('detalle-titulo').innerText = "Juego no encontrado";
        document.getElementById('detalle-descripcion').innerText = "No se ha especificado ningún juego en el enlace.";
        return;
    }

    // Si hay ID, llamamos a la API
    cargarDatosOficiales(idJuego);
    cargarResenasComunidad(idJuego);
});

async function cargarDatosOficiales(id) {
    try {
        // Hacemos la llamada al "Endpoint" de detalles específicos de RAWG
        const url = `https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`;
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) throw new Error("No se pudo conectar con RAWG");
        
        const juego = await respuesta.json();

        // 2. Volcamos los datos en el HTML
        
        // Textos básicos
        document.getElementById('detalle-titulo').innerText = juego.name;
        document.title = `${juego.name} - GAMEBOXD`; // Cambia el título de la pestaña
        
        // La portada
        document.getElementById('detalle-portada').src = juego.background_image;

        // El año (RAWG lo da en formato YYYY-MM-DD, así que recortamos solo los 4 primeros números)
        const anioLanzamiento = juego.released ? juego.released.substring(0, 4) : 'TBA';
        document.getElementById('detalle-anio').innerText = `(${anioLanzamiento})`;

        // La nota media oficial de RAWG (sobre 5)
        document.getElementById('detalle-nota').innerText = juego.rating ? juego.rating.toFixed(1) : 'S/N';

        // La descripción (RAWG manda la descripción ya formateada con etiquetas HTML como <p> y <br>, por eso usamos innerHTML)
        document.getElementById('detalle-descripcion').innerHTML = juego.description || "No hay una sinopsis disponible para este juego.";

        // 3. Las etiquetas de las plataformas (PlayStation, Xbox, PC...)
        const cajaPlataformas = document.getElementById('detalle-plataformas');
        cajaPlataformas.innerHTML = ''; // Limpiamos por si acaso
        
        if (juego.parent_platforms) {
            juego.parent_platforms.forEach(item => {
                const spanPlataforma = document.createElement('span');
                spanPlataforma.className = 'etiqueta-plataforma';
                spanPlataforma.innerText = item.platform.name;
                cajaPlataformas.appendChild(spanPlataforma);
            });
        }

    } catch (error) {
        console.error("Error al cargar el juego:", error);
        document.getElementById('detalle-descripcion').innerText = "Hubo un error al cargar la información del juego.";
    }
}

// --- CARGAR RESEÑAS DE LA COMUNIDAD ---

async function cargarResenasComunidad(idRawg) {
    try {
        // Llamamos a tu servidor Java (Asegúrate de que el puerto sea el tuyo, 8080)
        const url = `http://localhost:8080/api/juegos/rawg/${idRawg}`;
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) throw new Error("No se pudieron cargar las reseñas de la comunidad");
        
        const resenas = await respuesta.json();
        const contenedorResenas = document.getElementById('contenedor-resenas-comunidad');

        if (resenas.length === 0) {
            contenedorResenas.innerHTML = '<p style="color: #9ab; font-style: italic;">Aún no hay reseñas para este juego. ¡Sé el primero en registrarlo!</p>';
            return;
        }

        contenedorResenas.innerHTML = ''; // Limpiamos el texto por defecto

        // Pintamos cada reseña en la página
        resenas.forEach(resena => {
            const divResena = document.createElement('div');
            // Le daremos estilo a esta clase en el CSS
            divResena.className = 'tarjeta-resena-comunidad'; 
            
            // Reutilizamos tu lógica de las estrellas si la tienes aquí, o hacemos una simple:
            const estrellas = '★'.repeat(Math.round(resena.puntuacion)) + '☆'.repeat(5 - Math.round(resena.puntuacion));

            divResena.innerHTML = `
                <div style="margin-bottom: 5px;">
                    <strong style="color: #00e676;">Usuario #${resena.usuarioId}</strong> <span style="color: #00e676; margin-left: 10px;">${estrellas}</span>
                </div>
                <p style="color: #cbd5e1; font-size: 14px; margin-top: 5px; white-space: pre-wrap;">${resena.resena || "Sin reseña escrita. Solo dejó nota."}</p>
                <hr style="border-color: #2c3440; margin-top: 15px;">
            `;
            
            contenedorResenas.appendChild(divResena);
        });

    } catch (error) {
        console.error("Error al cargar comunidad:", error);
    }
}