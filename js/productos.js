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
    
    let productos = cargarProductos();
    let productoActual = null;
    
    // Cargar provincias
    function cargarProvincias() {
        provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
        for (const provincia in ubicacionesCuba) {
            provinciaSelect.innerHTML += `<option value="${provincia}">${provincia}</option>`;
        }
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
                <div class="producto-card" data-id="${producto.id}">
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
                                <i class="fab fa-whatsapp"></i> Consultar
                            </button>
                            <button class="btn btn-primary acciones-btn hacer-pedido" data-id="${producto.id}" ${producto.agotado ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i> Pedir
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
                    <i class="fab fa-whatsapp"></i> Consultar
                </button>
                <button class="btn btn-primary hacer-pedido-btn" data-id="${productoActual.id}" ${productoActual.agotado ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> Pedir ahora
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
    
    // Mostrar modal de pedido
   // Función para mostrar modal de pedido con imagen
function mostrarModalPedido(productoId) {
    productoActual = productos.find(p => p.id == productoId);
    if (!productoActual) return;
    
    document.getElementById('productoId').value = productoId;
    
    // Actualizar el contenido del modal de pedido
    const pedidoContent = `
        <h2>Realizar Pedido</h2>
        <div class="pedido-producto-info">
            <div class="pedido-producto-imagen">
                <img src="${productoActual.imagenes[0]}" alt="${productoActual.nombre}">
            </div>
            <div class="pedido-producto-texto">
                <h4>${productoActual.nombre}</h4>
                <p class="precio">${formatearPrecio(productoActual.precio)}</p>
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
                <label for="cantidad">Cantidad</label>
                <input type="number" id="cantidad" name="cantidad" min="1" value="1" required>
            </div>
            <input type="hidden" id="productoId" name="productoId">
            <button type="submit" class="btn btn-primary">Confirmar Pedido <i class="fas fa-paper-plane"></i></button>
        </form>
    `;
    
    document.querySelector('.pedido-modal-content').innerHTML = pedidoContent;
    
    // Recargar provincias
    cargarProvincias();
    
    // Configurar eventos para provincia/municipio
    document.getElementById('provincia').addEventListener('change', function() {
        cargarMunicipios(this.value);
        verificarMensajeria(this.value, document.getElementById('municipio').value);
    });
    
    document.getElementById('municipio').addEventListener('change', function() {
        verificarMensajeria(document.getElementById('provincia').value, this.value);
    });
    
    pedidoModal.classList.add('show');
    
    // Mostrar notificación
    mostrarNotificacion(`"${productoActual.nombre}" añadido al proceso de pedido`, 'exito');
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
        
        const mensaje = `¡Hola! Quiero hacer un pedido en VerdeElegante:

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
        
        const mensaje = `¡Hola! Tengo una consulta sobre el producto en VerdeElegante:

📌 *Producto:* ${producto.nombre}
💰 *Precio unitario:* ${formatearPrecio(producto.precio)}
🔢 *Cantidad de interés:* ${cantidad}
💵 *Total aproximado:* ${formatearPrecio(total)}

¿Podrías darme más información sobre disponibilidad, materiales y tiempo de entrega? ¡Gracias!`;
        
        const urlWhatsapp = `https://wa.me/${whatsappNumbers.consultas}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsapp, '_blank');
        
        mostrarNotificacion('Consulta enviada por WhatsApp', 'exito');
    }
    
    // Buscar productos
    function buscarProductos(termino) {
        if (!termino || termino.trim() === '') {
            renderizarProductos(productos);
            return;
        }
        
        const terminoLower = termino.toLowerCase();
        const resultados = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(terminoLower) || 
            producto.descripcion.toLowerCase().includes(terminoLower) ||
            producto.categoria.toLowerCase().includes(terminoLower)
        );
        
        renderizarProductos(resultados);
    }
    
    // Event listeners
    closeModals.forEach(btn => btn.addEventListener('click', cerrarModal));
    pedidoForm.addEventListener('submit', enviarPedidoWhatsapp);
    
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
    
    // Event listeners para provincias y municipios
    provinciaSelect.addEventListener('change', function() {
        cargarMunicipios(this.value);
        verificarMensajeria(this.value, municipioSelect.value);
    });
    
    municipioSelect.addEventListener('change', function() {
        verificarMensajeria(provinciaSelect.value, this.value);
    });
    
    // Inicializar
    cargarProvincias();
    renderizarProductos();
});