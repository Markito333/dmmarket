// Configuración global
const Config = {
    whatsappNumbers: {
        consultas: '5355531928', // Número para consultas
        pedidos: '5356103966'   // Número para pedidos
    },
    categoriasPiezas: ['Llantas', 'Gomas', 'Cranes'], // Categorías que son piezas
    tasaZelle: 0.05,    // 5%
    tasaTransferencia: 0.10 // 10%
};

// Función para formatear precio
function formatearPrecio(precio) {
    return `$${precio.toFixed(2)}`;
}