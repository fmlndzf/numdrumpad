document.addEventListener("DOMContentLoaded", () => {
    const pad = document.getElementById("pad");
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const soundBuffers = {}; // Almacena los sonidos en memoria

    // Mapeo de teclas con archivos de sonido
    const soundFiles = {
        "7": "./sounds/Ride-Cymbal.wav",
        "8": "./sounds/Pedal-Hi-Hat.wav",
        "9": "./sounds/Open-Hi-Hat.wav",
        "-": "./sounds/Crash-Cymbal.wav",
        "4": "./sounds/Dry-Tom-4.wav",
        "5": "./sounds/Snap-Snare.wav",
        "6": "./sounds/Power-Tom-2.wav",
        "+": "./sounds/Bass-Drum-3.wav",
        "1": "./sounds/Side-Stick.wav",
        "2": "./sounds/Cross-Sticks.wav",
        "3": "./sounds/Cowbell.wav",
        "0": "./sounds/Clap.wav"
    };

    // Función para cargar un sonido en memoria
    async function loadSound(key, url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        soundBuffers[key] = await audioContext.decodeAudioData(arrayBuffer);
    }

    // Cargar todos los sonidos al inicio
    async function loadAllSounds() {
        await Promise.all(Object.entries(soundFiles).map(([key, url]) => loadSound(key, url)));
        console.log("Todos los sonidos están cargados y listos para reproducirse.");
    }

    loadAllSounds(); // Inicia la precarga de sonidos

    // Función para reproducir sonido sin latencia y efecto visual
    function playSound(key) {
        if (soundBuffers[key]) {
            const source = audioContext.createBufferSource();
            source.buffer = soundBuffers[key];
            source.connect(audioContext.destination);
            source.start(0);
    
            // Buscar el pad correcto sin usar :contains()
            let pad = [...document.querySelectorAll(".box")].find(box => 
                box.querySelector("span")?.textContent.trim() === key
            );
    
            // Si se encuentra el pad, cambia el color temporalmente
            if (pad) {
                let originalColor = pad.style.backgroundColor; // Guarda el color original
                pad.style.backgroundColor = "#ffffff"; // Color indicador de activación
                setTimeout(() => {
                    pad.style.backgroundColor = originalColor; // Restaurar color
                }, 20);
            }
        }
    }
    

    // Asignar eventos de clic/tap a los pads
    document.querySelectorAll(".box").forEach(box => {
        box.addEventListener("pointerdown", () => {
            let key = box.querySelector("span").textContent.trim();
            playSound(key);
        });
    });

    // Evento para presionar teclas
    window.addEventListener("keydown", (e) => {
        let key = e.key;
        if (soundBuffers[key]) {
            playSound(key);
        }
    });

    function ajustarTamaño() {
        const cuadrado = document.getElementById("pad");
        const tamaño = Math.min(window.innerWidth, window.innerHeight) * 0.95;
        cuadrado.style.width = tamaño + "px";
        cuadrado.style.height = tamaño + "px";
    }
    
    // Ajustar al cargar y al cambiar tamaño de ventana
    window.addEventListener("load", ajustarTamaño);
    window.addEventListener("resize", ajustarTamaño);
});
