// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos
    
    productos = cargarProductos();
      // Mostrar todos los productos inmediatamente
    renderizarProductos(productos);
      configurarBusquedaEnTiempoReal();
    // Configurar eventos de categorías
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

    // Event listeners para modales
    document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', cerrarModal));
    
    // Event listener para formulario de pedido
    document.addEventListener('submit', function(e) {
        if (e.target && e.target.id === 'pedidoForm') {
            enviarPedidoWhatsapp(e);
        }
    });
    
    // Búsqueda
    document.getElementById('search-btn').addEventListener('click', () => {
        buscarProductos(document.getElementById('search-input').value);
    });
    
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarProductos(document.getElementById('search-input').value);
        }
    });
    
    // Delegación de eventos para los botones de producto
    document.getElementById('productos-container').addEventListener('click', function(e) {
        // Para el botón "Hacer Pedido"
        if (e.target.classList.contains('hacer-pedido') || e.target.closest('.hacer-pedido')) {
            const btn = e.target.classList.contains('hacer-pedido') ? e.target : e.target.closest('.hacer-pedido');
            const productoId = btn.dataset.id;
            
            // Actualizar variables específicas para este pedido
            productoActual = productos.find(p => p.id == productoId);
            cantidadActual = parseInt(document.getElementById(`cantidad-${productoId}`).value) || 1;
            
            // Solo actualizar conRin si es una goma
            if (productoActual.categoria === 'Gomas') {
                conRin = document.getElementById(`rin-${productoId}`).value === 'si';
            } else {
                conRin = false;
            }
            
            mostrarModalPedido(productoId);
        }
        
        // Para el botón "Comprar ahora"
        if (e.target.classList.contains('comprar-ahora') || e.target.closest('.comprar-ahora')) {
            const btn = e.target.classList.contains('comprar-ahora') ? e.target : e.target.closest('.comprar-ahora');
            const productoId = btn.dataset.id;
            
            // Actualizar variables
            productoActual = productos.find(p => p.id == productoId);
            cantidadActual = parseInt(document.getElementById(`cantidad-${productoId}`).value) || 1;
            conRin = false;
            
            if (productoActual.categoria === 'Gomas') {
                const selectRin = document.getElementById(`rin-${productoId}`);
                if (selectRin) {
                    conRin = selectRin.value === 'si';
                }
            }
            
            mostrarModalPago(productoId);
        }
        
        // Para el botón "Ver detalles"
        if (e.target.classList.contains('ver-detalles') || e.target.closest('.ver-detalles')) {
            const btn = e.target.classList.contains('ver-detalles') ? e.target : e.target.closest('.ver-detalles');
            const productoId = btn.dataset.id;
            
            mostrarModalDetalles(productoId);
        }
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            cerrarModal();
        }
    });
    
    // Event listeners para provincias y municipios en el modal principal
    document.getElementById('provincia').addEventListener('change', function() {
        cargarMunicipios(this.value);
        verificarMensajeria(this.value, document.getElementById('municipio').value);
    });
    
    document.getElementById('municipio').addEventListener('change', function() {
        verificarMensajeria(document.getElementById('provincia').value, this.value);
    });
    
    // Inicializar
    cargarProvincias();
    renderizarProductos();
});