let listaJuegosPerfil = []; // Memoria para guardar los juegos y poder abrirlos luego
document.addEventListener('DOMContentLoaded', () => {
    // 1. Comprobamos si el usuario tiene permiso para estar aquí
    const usuarioGuardado = localStorage.getItem('usuarioGameboxd');

    if (!usuarioGuardado) {
        alert("Debes iniciar sesión para ver tu perfil.");
        window.location.href = 'login.html'; // Lo echamos si no está logueado
        return;
    }

    // 2. Extraemos sus datos de la mochila del navegador
    const usuario = JSON.parse(usuarioGuardado);

    // 3. Pintamos sus datos en la cabecera
    document.getElementById('nombre-perfil').innerText = usuario.username;
    
    // Truco: Generamos un avatar automático único usando su email
    const urlAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${usuario.email}&backgroundColor=14181c`;
    document.getElementById('avatar-perfil').src = urlAvatar;

    // 4. Llamamos a la función que pedirá los juegos a Java
    cargarMisJuegos(usuario.id);
});

function actualizarContadores(misJuegos) {
    const total = misJuegos.length;
    
    // Filtramos los de este año (2026)
    const esteAno = misJuegos.filter(j => {
        return new Date(j.fechaJugado).getFullYear() === 2026;
    }).length;

    // Calculamos la nota media
    const sumaNotas = misJuegos.reduce((acc, j) => acc + (j.puntuacion || 0), 0);
    const media = total > 0 ? (sumaNotas / total).toFixed(1) : "0.0";

    // Los pintamos en el HTML
    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-year').innerText = esteAno;
    document.getElementById('stat-rating').innerText = media;
}

async function cargarMisJuegos(usuarioId) {
    try {
        const url = `http://localhost:8080/api/juegos/usuario/${usuarioId}`;
        const respuesta = await fetch(url);
        const misJuegos = await respuesta.json();
        listaJuegosPerfil = misJuegos;
        // 1. ¡ACTUALIZAMOS CONTADORES AQUÍ MISMO! 
        // Así ya tenemos los datos frescos antes de hacer nada más.
        actualizarContadores(misJuegos);

        const contenedor = document.getElementById('contenedor-mis-juegos');
        contenedor.innerHTML = '';

        // 2. Comprobamos si hay juegos para pintar
        if (misJuegos.length === 0) {
            contenedor.innerHTML = '<p style="color: #9ab;">Aún no has registrado ningún juego.</p>';
            return;
        }

        // 3. Pintamos las tarjetas
        listaJuegosPerfil.forEach((juego, index) => {
            const divEntrada = document.createElement('div');
            divEntrada.className = 'entrada-log-container';
            divEntrada.setAttribute('onclick', `abrirModalReview(${index})`);
            const estrellasHTML = generarEstrellas(juego.puntuacion);
            
            const resenaCorta = juego.resena && juego.resena.length > 100 
                ? juego.resena.substring(0, 100) + '...' 
                : (juego.resena || "Sin reseña...");

            divEntrada.innerHTML = `
                <div class="tarjeta-poster">
                    <img src="${juego.portadaUrl}" class="portada-perfil">
                    
                    <div class="info-overlay">
                        <div class="puntuacion-overlay">${estrellasHTML}</div>
                        <span class="fecha-overlay">${formatearFecha(juego.fechaJugado)}</span>
                        <p class="resena-overlay">${resenaCorta}</p>
                        <h3 class="titulo-overlay">${juego.titulo}</h3>
                    </div>
                </div>
            `;
            contenedor.appendChild(divEntrada);
            
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Función auxiliar para dibujar las estrellas
function generarEstrellas(nota) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (nota >= i) {
            html += '<i class="fa fa-star"></i>'; // Estrella entera
        } else if (nota >= i - 0.5) {
            html += '<i class="fa fa-star-half-o"></i>'; // Media estrella
        } else {
            html += '<i class="fa fa-star-o"></i>'; // Estrella vacía
        }
    }
    return html;
}

function formatearFecha(fechaStr) {
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
}

// --- FUNCIONES PARA VER LA RESEÑA COMPLETA ---

function abrirModalReview(index) {
    // Buscamos el juego en nuestra memoria usando el índice
    const juego = listaJuegosPerfil[index];

    // Rellenamos el HTML de la ventana emergente con los datos sin recortar
    document.getElementById('titulo-review').innerText = juego.titulo;
    document.getElementById('portada-review').src = juego.portadaUrl;
    document.getElementById('estrellas-review').innerHTML = generarEstrellas(juego.puntuacion);
    document.getElementById('fecha-review').innerText = `Jugado el ${formatearFecha(juego.fechaJugado)}`;
    
    // Si no hay reseña, ponemos un mensaje por defecto
    document.getElementById('texto-review').innerText = juego.resena || "No escribiste ninguna reseña para este juego.";

    // Mostramos la ventana
    document.getElementById('modal-ver-review').style.display = 'flex';
}

function cerrarModalReview() {
    document.getElementById('modal-ver-review').style.display = 'none';
}