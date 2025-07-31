document.addEventListener('DOMContentLoaded', function() {
    const productosContainer = document.getElementById('productos-container');
    const detallesModal = document.getElementById('detallesModal');
    const pedidoModal = document.getElementById('pedidoModal');
    const pedidoForm = document.getElementById('pedidoForm');
    const closeModals = document.querySelectorAll('.close-modal');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const provinciaSelect = document.getElementById('provincia');
    const municipioSelect = document.getElementById('municipio');
    const filtroCategorias = document.getElementById('filtro-categorias');
    
    let productos = cargarProductos();
    let productoActual = null;
    
    // Cargar provincias
    function cargarProvincias() {
        provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
        for (const provincia in ubicacionesCuba) {
            provinciaSelect.innerHTML += `<option value="${provincia}">${provincia}</option>`;
        }
    }
    // Event listeners para el sistema de categorías
document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Remover active de todas las pestañas
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        // Añadir active a la pestaña clickeada
        this.classList.add('active');
        
        const category = this.dataset.category;
        
        // Ocultar todos los grupos de subcategorías
        document.querySelectorAll('.subcategory-group').forEach(group => {
            group.classList.remove('active');
        });
        
        // Mostrar solo el grupo de subcategorías correspondiente
        document.querySelector(`.subcategory-group[data-parent="${category}"]`).classList.add('active');
        
        // Si hay un botón activo en el grupo, mantenerlo, sino seleccionar el primero
        const activeBtn = document.querySelector(`.subcategory-group[data-parent="${category}"] .subcategory-btn.active`);
        if (!activeBtn) {
            const firstBtn = document.querySelector(`.subcategory-group[data-parent="${category}"] .subcategory-btn`);
            if (firstBtn) {
                firstBtn.classList.add('active');
                filtrarPorCategoria(firstBtn.dataset.categoria);
            }
        } else {
            filtrarPorCategoria(activeBtn.dataset.categoria);
        }
    });
});

// Event listeners para los botones de subcategoría
document.querySelectorAll('.subcategory-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remover active de todos los botones del mismo grupo
        const parentGroup = this.closest('.subcategory-group');
        parentGroup.querySelectorAll('.subcategory-btn').forEach(b => b.classList.remove('active'));
        
        // Añadir active al botón clickeado
        this.classList.add('active');
        
        const categoria = this.dataset.categoria;
        filtrarPorCategoria(categoria);
    });
});

// Función para filtrar productos (modificada para manejar las nuevas categorías)
function filtrarPorCategoria(categoria) {
    if (categoria === 'todos') {
        renderizarProductos(productos);
        return;
    }
    
    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    renderizarProductos(productosFiltrados);
}
    // Cargar municipios según provincia seleccionada
    function cargarMunicipios(provincia) {
        municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
        if (provincia && ubicacionesCuba[provincia]) {
            ubicacionesCuba[provincia].forEach(municipio => {
                municipioSelect.innerHTML += `<option value="${municipio}">${municipio}</option>`;
            });
        }
    }
    
    // Verificar mensajería disponible
    function verificarMensajeria(provincia, municipio) {
        const mensajeriaGratuita = ['Guanajay', 'Mariel'];
        if (provincia === 'Artemisa' && mensajeriaGratuita.includes(municipio)) {
            mostrarNotificacion('Mensajería disponible - Gratuita', 'exito');
        }
    }
    
    // Filtrar productos por categoría
    function filtrarPorCategoria(categoria) {
        if (categoria === 'todos') {
            renderizarProductos(productos);
            return;
        }
        
        const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
        renderizarProductos(productosFiltrados);
    }
    
    // Renderizar productos
    function renderizarProductos(productosAMostrar = productos) {
        productosContainer.innerHTML = '';
        
        if (productosAMostrar.length === 0) {
            productosContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }
        
        productosAMostrar.forEach(producto => {
            const productoHTML = `
                <div class="producto-card" data-id="${producto.id}" data-categoria="${producto.categoria}">
                    ${producto.agotado ? '<div class="agotado-ribbon">Agotado</div>' : ''}
                    <div class="producto-imagen">
                        <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                    </div>
                    <div class="producto-info">
                        <h3 class="producto-titulo">${producto.nombre}</h3>
                        <p class="producto-precio">${formatearPrecio(producto.precio)}</p>
                        
                        <div class="producto-cantidad">
                            <label for="cantidad-${producto.id}">Cantidad:</label>
                            <input type="number" id="cantidad-${producto.id}" min="1" value="1" ${producto.agotado ? 'disabled' : ''}>
                        </div>
                        
                        <div class="producto-acciones">
                            <button class="btn btn-outline acciones-btn ver-detalles" data-id="${producto.id}">
                                <i class="fas fa-eye"></i> Detalles
                            </button>
                            <button class="btn btn-secondary acciones-btn consultar-whatsapp" data-id="${producto.id}" ${producto.agotado ? 'disabled' : ''}>
                                <i class="fab fa-whatsapp"></i> Comprar
                            </button>
                            <button class="btn btn-primary acciones-btn hacer-pedido" data-id="${producto.id}" ${producto.agotado ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i> Encargar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            productosContainer.insertAdjacentHTML('beforeend', productoHTML);
        });
    }
    
    // Mostrar modal de detalles con galería de imágenes
    function mostrarModalDetalles(productoId) {
        productoActual = productos.find(p => p.id == productoId);
        if (!productoActual) return;
    
        const detallesContainer = document.getElementById('detalles-container');
        
        // Crear HTML para la galería de imágenes
        let galeriaHTML = '';
        productoActual.imagenes.forEach((imagen, index) => {
            galeriaHTML += `
                <div class="galeria-item ${index === 0 ? 'active' : ''}">
                    <img src="${imagen}" alt="${productoActual.nombre} - ${index + 1}">
                </div>
            `;
        });
        
        // Crear HTML para los indicadores de la galería
        let indicadoresHTML = '';
        productoActual.imagenes.forEach((_, index) => {
            indicadoresHTML += `
                <button class="galeria-indicador ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
            `;
        });
        
        detallesContainer.innerHTML = `
            <div class="detalles-imagen">
                <div class="galeria-container">
                    ${galeriaHTML}
                </div>
                <div class="galeria-controls">
                    <button class="galeria-prev"><i class="fas fa-chevron-left"></i></button>
                    <div class="galeria-indicadores">
                        ${indicadoresHTML}
                    </div>
                    <button class="galeria-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            <div class="detalles-texto">
                <h2 class="detalles-titulo">${productoActual.nombre}</h2>
                <p class="detalles-precio">${formatearPrecio(productoActual.precio)}</p>
                <p class="detalles-descripcion">${productoActual.descripcion}</p>
                
                ${productoActual.agotado ? '<p class="detalles-agotado"><i class="fas fa-times-circle"></i> Producto agotado</p>' : ''}
                
                <div class="producto-cantidad">
                    <label for="cantidad-detalles">Cantidad:</label>
                    <input type="number" id="cantidad-detalles" min="1" value="1" ${productoActual.agotado ? 'disabled' : ''}>
                </div>
                
                <div class="detalles-acciones">
                    <button class="btn btn-secondary consultar-whatsapp-btn" data-id="${productoActual.id}" ${productoActual.agotado ? 'disabled' : ''}>
                        <i class="fab fa-whatsapp"></i> Comprar
                    </button>
                    <button class="btn btn-primary hacer-pedido-btn" data-id="${productoActual.id}" ${productoActual.agotado ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Encargar
                    </button>
                </div>
            </div>
        `;
        
        // Inicializar galería
        inicializarGaleria();

        // Nuevos event listeners para los botones del modal
        document.querySelector('.consultar-whatsapp-btn').addEventListener('click', function() {
            consultarWhatsapp(this.dataset.id, true);
        });
        
        document.querySelector('.hacer-pedido-btn').addEventListener('click', function() {
            cerrarModal();
            mostrarModalPedido(this.dataset.id);
        });
        
        detallesModal.classList.add('show');
    }
    
    // Inicializar funcionalidad de la galería
    function inicializarGaleria() {
        const items = document.querySelectorAll('.galeria-item');
        const indicadores = document.querySelectorAll('.galeria-indicador');
        let currentIndex = 0;
        
        function showImage(index) {
            items.forEach(item => item.classList.remove('active'));
            indicadores.forEach(ind => ind.classList.remove('active'));
            
            items[index].classList.add('active');
            indicadores[index].classList.add('active');
            currentIndex = index;
        }
        
        // Eventos para botones de navegación
        document.querySelector('.galeria-prev').addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + items.length) % items.length;
            showImage(newIndex);
        });
        
        document.querySelector('.galeria-next').addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % items.length;
            showImage(newIndex);
        });
        
        // Eventos para indicadores
        indicadores.forEach((ind, index) => {
            ind.addEventListener('click', () => showImage(index));
        });
    }
    
    // Mostrar modal de pedido con imagen
    function mostrarModalPedido(productoId) {
        productoActual = productos.find(p => p.id == productoId);
        if (!productoActual) return;
        
        document.getElementById('productoId').value = productoId;
        
        // Actualizar el contenido del modal de pedido
        const pedidoContent = `
            <h2>Realizar Encargo</h2>
            <div class="pedido-producto-info">
                <div class="pedido-producto-imagen">
                    <img src="${productoActual.imagenes[0]}" alt="${productoActual.nombre}">
                </div>
                <div class="pedido-producto-texto">
                    <h4>${productoActual.nombre}</h4>
                    <p class="precio">${formatearPrecio(productoActual.precio)}</p>
                    <p class="tiempo-entrega"><i class="fas fa-truck"></i> Tiempo de entrega: 25-30 días</p>
                </div>
            </div>
            <form id="pedidoForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="apellidos">Apellidos</label>
                        <input type="text" id="apellidos" name="apellidos" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="provincia">Provincia</label>
                        <select id="provincia" name="provincia" required>
                            <option value="">Seleccione una provincia</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="municipio">Municipio</label>
                        <select id="municipio" name="municipio" required>
                            <option value="">Seleccione un municipio</option>
                        </select>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label for="cantidad">Cantidad a encargar</label>
                    <input type="number" id="cantidad" name="cantidad" min="1" value="1" required>
                </div>
                <input type="hidden" id="productoId" name="productoId" value="${productoId}">
                <button type="submit" class="btn btn-primary">Confirmar Pedido <i class="fas fa-paper-plane"></i></button>
            </form>
        `;
        
        document.querySelector('.pedido-modal-content').innerHTML = pedidoContent;
        
        // Recargar provincias y municipios
        const provinciaSelectModal = document.querySelector('#pedidoModal #provincia');
        const municipioSelectModal = document.querySelector('#pedidoModal #municipio');
        
        // Cargar provincias en el modal
        provinciaSelectModal.innerHTML = '<option value="">Seleccione una provincia</option>';
        for (const provincia in ubicacionesCuba) {
            provinciaSelectModal.innerHTML += `<option value="${provincia}">${provincia}</option>`;
        }
        
        // Configurar eventos para provincia/municipio en el modal
        provinciaSelectModal.addEventListener('change', function() {
            cargarMunicipiosEnModal(this.value, municipioSelectModal);
            verificarMensajeria(this.value, municipioSelectModal.value);
        });
        
        municipioSelectModal.addEventListener('change', function() {
            verificarMensajeria(provinciaSelectModal.value, this.value);
        });
        
        pedidoModal.classList.add('show');
        
        // Mostrar notificación
        mostrarNotificacion(`"${productoActual.nombre}" añadido al proceso de pedido`, 'exito');
    }
    
    // Función auxiliar para cargar municipios en el modal
    function cargarMunicipiosEnModal(provincia, municipioSelect) {
        municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
        if (provincia && ubicacionesCuba[provincia]) {
            ubicacionesCuba[provincia].forEach(municipio => {
                municipioSelect.innerHTML += `<option value="${municipio}">${municipio}</option>`;
            });
        }
    }
    
    // Cerrar modal
    function cerrarModal() {
        detallesModal.classList.remove('show');
        pedidoModal.classList.remove('show');
    }
    
    // Enviar pedido por WhatsApp
    function enviarPedidoWhatsapp(event) {
        event.preventDefault();
        
        const productoId = document.getElementById('productoId').value;
        const producto = productos.find(p => p.id == productoId);
        const cantidad = document.getElementById('cantidad').value;
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const municipio = document.getElementById('municipio').value;
        const provincia = document.getElementById('provincia').value;
        
        if (!producto || !cantidad || !nombre || !apellidos || !municipio || !provincia) {
            mostrarNotificacion('Por favor complete todos los campos', 'error');
            return;
        }
        
        const total = producto.precio * cantidad;
        
        const mensaje = `¡Hola! Quiero hacer un encargo en D&M-Shop:

📌 *Producto:* ${producto.nombre}
💰 *Precio unitario:* ${formatearPrecio(producto.precio)}
🔢 *Cantidad:* ${cantidad}
💵 *Total:* ${formatearPrecio(total)}

👤 *Cliente:* ${nombre} ${apellidos}
📍 *Ubicación:* ${municipio}, ${provincia}

*Nota:* Entiendo que los pedidos tardan de 25 a 30 días en llegar.

¿Podrías confirmarme la disponibilidad y el proceso de pago? ¡Gracias!`;
        
        const urlWhatsapp = `https://wa.me/${whatsappNumbers.pedidos}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsapp, '_blank');
        
        cerrarModal();
        pedidoForm.reset();
        
        mostrarNotificacion('Pedido enviado por WhatsApp', 'exito');
    }
    
    // Consultar producto por WhatsApp
    function consultarWhatsapp(productoId, desdeModal = false) {
        const producto = productos.find(p => p.id == productoId);
        if (!producto) return;
        
        const cantidadInput = desdeModal 
            ? document.getElementById('cantidad-detalles') 
            : document.getElementById(`cantidad-${productoId}`);
            
        const cantidad = cantidadInput ? cantidadInput.value : 1;
        const total = producto.precio * cantidad;
        
        const mensaje = `¡Hola! Deseo comprar un producto en D&M-Shop:

📌 *Producto:* ${producto.nombre}
💰 *Precio unitario:* ${formatearPrecio(producto.precio)}
🔢 *Cantidad de interés:* ${cantidad}
💵 *Total aproximado:* ${formatearPrecio(total)}

¿Podrías darme más información sobre disponibilidad y detalles del mismo? ¡Gracias!`;
        
        const urlWhatsapp = `https://wa.me/${whatsappNumbers.consultas}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsapp, '_blank');
        
        mostrarNotificacion('Consulta enviada por WhatsApp', 'exito');
    }
    
    // Buscar productos
    function buscarProductos(termino) {
        if (!termino || termino.trim() === '') {
            const categoriaActiva = document.querySelector('.categoria-btn.active').dataset.categoria;
            if (categoriaActiva === 'todos') {
                renderizarProductos(productos);
            } else {
                filtrarPorCategoria(categoriaActiva);
            }
            return;
        }
        
        const terminoLower = termino.toLowerCase();
        const categoriaActiva = document.querySelector('.categoria-btn.active').dataset.categoria;
        
        let productosABuscar = productos;
        if (categoriaActiva !== 'todos') {
            productosABuscar = productos.filter(p => p.categoria === categoriaActiva);
        }
        
        const resultados = productosABuscar.filter(producto => 
            producto.nombre.toLowerCase().includes(terminoLower) || 
            producto.descripcion.toLowerCase().includes(terminoLower)
        );
        
        renderizarProductos(resultados);
    }
    
    // Event listeners
    closeModals.forEach(btn => btn.addEventListener('click', cerrarModal));
    document.addEventListener('submit', function(e) {
        if (e.target && e.target.id === 'pedidoForm') {
            enviarPedidoWhatsapp(e);
        }
    });
    
    // Búsqueda
    searchBtn.addEventListener('click', () => buscarProductos(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarProductos(searchInput.value);
        }
    });
    
    // Delegación de eventos para los botones de producto
    productosContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('hacer-pedido') || e.target.closest('.hacer-pedido')) {
            const btn = e.target.classList.contains('hacer-pedido') ? e.target : e.target.closest('.hacer-pedido');
            const productoId = btn.dataset.id;
            mostrarModalPedido(productoId);
        }
        
        if (e.target.classList.contains('consultar-whatsapp') || e.target.closest('.consultar-whatsapp')) {
            const btn = e.target.classList.contains('consultar-whatsapp') ? e.target : e.target.closest('.consultar-whatsapp');
            const productoId = btn.dataset.id;
            consultarWhatsapp(productoId);
        }
        
        if (e.target.classList.contains('ver-detalles') || e.target.closest('.ver-detalles')) {
            const btn = e.target.classList.contains('ver-detalles') ? e.target : e.target.closest('.ver-detalles');
            const productoId = btn.dataset.id;
            mostrarModalDetalles(productoId);
        }
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(e) {
        if (e.target === detallesModal || e.target === pedidoModal) {
            cerrarModal();
        }
    });
    
    // Event listeners para provincias y municipios en el modal principal
    provinciaSelect.addEventListener('change', function() {
        cargarMunicipios(this.value);
        verificarMensajeria(this.value, municipioSelect.value);
    });
    
    municipioSelect.addEventListener('change', function() {
        verificarMensajeria(provinciaSelect.value, this.value);
    });
    
    // Event listeners para filtro de categorías
    if (filtroCategorias) {
        const botonesCategoria = filtroCategorias.querySelectorAll('.categoria-btn');
        
        botonesCategoria.forEach(boton => {
            boton.addEventListener('click', function() {
                // Remover clase active de todos los botones
                botonesCategoria.forEach(btn => btn.classList.remove('active'));
                // Añadir clase active al botón clickeado
                this.classList.add('active');
                
                const categoria = this.dataset.categoria;
                filtrarPorCategoria(categoria);
            });
        });
    }
    
    // Inicializar
    cargarProvincias();
    renderizarProductos();
});

// Base de datos de productos (simulada)
function cargarProductos() {
    return [
        {
            id: 1,
            nombre: "Reloj de Pared",
            descripcion: "Reloj de pared, color plateado, viene con las intrucciones",
            precio: 2800,
            imagenes: ["img/relojpared.jpg"],
            categoria: "Decoración",
            agotado: false
        },
        {
            id: 2,
            nombre: "Pezoneras",
            descripcion: "Par de pezoneras (El paquete completo incluye 5 pares)",
            precio: 650,
            imagenes: ["img/pezoneras.jpg"],
            categoria: "Accesorios",
            agotado: false
        },
        {
            id: 3,
            nombre: "Gafas Oscuras",
            descripcion: "Gafas elegantes de material plastico resistente.",
            precio: 1500,
            imagenes: ["img/gafas.jpg"],
            categoria: "Accesorios",
            agotado: false
        },
        {
            id: 4,
            nombre: "Espejuelos",
            descripcion: "Solo disponibles los transparentes",
            precio: 1350,
            imagenes: ["img/espejuelos.jpg"],
            categoria: "Accesorios",
            agotado: false
        },
        {
            id: 5,
            nombre: "Gafas",
            descripcion: "Gafas de modelo ovalado, la vibra de la buena fiesta.",
            precio: 1500,
            imagenes: ["img/gafasdos.jpg"],
            categoria: "Accesorios",
            agotado: false
        },
        {
            id: 6,
            nombre: "Juego-Licra Deportiva",
            descripcion: "Talla M - Súper cómoda.",
            precio: 3800,
            imagenes: ["img/licranegra.jpg"],
            categoria: "Ropa",
            agotado: false
        },
        {
            id: 7,
            nombre: "Cintos de mujer",
            descripcion: "Ajustables y en varios colores.",
            precio: 1200,
            imagenes: ["img/cintos.jpg"],
            categoria: "Accesorios",
            agotado: false
        },
        {
            id: 8,
            nombre: "Vestido Gris",
            descripcion: "Talla M - Elegante y ajustado.",
            precio: 3800,
            imagenes: ["img/vestido.jpg"],
            categoria: "Ropa",
            agotado: false
        },
        {
            id: 9,
            nombre: "Paris France",
            descripcion: "Talla S.",
            precio: 2800,
            imagenes: ["img/paris.jpg"],
            categoria: "Ropa",
            agotado: false
        },
         {
            id: 10,
            nombre: "Mono de hombre",
            descripcion: "Talla M.",
            precio: 6300,
            imagenes: ["img/mononegro.jpg"],
            categoria: "Ropa",
            agotado: false
        },
         {
            id: 11,
            nombre: "Mono de mujer",
            descripcion: "Talla S.",
            precio: 3800,
            imagenes: ["img/licras.jpg"],
            categoria: "Ropa",
            agotado: false
        },
         {
            id: 12,
            nombre: "Vestido negro",
            descripcion: "Talla M.",
            precio: 3800,
            imagenes: ["img/vestidonegro.jpg"],
            categoria: "Ropa",
            agotado: false
        },
         {
            id: 13,
            nombre: "Paris France Negro",
            descripcion: "Talla S.",
            precio: 2800,
            imagenes: ["img/negroparis.jpg"],
            categoria: "Ropa",
            agotado: false
        },
         {
            id: 14,
            nombre: "Conjunto negro",
            descripcion: "Talla M.",
            precio: 6800,
            imagenes: ["img/juegonegro.jpg"],
            categoria: "Ropa",
            agotado: false
        },
        {
            id: 15,
            nombre: "Blusitas Rayas/Enteras",
            descripcion: "Talla S. Cada una",
            precio: 1700,
            imagenes: ["img/blusitasotras.jpg"],
            categoria: "Ropa",
            agotado: false
        },
         {
            id: 16,
            nombre: "Blusitas ",
            descripcion: "Talla S. Cada una",
            precio: 1700,
            imagenes: ["img/blusitasotrass.jpg"],
            categoria: "Ropa",
            agotado: false
        },
         {
            id: 17,
            nombre: "Blusitas con diseño",
            descripcion: "Talla M. Cada una",
            precio: 2800,
            imagenes: ["img/blusitas.jpg" , "img/blusitasdetras.jpg"],
            categoria: "Ropa",
            agotado: false
        },
         {
            id: 18,
            nombre: "Blusitas Los Angeles",
            descripcion: "Talla S. Cada una",
            precio: 2800,
            imagenes: ["img/losangeles.jpg" , "img/losangelesdetras.jpg"],
            categoria: "Ropa",
            agotado: false
        },


         {
            id: 101,
            nombre: "Llanta",
            descripcion: "Rin 18 5/114",
            precio: 1000,
            imagenes: ["img/piezas/llanta18.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 102,
            nombre: "Goma Centara",
            descripcion: "Goma ",
            precio: 8500,
            imagenes: ["img/piezas/centara.jpg"],
            categoria: "Gomas",
            agotado: false
        },
        {
            id: 103,
            nombre: "Goma Centara",
            descripcion: "Goma ",
            precio: 8500,
            imagenes: ["img/piezas/centara2.jpg"],
            categoria: "Gomas",
            agotado: false
        },
        {
            id: 104,
            nombre: "Goma A607",
            descripcion: "Goma ",
            precio: 8500,
            imagenes: ["img/piezas/GomaA607.jpg"],
            categoria: "Gomas",
            agotado: false
        },
        {
            id: 105,
            nombre: "Goma A609",
            descripcion: "Goma ",
            precio: 8500,
            imagenes: ["img/piezas/GomaA609.jpg"],
            categoria: "Gomas",
            agotado: false
        },
        {
            id: 106,
            nombre: "Goma Centara",
            descripcion: "Goma ",
            precio: 8500,
            imagenes: ["img/piezas/centara.jpg"],
            categoria: "Gomas",
            agotado: false
        },
        {
            id: 107,
            nombre: "Goma Grenilander",
            descripcion: "",
            precio: 15000,
            imagenes: ["img/piezas/grenilander.jpg"],
            categoria: "Gomas",
            agotado: false
        },
         {
            id: 108,
            nombre: "Goma Mazzini",
            descripcion: "",
            precio: 15000,
            imagenes: ["img/piezas/mazzini.jpg"],
            categoria: "Gomas",
            agotado: false
        },
         {
            id: 109,
            nombre: "Goma Uraturn",
            descripcion: "",
            precio: 15000,
            imagenes: ["img/piezas/uraturn.jpg"],
            categoria: "Gomas",
            agotado: false
        },
         {
            id: 110,
            nombre: "Goma Windforce",
            descripcion: "",
            precio: 15000,
            imagenes: ["img/piezas/windforce.jpg"],
            categoria: "Gomas",
            agotado: false
        },
         {
            id: 111,
            nombre: "Goma L-ZEAL 56",
            descripcion: "",
            precio: 15000,
            imagenes: ["img/piezas/lzeal.jpg"],
            categoria: "Gomas",
            agotado: false
        },
         {
            id: 112,
            nombre: "LLanta",
            descripcion: "17 7.5 5/114.3  ET 38",
            precio: 950,
            imagenes: ["img/piezas/llanta.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 113,
            nombre: "LLanta Vossen",
            descripcion: "18 8 5/114.3  ET 38",
            precio: 1000,
            imagenes: ["img/piezas/llantavossen.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 114,
            nombre: "LLanta Vossen",
            descripcion: "16 7 4/100  ET 38",
            precio: 850,
            imagenes: ["img/piezas/llantavossen2.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 115,
            nombre: "LLanta Vossen",
            descripcion: "15 7.5 4/100  ET 38",
            precio: 750,
            imagenes: ["img/piezas/llantavossen3.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 116,
            nombre: "LLanta Vossen",
            descripcion: "16 7 5/114.3  ET 38",
            precio: 850,
            imagenes: ["img/piezas/llantavossen4.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 117,
            nombre: "LLanta Vossen",
            descripcion: "17 8 4/100/108  ET 30",
            precio: 950,
            imagenes: ["img/piezas/llantavossen5.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 118,
            nombre: "LLanta Vossen",
            descripcion: "17 8 4/100/108  ET 30",
            precio: 950,
            imagenes: ["img/piezas/llantavossen6.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 119,
            nombre: "LLanta Vossen",
            descripcion: "17 8 5/100/114.3  ET 30",
            precio: 950,
            imagenes: ["img/piezas/llantavossen7.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 120,
            nombre: "LLanta Vossen",
            descripcion: "17 8 4/100  ET 38",
            precio: 950,
            imagenes: ["img/piezas/llantavossen8.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 121,
            nombre: "LLanta Vossen",
            descripcion: "17 8 5/100/114.3  ET 30",
            precio: 950,
            imagenes: ["img/piezas/llantavossen9.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 122,
            nombre: "LLanta Vossen",
            descripcion: "17 8 5/114.3  ET 38",
            precio: 950,
            imagenes: ["img/piezas/llantavossen10.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 123,
            nombre: "LLanta Vossen",
            descripcion: "18 8 5/114.3  ET 38",
            precio: 1000,
            imagenes: ["img/piezas/llantavossen11.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 124,
            nombre: "LLanta Vossen",
            descripcion: "18 8 5/114.3  ET 38",
            precio: 1000,
            imagenes: ["img/piezas/llantavossen12.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 124,
            nombre: "LLanta Vossen",
            descripcion: "18 8 5/100  ET 38",
            precio: 1000,
            imagenes: ["img/piezas/llantavossen13.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 125,
            nombre: "LLanta2",
            descripcion: "20 8.5 5/114.3",
            precio: 1300,
            imagenes: ["img/piezas/llantavossen13.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 126,
            nombre: "LLanta Vossen",
            descripcion: "18 8 5/114.3 ET38",
            precio: 1000,
            imagenes: ["img/piezas/llantavossen14.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 127,
            nombre: "LLanta Vossen",
            descripcion: "17 8 5/114.3 ET38",
            precio: 950,
            imagenes: ["img/piezas/llantavossen15.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 128,
            nombre: "LLanta Vossen",
            descripcion: "16 7 4/100 ET38",
            precio: 850,
            imagenes: ["img/piezas/llantavossen16.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 129,
            nombre: "LLanta Vossen",
            descripcion: "16 7 5/114.3 ET38",
            precio: 850,
            imagenes: ["img/piezas/llantavossen17.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 130,
            nombre: "LLanta Vossen",
            descripcion: "16 7 5/114 ET38",
            precio: 850,
            imagenes: ["img/piezas/llantavossen18.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 131,
            nombre: "LLanta Vossen",
            descripcion: "17 8 4/100 ET38",
            precio: 950,
            imagenes: ["img/piezas/llantavossen19.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 132,
            nombre: "LLanta Vossen",
            descripcion: "15 7.5 4/100 ET38",
            precio: 750,
            imagenes: ["img/piezas/llantavossen20.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 133,
            nombre: "LLanta Vossen",
            descripcion: "14 6 8/100/114.3 ET38",
            precio: 700,
            imagenes: ["img/piezas/llantavossen21.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 134,
            nombre: "LLanta Vossen",
            descripcion: "18 8 5/114.3 ET38",
            precio: 1000,
            imagenes: ["img/piezas/llantavossen22.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 135,
            nombre: "LLanta Vossen",
            descripcion: "15 7.5 4/100 ET38",
            precio: 750,
            imagenes: ["img/piezas/llantavossen23.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 136,
            nombre: "LLanta Vossen",
            descripcion: "16 7 4/100 ET38",
            precio: 850,
            imagenes: ["img/piezas/llantavossen24.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 137,
            nombre: "LLanta",
            descripcion: "18 8 5/112 ET38",
            precio: 1000,
            imagenes: ["img/piezas/llanta3.jpg"],
            categoria: "Llantas",
            agotado: false
        },
         {
            id: 138,
            nombre: "LLanta",
            descripcion: "15 7.5 4/100 ET38",
            precio: 750,
            imagenes: ["img/piezas/llantavossen25.jpg"],
            categoria: "Llantas",
            agotado: false
        },
        {
            id: 139,
            nombre: "LLanta Vossen",
            descripcion: "15 7.5 4/100 ET38",
            precio: 750,
            imagenes: ["img/piezas/llantavossen26.jpg"],
            categoria: "Llantas",
            agotado: false
        },
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