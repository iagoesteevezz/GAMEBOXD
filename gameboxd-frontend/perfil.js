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

async function cargarMisJuegos(usuarioId) {
    try {
        // OJO: Esta URL todavía no existe en tu Java. 
        // Estamos dejando el cable preparado para conectarlo en el siguiente paso.
        const url = `http://localhost:8080/api/juegos/usuario/${usuarioId}`;
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error("Endpoint no preparado en el backend");
        }

        const misJuegos = await respuesta.json();
        const contenedor = document.getElementById('contenedor-mis-juegos');
        contenedor.innerHTML = ''; // Limpiamos el texto de carga

        // Si la lista está vacía, le avisamos
        if (misJuegos.length === 0) {
            contenedor.innerHTML = '<p style="color: #9ab;">Aún no has guardado ningún juego. ¡Ve al inicio y busca algunos!</p>';
            return;
        }

        // Pintamos las tarjetas
        misJuegos.forEach(juego => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-juego';

            tarjeta.innerHTML = `
                <img src="${juego.portadaUrl}" alt="Portada de ${juego.titulo}">
                <h3>${juego.titulo}</h3>
                <p class="fecha">${juego.fechaLanzamiento}</p>
            `;

            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error('Error al cargar la colección:', error);
        document.getElementById('contenedor-mis-juegos').innerHTML = 
            '<p style="color: #ff5252; font-weight: bold;">Falta enseñar a Java a filtrar los juegos. ¡Vamos al backend!</p>';
    }
}