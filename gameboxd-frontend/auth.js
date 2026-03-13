// Escuchamos cuando el usuario le da al botón de Registrarse
document.getElementById('form-registro')?.addEventListener('submit', async function(evento) {
    // 1. Evitamos que la página se recargue
    evento.preventDefault();

    // 2. Recogemos lo que ha escrito en los inputs
    const usuarioTexto = document.getElementById('username').value;
    const emailTexto = document.getElementById('email').value;
    const passwordTexto = document.getElementById('password').value;

    // 3. Empaquetamos los datos en un objeto. 
    // OJO: Los nombres de la izquierda DEBEN coincidir exactamente con tu clase Usuario.java
    const nuevoUsuario = {
        username: usuarioTexto,
        email: emailTexto,
        passwordHash: passwordTexto // En tu Java lo llamaste passwordHash
    };

    try {
        // 4. Hacemos la llamada POST a tu servidor Java
        const respuesta = await fetch('http://localhost:8080/api/usuarios/registro', {
            method: 'POST', // Le decimos que queremos GUARDAR datos
            headers: {
                'Content-Type': 'application/json' // Le avisamos de que le enviamos un JSON
            },
            body: JSON.stringify(nuevoUsuario) // Convertimos nuestro objeto JS a texto JSON
        });

        // 5. Comprobamos si Java nos ha devuelto un "OK" (código 200)
        if (respuesta.ok) {
            alert('¡Cuenta creada con éxito! Bienvenido a Gameboxd.');
            // Lo enviamos automáticamente a la pantalla de login (que crearemos pronto)
            window.location.href = 'index.html'; 
        } else {
            alert('Error al crear la cuenta. Revisa los datos.');
        }

    } catch (error) {
        console.error('Error fatal al conectar con Java:', error);
        alert('No se ha podido conectar con el servidor.');
    }
});

// --- LÓGICA DE INICIO DE SESIÓN ---
document.getElementById('form-login')?.addEventListener('submit', async function(evento) {
    evento.preventDefault(); // Evitamos que la página recargue

    // Recogemos los datos
    const emailTexto = document.getElementById('email-login').value;
    const passwordTexto = document.getElementById('password-login').value;

    // Empaquetamos para enviarlo tal y como lo espera Java (un Map/JSON)
    const credenciales = {
        email: emailTexto,
        password: passwordTexto
    };

    try {
        const respuesta = await fetch('http://localhost:8080/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciales)
        });

        if (respuesta.ok) {
            // ¡Login correcto! Java nos devuelve los datos del usuario
            const usuarioLogueado = await respuesta.json();
            
            // ¡MAGIA! Guardamos al usuario en la "mochila" del navegador
            localStorage.setItem('usuarioGameboxd', JSON.stringify(usuarioLogueado));
            
            alert(`¡Bienvenido de nuevo, ${usuarioLogueado.username}!`);
            window.location.href = 'index.html'; // Lo mandamos a la pantalla principal
        } else {
            // Login incorrecto (error 401 que configuramos en Java)
            alert('Correo o contraseña incorrectos. Inténtalo de nuevo.');
        }

    } catch (error) {
        console.error('Error al conectar con Java:', error);
        alert('No se ha podido conectar con el servidor.');
    }
});