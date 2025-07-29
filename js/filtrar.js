 // Filtrado por categorías
        document.addEventListener('DOMContentLoaded', function() {
            const filtroCategorias = document.getElementById('filtro-categorias');
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
            
            function filtrarPorCategoria(categoria) {
                const productos = document.querySelectorAll('.producto-card');
                
                productos.forEach(producto => {
                    const productoId = producto.dataset.id;
                    const productoData = obtenerProductoPorId(productoId);
                    
                    if (categoria === 'todos' || productoData.categoria === categoria) {
                        producto.style.display = 'block';
                    } else {
                        producto.style.display = 'none';
                    }
                });
            }
        
        });