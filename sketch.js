let anchoCanvas;
let altoCanvas;

let jugadorX = 15;
let jugadorY;
let anchoRaqueta = 30;
let altoRaqueta = 200;

let computadoraX;
let computadoraY;

let pelotaX, pelotaY;
let diametroPelota = 50;
let velocidadPelotaX = 5;
let velocidadPelotaY = 5;
let anguloPelota = 0;

let grosorMarco = 10;

let jugadorScore = 0;
let computadoraScore = 0;

let fondo;
let fondoMusica;  // Variable para la música de fondo
let barraJugador;
let barraComputadora;
let bola;
let sonidoRebote;
let sonidoGol;

let puntajeGanador = 7; // El puntaje necesario para ganar

let imagenVictoria; // Variable para la imagen


// Arreglos para los marcadores
let marcadorJugador = [];
let marcadorComputadora = [];

let moverArriba = false;
let moverAbajo = false;

let voces = [];

let juegoComenzado = false;
let tiempoEspera = 3000; // 3 segundos

let tamañoImagenVictoria = 0; // Inicializa el tamaño de la imagen de victoria en 0
let aumentando = false; // Indica si se está aumentando el tamaño


window.speechSynthesis.onvoiceschanged = () => {
    voces = window.speechSynthesis.getVoices();
};

// Función para comenzar el juego después de la pausa
function comenzarJuego() {
    juegoComenzado = true;
    // Aquí puedes poner el audio si lo necesitas
    let audio = new Audio('ruta-del-audio.mp3');
    audio.play();
}

// Se llama a la función para comenzar el juego después de 3 segundos
setTimeout(comenzarJuego, tiempoEspera);

// Cargar imágenes para los marcadores (jugador y computadora)
function preload() {
    fondo = loadImage('Sprites/fondo1.png');
    barraJugador = loadImage('Sprites/barra1.png');
    barraComputadora = loadImage('Sprites/barra2.png');
    bola = loadImage('Sprites/bola.png');
    sonidoRebote = loadSound('Sprites/bounce.wav');
    sonidoGol = loadSound('Sprites/jingle_win_synth_02.wav');

    fondoMusica = loadSound('Sprites/musica_fondo.mp3'); // Cargar la música de fondo

    imagenVictoria = loadImage('Sprites/ganador.png');


    // Cargar imágenes para los marcadores
    for (let i = 0; i <= 7; i++) {
        let imagen = loadImage(`Sprites/marcador_${i}.png`); // Asegúrate de que estas imágenes existan
        marcadorJugador[i] = imagen;
        marcadorComputadora[i] = imagen; // Asigna la misma imagen al marcador de la computadora
    }

    // Establecer el volumen (de 0.0 a 1.0)
    sonidoRebote.setVolume(0.25); // 25% del volumen
    sonidoGol.setVolume(0.5); // 50% del volumen    
}

function setup() {
    anchoCanvas = windowWidth;
    altoCanvas = windowHeight;
    createCanvas(anchoCanvas, altoCanvas);

    jugadorY = height / 2 - altoRaqueta / 2;
    computadoraY = height / 2 - altoRaqueta / 2;
    computadoraX = anchoCanvas - 25; // Actualiza computadoraX aquí
    resetPelota();

    fondoMusica.setVolume(0.3); // Ajustar el volumen de la música de fondo
    fondoMusica.loop();         // Reproducir la música en bucle
}

function draw() {
    if (!juegoComenzado) {
        // Mostrar un mensaje mientras se espera
        background(0);
        textSize(32);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Cargando... Espere un momento", width / 2, height / 2);
        return; // Evita que el juego se ejecute hasta que inicie
    }
    
    background(fondo);
    dibujarMarcos();
    dibujarRaquetas();
    mostrarPuntaje();
    dibujarPelota();
    moverPelota();
    moverComputadora();
    verificarColisiones();
    moverJugador(); // Mover el jugador con las teclas
}

// Función para mover al jugador
function moverJugador() {
    if (moverArriba) {
        jugadorY -= 5; // Ajusta la velocidad si es necesario
    }
    if (moverAbajo) {
        jugadorY += 5; // Ajusta la velocidad si es necesario
    }

    // Limitar el movimiento del jugador dentro del área del canvas
    jugadorY = constrain(jugadorY, grosorMarco, height - altoRaqueta - grosorMarco);
}

// Función para detectar las teclas presionadas
function keyPressed() {
    if (keyCode === UP_ARROW) {
        moverArriba = true;
    } else if (keyCode === DOWN_ARROW) {
        moverAbajo = true;
    }
}

// Función para detectar cuando se sueltan las teclas
function keyReleased() {
    if (keyCode === UP_ARROW) {
        moverArriba = false;
    } else if (keyCode === DOWN_ARROW) {
        moverAbajo = false;
    }
}

function dibujarMarcos() {
    fill(color("#2B3FD6"));
    rect(0, 0, width, grosorMarco); // Marco superior
    rect(0, height - grosorMarco, width, grosorMarco); // Marco inferior
}

function dibujarRaquetas() {
    image(barraJugador, jugadorX, jugadorY, anchoRaqueta, altoRaqueta);
    image(barraComputadora, computadoraX, computadoraY, anchoRaqueta, altoRaqueta);
}

function dibujarPelota() {
    push();
    translate(pelotaX, pelotaY);
    rotate(anguloPelota);
    imageMode(CENTER);
    image(bola, 0, 0, diametroPelota, diametroPelota);
    pop();
}

function mostrarPuntaje() {
    textSize(42); // Tamaño del texto
    textAlign(CENTER, CENTER); // Alineación del texto
    fill(color("#b8860b")); // Color del texto del marcador

    // Definir el tamaño de las imágenes de los marcadores (50% de su tamaño original)
    let anchoMarcador = marcadorJugador[jugadorScore].width * 0.4; // 50% del ancho original
    let altoMarcador = marcadorJugador[jugadorScore].height * 0.4; // 50% del alto original

    // Mostrar los marcadores redimensionados
    image(marcadorJugador[jugadorScore], width / 4 - anchoMarcador / 2, grosorMarco * 3, anchoMarcador, altoMarcador);
    image(marcadorComputadora[computadoraScore], 3 * width / 4 - anchoMarcador / 2, grosorMarco * 3, anchoMarcador, altoMarcador);
}

function moverPelota() {
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Ajustar el ángulo de la pelota en función de su velocidad
    let velocidadTotal = sqrt(velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY);
    anguloPelota += velocidadTotal * 0.05;

    // Colisión con el marco superior e inferior
    if (pelotaY - diametroPelota / 2 < grosorMarco ||
        pelotaY + diametroPelota / 2 > height - grosorMarco) {
        velocidadPelotaY *= -1;
    }
}

function moverComputadora() {
    if (pelotaY > computadoraY + altoRaqueta / 2) {
        computadoraY += 4;
    } else if (pelotaY < computadoraY + altoRaqueta / 2) {
        computadoraY -= 4;
    }
    computadoraY = constrain(computadoraY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function verificarColisiones() {
    // Colisión con la raqueta del jugador
    if (pelotaX - diametroPelota / 2 < jugadorX + anchoRaqueta &&
        pelotaY > jugadorY && pelotaY < jugadorY + altoRaqueta) {
        let puntoImpacto = pelotaY - (jugadorY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3; // Ángulo máximo de 60 grados
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX *= -1;
        velocidadPelotaX *= 1.1; // Aumentar la velocidad en un 10% tras cada rebote
        velocidadPelotaY *= 1.1; // Aumentar la velocidad en un 10% tras cada rebote
        sonidoRebote.play(); // Reproducir sonido de rebote
    }

    // Colisión con la raqueta de la computadora
    if (pelotaX + diametroPelota / 2 > computadoraX &&
        pelotaY > computadoraY && pelotaY < computadoraY + altoRaqueta) {
        let puntoImpacto = pelotaY - (computadoraY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3; // Ángulo máximo de 60 grados
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX *= -1;
        velocidadPelotaX *= 1.1; // Aumentar la velocidad en un 10% tras cada rebote
        velocidadPelotaY *= 1.1; // Aumentar la velocidad en un 10% tras cada rebote
        sonidoRebote.play(); // Reproducir sonido de rebote
    }

    // Colisión con los bordes izquierdo y derecho (anotación y reinicio)
    if (pelotaX < 0) {
        computadoraScore++;
        sonidoGol.play(); // Reproducir sonido de gol
        narrarMarcador(); // Narrar marcador
        resetPelota();
    } else if (pelotaX > width) {
        jugadorScore++;
        sonidoGol.play(); // Reproducir sonido de gol
        narrarMarcador(); // Narrar marcador
        resetPelota();
    }

    // Verificar si alguno de los jugadores ha ganado
    if (jugadorScore >= puntajeGanador) {
        declararGanador('Jugador');
    } else if (computadoraScore >= puntajeGanador) {
        declararGanador('Computadora');
    }
}

function narrarMarcador() {
    const utterance = new SpeechSynthesisUtterance(`Jugador ${jugadorScore} - Computadora ${computadoraScore}`);

    // Esperar hasta que las voces se hayan cargado
    const voces = window.speechSynthesis.getVoices();
    const vozNatural = voces.find(voz => voz.name.includes("Google español de Estados Unidos")); // Busca cualquier voz en español

    if (vozNatural) {
        utterance.voice = vozNatural;
    }
    utterance.pitch = 1.1;
    utterance.rate = 1.0;

    speechSynthesis.speak(utterance);
}


function declararGanador(ganador) {
    // Mostrar el campo de juego antes de la imagen de victoria
    background(fondo);  // Aquí mostramos el fondo del campo de juego

    // Definir el tamaño de la imagen (ajustada a un 50% de su tamaño original)
    let anchoImagen = imagenVictoria.width * 1.4; // 50% del ancho original
    let altoImagen = imagenVictoria.height * 1.4; // 50% del alto original


    // Mostrar la imagen de victoria
    image(imagenVictoria, width / 2 - anchoImagen / 2, height / 2 - altoImagen / 2 - 50, anchoImagen, altoImagen);

    // Mostrar el texto con el ganador
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255); // Color blanco
    if (ganador === 'Jugador') {
        text('¡Jugador ha ganado!', width / 2, height / 2 + imagenVictoria.height / 2 + 60);
    } else {
        text('¡Computadora ha ganado!', width / 2, height / 2 + imagenVictoria.height / 2 + 60);
    }

    // Detener el movimiento de la pelota para finalizar el juego
    noLoop(); // Detiene la ejecución del juego
}

function resetPelota() {
    pelotaX = width / 2;
    pelotaY = height / 2;
    velocidadPelotaX = random([-5, 5]);
    velocidadPelotaY = random([-5, 5]);
}

function resetJuego() {
    jugadorScore = 0;
    computadoraScore = 0;
    resetPelota();
}
