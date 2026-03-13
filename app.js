// La dirección donde está escuchando tu servidor Java
const API_URL = 'http://localhost:8080/api/juegos';

// Función principal que se conecta al backend
async function cargarJuegos() {
    try {
        // 1. Llamamos al backend
        const respuesta = await fetch(API_URL);
        
        // 2. Convertimos el texto JSON en un array de objetos que JavaScript entiende
        const juegos = await respuesta.json(); 

        // 3. Buscamos el div vacío de nuestro HTML
        const contenedor = document.getElementById('contenedor-juegos');
        contenedor.innerHTML = ''; // Borramos el texto de "Cargando..."

        // 4. Recorremos la lista de juegos que nos dio Java
        juegos.forEach(juego => {
            // Creamos una "tarjeta" (un div) para cada juego
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-juego';

            // Si el juego no tiene portada en la BD, le ponemos un recuadro gris por defecto
            const urlPortada = juego.portadaUrl ? juego.portadaUrl : 'https://via.placeholder.com/150x220?text=Sin+Portada';

            // Le metemos el HTML interno a la tarjeta con los datos reales
            tarjeta.innerHTML = `
                <img src="${urlPortada}" alt="Portada de ${juego.titulo}">
                <h3>${juego.titulo}</h3>
                <p class="desarrollador">${juego.desarrollador}</p>
                <p class="fecha">${juego.fechaLanzamiento}</p>
            `;

            // Añadimos la tarjeta terminada al contenedor principal
            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error('Error al cargar los juegos:', error);
        document.getElementById('contenedor-juegos').innerHTML = '<p>Error al conectar con el servidor.</p>';
    }
}

// Le decimos que ejecute la función nada más abrir la página
cargarJuegos();