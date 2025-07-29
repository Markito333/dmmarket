// Base de datos de productos (simulada)
function cargarProductos() {
    return [
        {
            id: 1,
            nombre: "Silla Minimalista",
            descripcion: "Silla de diseño minimalista con estructura de madera y tapizado en tela ecológica. Perfecta para añadir un toque de elegancia a cualquier espacio.",
            precio: 249.99,
            imagenes: ["img/producto1.jpg", "img/producto1-2.jpg", "img/producto1-3.jpg"],
            categoria: "muebles",
            agotado: false
        },
        {
            id: 2,
            nombre: "Lámpara Moderna",
            descripcion: "Lámpara de pie con diseño contemporáneo. Altura ajustable y luz LED regulable en temperatura de color.",
            precio: 129.99,
            imagenes: ["img/producto2.jpg"],
            categoria: "iluminacion",
            agotado: true
        },
        {
            id: 3,
            nombre: "Gafas Oscuras",
            descripcion: "Gafas elegantes de material plastico resistente.",
            precio: 89.99,
            imagenes: ["img/gafas.jpg", "img/ejemploGafas.jpg"],
            categoria: "decoracion",
            agotado: false
        },
        {
            id: 4,
            nombre: "Mesa Centro Moderna",
            descripcion: "Mesa de centro con tablero de madera maciza y patas en metal. Acabado protector ecológico.",
            precio: 349.99,
            imagenes: ["img/producto4.jpg"],
            categoria: "muebles",
            agotado: false
        },
        {
            id: 5,
            nombre: "Cojín Decorativo",
            descripcion: "Cojín decorativo con estampado geométrico. Funda extraíble y lavable. Relleno de fibra ecológica.",
            precio: 39.99,
            imagenes: ["img/producto5.jpg"],
            categoria: "textiles",
            agotado: false
        },
        {
            id: 6,
            nombre: "Espejo Circular",
            descripcion: "Espejo decorativo circular con marco delgado. Incluye sistema de sujeción oculto.",
            precio: 149.99,
            imagenes: ["img/producto6.jpg"],
            categoria: "decoracion",
            agotado: false
        },
        {
            id: 7,
            nombre: "Sofá Moderno",
            descripcion: "Sofá de tres plazas en tejido resistente. Estructura de madera y almohadones incluidos.",
            precio: 899.99,
            imagenes: ["img/producto7.jpg"],
            categoria: "muebles",
            agotado: false
        },
        {
            id: 8,
            nombre: "Set de Jardinería",
            descripcion: "Set de 3 herramientas de jardinería con mangos de madera. Incluye pala, rastrillo y trasplantador.",
            precio: 49.99,
            imagenes: ["img/producto8.jpg"],
            categoria: "jardin",
            agotado: false
        },
        {
            id: 9,
            nombre: "Cortinas Modernas",
            descripcion: "Cortinas opacas en tejido de lino. Incluye varilla y anillas. Disponible en varias medidas.",
            precio: 69.99,
            imagenes: ["img/producto9.jpg"],
            categoria: "textiles",
            agotado: false
        },
        {
            id: 10,
            nombre: "Estantería Flotante",
            descripcion: "Estantería flotante en acabado mate. Soporte de metal oculto. Capacidad de carga: 15 kg por balda.",
            precio: 79.99,
            imagenes: ["img/producto10.jpg"],
            categoria: "muebles",
            agotado: false
        }
    ];
}

// Provincias y municipios de Cuba
const ubicacionesCuba = {
    "Artemisa": ["Alquízar", "Artemisa", "Bahía Honda", "Bauta", "Caimito", "Guanajay", "Güira de Melena", "Mariel", "San Antonio de los Baños", "San Cristóbal"],
    "Camagüey": ["Camagüey", "Carlos M. de Céspedes", "Esmeralda", "Florida", "Guáimaro", "Jimaguayú", "Minas", "Najasa", "Nuevitas", "Santa Cruz del Sur", "Sibanicú", "Sierra de Cubitas", "Vertientes"],
    "Ciego de Ávila": ["Baraguá", "Bolivia", "Chambas", "Ciego de Ávila", "Ciro Redondo", "Florencia", "Majagua", "Morón", "Primero de Enero", "Venezuela"],
    "Cienfuegos": ["Abreus", "Aguada de Pasajeros", "Cienfuegos", "Cruces", "Cumanayagua", "Palmira", "Rodas", "Santa Isabel de las Lajas"],
    "Granma": ["Bartolomé Masó", "Bayamo", "Buey Arriba", "Campechuela", "Cauto Cristo", "Guisa", "Jiguaní", "Manzanillo", "Media Luna", "Niquero", "Pilón", "Río Cauto", "Yara"],
    "Guantánamo": ["Baracoa", "Caimanera", "El Salvador", "Guantánamo", "Imías", "Maisí", "Manuel Tames", "Niceto Pérez", "San Antonio del Sur", "Yateras"],
    "Holguín": ["Antilla", "Báguanos", "Banes", "Cacocum", "Calixto García", "Cueto", "Frank País", "Gibara", "Holguín", "Mayarí", "Moa", "Rafael Freyre", "Sagua de Tánamo", "Urbano Noris"],
    "Isla de la Juventud": ["Isla de la Juventud"],
    "La Habana": ["Arroyo Naranjo", "Boyeros", "Centro Habana", "Cerro", "Cotorro", "Diez de Octubre", "Guanabacoa", "La Lisa", "Habana del Este", "Habana Vieja", "Marianao", "Playa", "Plaza de la Revolución", "Regla", "San Miguel del Padrón"],
    "Las Tunas": ["Amancio", "Colombia", "Jesús Menéndez", "Jobabo", "Las Tunas", "Majibacoa", "Manatí", "Puerto Padre"],
    "Matanzas": ["Calimete", "Cárdenas", "Ciénaga de Zapata", "Colón", "Jagüey Grande", "Jovellanos", "Limonar", "Los Arabos", "Martí", "Matanzas", "Pedro Betancourt", "Perico", "Unión de Reyes"],
    "Mayabeque": ["Batabanó", "Bejucal", "Güines", "Jaruco", "Madruga", "Melena del Sur", "Nueva Paz", "Quivicán", "San José de las Lajas", "San Nicolás", "Santa Cruz del Norte"],
    "Pinar del Río": ["Consolación del Sur", "Guane", "La Palma", "Los Palacios", "Mantua", "Minas de Matahambre", "Pinar del Río", "San Juan y Martínez", "San Luis", "Sandino", "Viñales"],
    "Sancti Spíritus": ["Cabaiguán", "Fomento", "Jatibonico", "La Sierpe", "Sancti Spíritus", "Taguasco", "Trinidad", "Yaguajay"],
    "Santiago de Cuba": ["Contramaestre", "Guamá", "Mella", "Palma Soriano", "San Luis", "Santiago de Cuba", "Segundo Frente", "Songo-La Maya", "Tercer Frente"],
    "Villa Clara": ["Caibarién", "Camajuaní", "Cifuentes", "Corralillo", "Encrucijada", "Manicaragua", "Placetas", "Quemado de Güines", "Ranchuelo", "Remedios", "Sagua la Grande", "Santa Clara", "Santo Domingo"]
};

// Números de WhatsApp separados
const whatsappNumbers = {
    consultas: '5355531928', // Número para consultas
    pedidos: '5356103966'   // Número para pedidos
};

// Función para formatear precio
function formatearPrecio(precio) {
    return `$${precio.toFixed(2)}`;
}

// Mostrar notificación toast
function mostrarNotificacion(mensaje, tipo = 'exito') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${tipo === 'exito' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    }, 3000);
}