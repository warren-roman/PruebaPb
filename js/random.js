
// 1. Algoritmo SDBM para convertir texto a un número (hash)
function textoAHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = char + (hash << 6) + (hash << 16) - hash;
    }
    return Math.abs(hash);
}

// 2. Generador pseudoaleatorio (PRNG) Mulberry32
function mulberry32(seed) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// 3. Función principal para generar el número
function generarNumero(texto, semilla, desde, hasta) {
    // Combinamos el texto y la semilla para crear una semilla única
    const textoHash = textoAHash(texto);
    const semillaFinal = textoHash ^ semilla; // Operador XOR
    
    // Inicializamos el generador con la semilla final
    const random = mulberry32(semillaFinal);
    
    desde = desde || 0;
    hasta = hasta || 1;
    // Retorna un número decimal entre 0 y 1
    return (desde + (random() * (hasta - desde))).toFixed(0); 
}
