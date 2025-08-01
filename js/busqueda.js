// Función para búsqueda en tiempo real
function configurarBusquedaEnTiempoReal() {
    const searchInput = document.getElementById('search-input');
    
    // Escuchar eventos de teclado
    searchInput.addEventListener('input', function(e) {
        const termino = e.target.value.trim().toLowerCase();
        buscarProductos(termino);
    });
    
    // Opcional: mantener el botón de búsqueda oculto pero funcional
    document.getElementById('search-btn').addEventListener('click', function() {
        const termino = searchInput.value.trim().toLowerCase();
        buscarProductos(termino);
    });
}

// Función mejorada de búsqueda
function buscarProductos(termino) {
    if (!termino || termino === '') {
        const categoriaActiva = document.querySelector('.subcategory-btn.active')?.dataset.categoria || 'todos';
        filtrarPorCategoria(categoriaActiva);
        return;
    }
    
    const resultados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(termino) || 
        producto.descripcion.toLowerCase().includes(termino)
    );
    
    renderizarProductos(resultados);
    
    // Mostrar mensaje si no hay resultados
    if (resultados.length === 0) {
        const productosContainer = document.getElementById('productos-container');
        productosContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
    }
}