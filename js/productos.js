// Variables globales
let productos = [];
let productoActual = null;
let metodoPagoSeleccionado = null;
let cantidadActual = 1;
let conRin = false;

// Cargar provincias
function cargarProvincias() {
    const provinciaSelect = document.getElementById('provincia');
    provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
    for (const provincia in ubicacionesCuba) {
        provinciaSelect.innerHTML += `<option value="${provincia}">${provincia}</option>`;
    }
}

// Cargar municipios según provincia seleccionada
function cargarMunicipios(provincia) {
    const municipioSelect = document.getElementById('municipio');
    municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
    if (provincia && ubicacionesCuba[provincia]) {
        ubicacionesCuba[provincia].forEach(municipio => {
            municipioSelect.innerHTML += `<option value="${municipio}">${municipio}</option>`;
        });
    }
}

// Función para calcular precio del Rin
function calcularPrecioRin(descripcion) {
    const match = descripcion.match(/R(\d+)/);
    if (match) {
        const rinSize = parseInt(match[1]);
        if (rinSize === 14) return 300;
        else if (rinSize === 15) return 350;
        else if (rinSize === 16) return 350;
        else if (rinSize === 17) return 450;
        else if (rinSize === 18) return 550;
        else if (rinSize === 20) return 750;
    }
    return 0;
}

// Configurar eventos para actualizar precios del Rin
function configurarEventosRin() {
    document.querySelectorAll('[id^="rin-"]').forEach(select => {
        select.addEventListener('change', function() {
            const productoId = this.id.replace('rin-', '');
            const productoCard = this.closest('.producto-card');
            const producto = productos.find(p => p.id == productoId || p.id == productoId.replace('detalles-', ''));
            
            if (producto && producto.categoria === 'Gomas') {
                const precioBase = producto.precio;
                const precioConRin = calcularPrecioRin(producto.descripcion);
                const precioMostrado = this.value === 'si' ? precioConRin : precioBase;
                
                // Actualizar precio en la card
                if (productoCard) {
                    const precioElement = productoCard.querySelector('.producto-precio');
                    const precioRinElement = productoCard.querySelector('.precio-rin');
                    
                    if (precioElement) {
                        precioElement.textContent = `$${precioBase} USD`;
                        if (precioRinElement) {
                            if (this.value === 'si') {
                                precioRinElement.textContent = `$${precioConRin} USD (Con Rin)`;
                                precioRinElement.style.display = 'block';
                            } else {
                                precioRinElement.style.display = 'none';
                            }
                        }
                    }
                }
                
                // Si estamos en el modal de detalles
                if (this.id === 'rin-detalles') {
                    const precioElement = document.querySelector('#detallesModal .detalles-precio');
                    if (precioElement) {
                        precioElement.textContent = `$${precioMostrado} USD`;
                    }
                }
            }
        });
    });
}

// Renderizar productos
function renderizarProductos(productosAMostrar = productos) {
    const productosContainer = document.getElementById('productos-container');
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
        const esGoma = producto.categoria === 'Gomas';
        const esPieza = Config.categoriasPiezas.includes(producto.categoria);
        const precioBase = producto.precio;
        const precioConRin = esGoma ? calcularPrecioRin(producto.descripcion) : 0;
        
        // Determinar si mostrar botón de encargo
        const mostrarEncargo = !esPieza;
        
        const productoHTML = `
            <div class="producto-card" data-id="${producto.id}" data-categoria="${producto.categoria}">
                ${producto.agotado ? '<div class="agotado-ribbon">Agotado</div>' : ''}
                <div class="producto-imagen">
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                </div>
                <div class="producto-info">
                    <h3 class="producto-titulo">${producto.nombre}</h3>
                    <p class="producto-precio">${esPieza ? `$${precioBase} USD` : formatearPrecio(precioBase)}</p>
                    ${esGoma ? `<p class="precio-rin" style="display:none; color:#2b8a3e; font-weight:bold;"></p>` : ''}
                    
                    <div class="producto-cantidad">
                        <label for="cantidad-${producto.id}">Cantidad:</label>
                        <input type="number" id="cantidad-${producto.id}" min="1" value="1" ${producto.agotado ? 'disabled' : ''}>
                    </div>
                    
                    ${esGoma ? `
                    <div class="producto-rin">
                        <label for="rin-${producto.id}">Con Rin:</label>
                        <select id="rin-${producto.id}" ${producto.agotado ? 'disabled' : ''}>
                            <option value="no">No (+$0)</option>
                            <option value="si">Sí (+$${precioConRin - precioBase})</option>
                        </select>
                    </div>
                    ` : ''}
                    
                    <div class="producto-acciones">
                        <button class="btn btn-outline acciones-btn ver-detalles" data-id="${producto.id}">
                            <i class="fas fa-eye"></i> Detalles
                        </button>
                        <button class="btn btn-secondary acciones-btn comprar-ahora" data-id="${producto.id}" ${producto.agotado ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> Comprar
                        </button>
                        ${mostrarEncargo ? `
                        <button class="btn btn-primary acciones-btn hacer-pedido" data-id="${producto.id}" ${producto.agotado ? 'disabled' : ''}>
                            <i class="fas fa-paper-plane"></i> Encargar
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        productosContainer.insertAdjacentHTML('beforeend', productoHTML);
    });
    
    // Configurar eventos para los selects de Rin
    configurarEventosRin();
}

// Mostrar modal de detalles con galería de imágenes
function mostrarModalDetalles(productoId) {
    productoActual = productos.find(p => p.id == productoId);
    if (!productoActual) return;

    const detallesContainer = document.getElementById('detalles-container');
    const esGoma = productoActual.categoria === 'Gomas';
    const esPieza = Config.categoriasPiezas.includes(productoActual.categoria);
    const precioBase = productoActual.precio;
    const precioConRin = esGoma ? calcularPrecioRin(productoActual.descripcion) : 0;
    
    // Determinar si mostrar botón de encargo
    const mostrarEncargo = !esPieza;
    
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
            <p class="detalles-precio">${esPieza ? `$${precioBase} USD` : formatearPrecio(precioBase)}</p>
            ${esGoma ? `<p class="precio-rin" style="display:none; color:#2b8a3e; font-weight:bold;"></p>` : ''}
            <p class="detalles-descripcion">${productoActual.descripcion}</p>
            
            ${productoActual.agotado ? '<p class="detalles-agotado"><i class="fas fa-times-circle"></i> Producto agotado</p>' : ''}
            
            <div class="producto-cantidad">
                <label for="cantidad-detalles">Cantidad:</label>
                <input type="number" id="cantidad-detalles" min="1" value="1" ${productoActual.agotado ? 'disabled' : ''}>
            </div>
            
            ${esGoma ? `
            <div class="producto-rin">
                <label for="rin-detalles">Con Rin:</label>
                <select id="rin-detalles" ${productoActual.agotado ? 'disabled' : ''}>
                    <option value="no">No (+$0)</option>
                    <option value="si">Sí (+$${precioConRin - precioBase})</option>
                </select>
            </div>
            ` : ''}
            
            <div class="detalles-acciones">
                <button class="btn btn-secondary comprar-ahora-btn" data-id="${productoActual.id}" ${productoActual.agotado ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> Comprar
                </button>
                ${mostrarEncargo ? `
                <button class="btn btn-primary hacer-pedido-btn" data-id="${productoActual.id}" ${productoActual.agotado ? 'disabled' : ''}>
                    <i class="fas fa-paper-plane"></i> Encargar
                </button>
                ` : ''}
            </div>
        </div>
    `;
    
    // Inicializar galería
    inicializarGaleria();
    
    // Configurar eventos para el select de Rin en el modal
    configurarEventosRin();

    // Event listeners para los botones del modal
    document.querySelector('.comprar-ahora-btn')?.addEventListener('click', function() {
        cantidadActual = parseInt(document.getElementById('cantidad-detalles').value) || 1;
        if (esGoma) {
            conRin = document.getElementById('rin-detalles').value === 'si';
        }
        cerrarModal();
        mostrarModalPago(productoActual.id);
    });
    
    document.querySelector('.hacer-pedido-btn')?.addEventListener('click', function() {
        cantidadActual = parseInt(document.getElementById('cantidad-detalles').value) || 1;
        if (esGoma) {
            conRin = document.getElementById('rin-detalles').value === 'si';
        }
        cerrarModal();
        mostrarModalPedido(productoActual.id);
    });
    
    document.getElementById('detallesModal').classList.add('show');
}

// Mostrar modal de pedido con imagen
function mostrarModalPedido(productoId) {
    productoActual = productos.find(p => p.id == productoId);
    if (!productoActual) return;
    
    const esPieza = Config.categoriasPiezas.includes(productoActual.categoria);
    const esGoma = productoActual.categoria === 'Gomas';
    const precioBase = productoActual.precio;
    const precioConRin = esGoma ? calcularPrecioRin(productoActual.descripcion) : 0;
    const precioMostrado = conRin ? precioConRin : precioBase;
    
    // Actualizar el contenido del modal de pedido
    const pedidoContent = document.getElementById('pedido-content');
    pedidoContent.innerHTML = `
        <h2>Realizar Encargo</h2>
        <div class="pedido-producto-info">
            <div class="pedido-producto-imagen">
                <img src="${productoActual.imagenes[0]}" alt="${productoActual.nombre}">
            </div>
            <div class="pedido-producto-texto">
                <h4>${productoActual.nombre}</h4>
                <p class="precio">${esPieza ? `$${precioMostrado} USD` : formatearPrecio(precioMostrado)}</p>
                ${esGoma && conRin ? `<p class="precio-rin" style="color:#2b8a3e;">Incluye Rin</p>` : ''}
                <p class="tiempo-entrega"><i class="fas fa-truck"></i> Tiempo de entrega: 25-30 días</p>
            </div>
        </div>
        <form id="pedidoForm">
            <input type="hidden" id="productoId" name="productoId" value="${productoId}">
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
                <input type="number" id="cantidad" name="cantidad" min="1" value="${cantidadActual}" required>
            </div>
            ${esGoma ? `
            <div class="form-group full-width" id="goma-rin-container">
                <label for="con-rin">¿Incluir Rin?</label>
                <select id="con-rin" name="con-rin">
                    <option value="no" ${!conRin ? 'selected' : ''}>No (+$0)</option>
                    <option value="si" ${conRin ? 'selected' : ''}>Sí (+$${precioConRin - precioBase})</option>
                </select>
            </div>
            ` : ''}
            <button type="submit" class="btn btn-primary">Confirmar Pedido <i class="fas fa-paper-plane"></i></button>
        </form>
    `;
    
    // Configurar evento para actualizar precio cuando cambia la opción de Rin
    if (esGoma) {
        document.getElementById('con-rin')?.addEventListener('change', function() {
            conRin = this.value === 'si';
            const precioElement = document.querySelector('.pedido-producto-texto .precio');
            const precioRinElement = document.querySelector('.pedido-producto-texto .precio-rin');
            
            if (precioElement) {
                precioElement.textContent = `$${conRin ? precioConRin : precioBase} USD`;
            }
            
            if (precioRinElement) {
                precioRinElement.style.display = conRin ? 'block' : 'none';
            }
        });
    }
    
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
    
    document.getElementById('pedidoModal').classList.add('show');
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

// Mostrar modal de selección de método de pago
function mostrarModalPago(productoId) {
    // Asegurarse de que tenemos el producto correcto
    productoActual = productos.find(p => p.id == productoId);
    if (!productoActual) return;
    
    // Verificar nuevamente la cantidad y opción de Rin
    const cantidadInput = document.getElementById(`cantidad-${productoId}`) || document.getElementById('cantidad-detalles');
    if (cantidadInput) {
        cantidadActual = parseInt(cantidadInput.value) || 1;
    }
    
    // Resetear conRin y actualizar solo si es goma
    conRin = false;
    if (productoActual.categoria === 'Gomas') {
        const selectRin = document.getElementById(`rin-${productoId}`) || document.getElementById('rin-detalles');
        if (selectRin) {
            conRin = selectRin.value === 'si';
        }
    }
    
    const esPieza = Config.categoriasPiezas.includes(productoActual.categoria);
    const esGoma = productoActual.categoria === 'Gomas';
    
    // Calcular precio según opción de Rin para gomas
    let precioBase = productoActual.precio;
    let precioRin = 0;
    
    if (esGoma) {
        precioRin = calcularPrecioRin(productoActual.descripcion);
        precioBase = conRin ? precioRin : precioBase;
    }
    
    const total = precioBase * cantidadActual;
    
    // Configurar métodos de pago
    configurarMetodosPago(productoActual, total, conRin);
    
    // Resetear método de pago seleccionado
    metodoPagoSeleccionado = null;
    
    // Configurar botones del modal de pago
    document.querySelector('.cancelar-pago').addEventListener('click', cerrarModal);
    
    document.querySelector('.confirmar-pago').addEventListener('click', function() {
        const metodoSeleccionado = document.querySelector('input[name="metodo-pago"]:checked');
        if (!metodoSeleccionado) {
            mostrarNotificacion('Por favor seleccione un método de pago', 'error');
            return;
        }
        
        metodoPagoSeleccionado = metodoSeleccionado.closest('.metodo-pago').dataset.metodo;
        cerrarModal();
        enviarPedidoWhatsapp(productoId, true);
    });
    
    document.getElementById('pagoModal').classList.add('show');
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('detallesModal').classList.remove('show');
    document.getElementById('pedidoModal').classList.remove('show');
    document.getElementById('pagoModal').classList.remove('show');
}

// Enviar pedido por WhatsApp
function enviarPedidoWhatsapp(event, esCompra = false) {
    if (!esCompra) {
        event.preventDefault();
    }

    // Obtener el producto actual
    let producto;
    let cantidad;
    let conRinActual = false;

    if (esCompra) {
        // Para compra directa
        producto = productoActual;
        cantidad = cantidadActual;
        
        if (producto.categoria === 'Gomas') {
            conRinActual = conRin;
        }
    } else {
        // Para pedido normal
        const productoId = document.getElementById('productoId').value;
        producto = productos.find(p => p.id == productoId);
        cantidad = document.getElementById('cantidad').value;
        
        if (producto.categoria === 'Gomas') {
            conRinActual = document.getElementById('con-rin').value === 'si';
        }
    }

    if (!producto) {
        mostrarNotificacion('Error al procesar el pedido', 'error');
        return;
    }

    const esPieza = Config.categoriasPiezas.includes(producto.categoria);
    const esGoma = producto.categoria === 'Gomas';
    
    // Calcular precio según opción de Rin para gomas
    let precioBase = producto.precio;
    let precioRin = 0;
    let conRinText = '';
    
    if (esGoma) {
        precioRin = calcularPrecioRin(producto.descripcion);
        precioBase = conRinActual ? precioRin : precioBase;
        const rinSize = producto.descripcion.match(/R(\d+)/)[1];
        conRinText = conRinActual ? ` (Con Rin R${rinSize})` : '';
    }
    
    const total = precioBase * cantidad;
    
    let mensaje = '';
    let numeroWhatsapp = Config.whatsappNumbers.consultas;
    
    if (esCompra) {
        // Mensaje para compra directa
        const metodoPago = metodoPagoSeleccionado;
        let metodoPagoText = '';
        let totalPago = total;
        
        if (esPieza) {
            if (metodoPago === 'zelle') {
                metodoPagoText = 'Zelle (+5%)';
                totalPago = total * (1 + Config.tasaZelle);
            } else if (metodoPago === 'transferencia') {
                metodoPagoText = 'Transferencia (+10%)';
                totalPago = total * (1 + Config.tasaTransferencia);
            } else if (metodoPago === 'efectivo-cup') {
                metodoPagoText = 'Efectivo (CUP) - Tasa del día';
            } else if (metodoPago === 'efectivo-usd') {
                metodoPagoText = 'Efectivo (USD)';
            }
            
            numeroWhatsapp = Config.whatsappNumbers.pedidos;
        } else {
            if (metodoPago === 'transferencia') {
                metodoPagoText = 'Transferencia';
            } else if (metodoPago === 'efectivo-cup') {
                metodoPagoText = 'Efectivo (CUP)';
            } else if (metodoPago === 'efectivo-usd') {
                metodoPagoText = 'Efectivo (USD)';
            }
        }
        
        mensaje = `¡Hola! Quiero comprar en D&M-Shop:

📌 *Producto:* ${producto.nombre}${conRinText}
💰 *Precio unitario:* ${esPieza ? `$${precioBase} USD` : formatearPrecio(precioBase)}
🔢 *Cantidad:* ${cantidad}
💵 *Total:* ${esPieza ? `$${totalPago.toFixed(2)} USD` : formatearPrecio(totalPago)}
💳 *Método de pago:* ${metodoPagoText}

¿Podrías confirmarme la disponibilidad y el proceso de pago? ¡Gracias!`;
    } else {
        // Mensaje para encargo
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const municipio = document.getElementById('municipio').value;
        const provincia = document.getElementById('provincia').value;
        
        mensaje = `¡Hola! Quiero hacer un encargo en D&M-Shop:

📌 *Producto:* ${producto.nombre}${conRinText}
💰 *Precio unitario:* ${esPieza ? `$${precioBase} USD` : formatearPrecio(precioBase)}
🔢 *Cantidad:* ${cantidad}
💵 *Total:* ${esPieza ? `$${total} USD` : formatearPrecio(total)}

👤 *Cliente:* ${nombre} ${apellidos}
📍 *Ubicación:* ${municipio}, ${provincia}

*Nota:* Entiendo que los pedidos tardan de 25 a 30 días en llegar.

¿Podrías confirmarme la disponibilidad y el proceso de pago? ¡Gracias!`;
        
        // Usar número de pedidos para piezas
        if (esPieza) {
            numeroWhatsapp = Config.whatsappNumbers.pedidos;
        }
    }
    
    const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
    
    cerrarModal();
    if (!esCompra) {
        document.getElementById('pedidoForm').reset();
    }
    
    mostrarNotificacion(esCompra ? 'Compra enviada por WhatsApp' : 'Pedido enviado por WhatsApp', 'exito');
}

// Buscar productos
function buscarProductos(termino) {
    if (!termino || termino.trim() === '') {
        const categoriaActiva = document.querySelector('.subcategory-btn.active').dataset.categoria;
        filtrarPorCategoria(categoriaActiva);
        return;
    }
    
    const terminoLower = termino.toLowerCase();
    const categoriaActiva = document.querySelector('.subcategory-btn.active').dataset.categoria;
    
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

// Filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    if (categoria === 'todos') {
        renderizarProductos(productos);
        return;
    }
    
    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    renderizarProductos(productosFiltrados);
}