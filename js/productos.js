let productos = [];
let productoActual = null;
let metodoPagoSeleccionado = null;
let cantidadActual = 1;
let conRin = false;
let llantaSeleccionada = null;

function cargarProvincias() {
    const provinciaSelect = document.getElementById('provincia');
    provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';
    for (const provincia in ubicacionesCuba) {
        provinciaSelect.innerHTML += `<option value="${provincia}">${provincia}</option>`;
    }
}

function cargarMunicipios(provincia) {
    const municipioSelect = document.getElementById('municipio');
    municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
    if (provincia && ubicacionesCuba[provincia]) {
        ubicacionesCuba[provincia].forEach(municipio => {
            municipioSelect.innerHTML += `<option value="${municipio}">${municipio}</option>`;
        });
    }
}

function extraerTamanioRin(descripcion) {
    const match = descripcion.match(/R(\d+)/);
    return match ? parseInt(match[1]) : null;
}

function filtrarLlantasCompatibles(tamanioRin) {
    return productos.filter(producto => 
        producto.categoria === 'Llantas' && 
        producto.descripcion.startsWith(tamanioRin.toString())
    );
}

function mostrarModalLlantas(tamanioRin, callbackSeleccion) {
    const llantasCompatibles = filtrarLlantasCompatibles(tamanioRin);
    
    if (llantasCompatibles.length === 0) {
        mostrarNotificacion('No hay llantas disponibles para este tamaño', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h3>Seleccione una llanta R${tamanioRin}</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="llantas-container">
                ${llantasCompatibles.map(llanta => `
                    <div class="llanta-card" data-id="${llanta.id}">
                        <img src="${llanta.imagenes[0]}" alt="${llanta.nombre}">
                        <h4>${llanta.nombre}</h4>
                        <p>${llanta.descripcion}</p>
                        <p class="precio">$${llanta.precio} USD</p>
                        <button class="btn btn-primary seleccionar-llanta">Seleccionar</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal-llantas';
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelectorAll('.seleccionar-llanta').forEach(btn => {
        btn.addEventListener('click', function() {
            const llantaId = this.closest('.llanta-card').dataset.id;
            const llanta = llantasCompatibles.find(l => l.id == llantaId);
            callbackSeleccion(llanta);
            document.body.removeChild(modal);
        });
    });
}

function calcularPrecioBaseGoma(precioConRin) {
    if (precioConRin === 350) return 300;  // R14
    if (precioConRin === 400) return 350;  // R15/R16
    if (precioConRin === 550) return 450;  // R17
    if (precioConRin === 650) return 550;  // R18
    if (precioConRin === 850) return 750;  // R20
    return precioConRin - 50; 
}

function configurarEventosRin() {
    document.querySelectorAll('[id^="rin-"]').forEach(select => {
        select.addEventListener('change', function() {
            const productoId = this.id.replace('rin-', '');
            const productoCard = this.closest('.producto-card');
            const producto = productos.find(p => p.id == productoId || p.id == productoId.replace('detalles-', ''));
            
            if (producto && producto.categoria === 'Gomas') {
                const tamanioRin = extraerTamanioRin(producto.descripcion);
                
                if (this.value === 'si' && tamanioRin) {
                    mostrarModalLlantas(tamanioRin, (llanta) => {
                        llantaSeleccionada = llanta;
                        const precioBase = calcularPrecioBaseGoma(producto.precio);
                        const precioTotal = precioBase + llanta.precio;
                        
                        if (productoCard) {
                            const precioElement = productoCard.querySelector('.producto-precio');
                            const precioRinElement = productoCard.querySelector('.precio-rin');
                            
                            if (precioElement) {
                                precioElement.textContent = `$${precioTotal} USD`;
                            }
                            
                            if (precioRinElement) {
                                precioRinElement.textContent = `(Goma: $${precioBase} + Llanta: $${llanta.precio})`;
                                precioRinElement.style.display = 'block';
                            }
                        }
                        
                        producto.conRinSeleccionado = true;
                        producto.llantaSeleccionada = llanta;
                    });
                } else {
                    llantaSeleccionada = null;
                    const precioBase = producto.precio;
                    
                    if (productoCard) {
                        const precioElement = productoCard.querySelector('.producto-precio');
                        const precioRinElement = productoCard.querySelector('.precio-rin');
                        
                        if (precioElement) {
                            precioElement.textContent = `$${precioBase} USD`;
                        }
                        
                        if (precioRinElement) {
                            precioRinElement.style.display = 'none';
                        }
                    }
                    
                    producto.conRinSeleccionado = false;
                    producto.llantaSeleccionada = null;
                }
            }
        });
    });
}

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
                            <option value="no">No ($${precioBase} USD)</option>
                            <option value="si">Sí (Seleccionar llanta)</option>
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
    
    configurarEventosRin();
}

function mostrarModalDetalles(productoId) {
    productoActual = productos.find(p => p.id == productoId);
    if (!productoActual) return;
    
    productoActual.conRinSeleccionado = false;
    productoActual.llantaSeleccionada = null;
    llantaSeleccionada = null;
    
    const detallesContainer = document.getElementById('detalles-container');
    const esGoma = productoActual.categoria === 'Gomas';
    const esPieza = Config.categoriasPiezas.includes(productoActual.categoria);
    const precioBase = productoActual.precio;
    const mostrarEncargo = !esPieza;
    
    let galeriaHTML = '';
    productoActual.imagenes.forEach((imagen, index) => {
        galeriaHTML += `
            <div class="galeria-item ${index === 0 ? 'active' : ''}">
                <img src="${imagen}" alt="${productoActual.nombre} - ${index + 1}">
            </div>
        `;
    });
    
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
            <p class="detalles-precio" id="detalles-precio">${esPieza ? `$${precioBase} USD` : formatearPrecio(precioBase)}</p>
            <div id="llanta-seleccionada-container" style="display: none; margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                <p><strong>Llanta seleccionada:</strong> <span id="llanta-seleccionada-nombre"></span></p>
                <p><strong>Precio llanta:</strong> $<span id="llanta-seleccionada-precio">0</span> USD</p>
            </div>
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
                    <option value="no">No ($${precioBase} USD)</option>
                    <option value="si">Sí (Seleccionar llanta)</option>
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
    
    inicializarGaleria();
    
    if (esGoma) {
        const selectRin = document.getElementById('rin-detalles');
        const precioElement = document.getElementById('detalles-precio');
        const llantaContainer = document.getElementById('llanta-seleccionada-container');
        const llantaNombre = document.getElementById('llanta-seleccionada-nombre');
        const llantaPrecio = document.getElementById('llanta-seleccionada-precio');
        const tamanioRin = extraerTamanioRin(productoActual.descripcion);

        selectRin.addEventListener('change', function() {
            if (this.value === 'si' && tamanioRin) {
                mostrarModalLlantas(tamanioRin, (llanta) => {
                    llantaSeleccionada = llanta;
                    productoActual.llantaSeleccionada = llanta;
                    const precioBaseGoma = calcularPrecioBaseGoma(productoActual.precio);
                    const precioTotal = precioBaseGoma + llanta.precio;
                    
                    precioElement.textContent = `$${precioTotal} USD`;
                    llantaNombre.textContent = llanta.nombre;
                    llantaPrecio.textContent = llanta.precio;
                    llantaContainer.style.display = 'block';
                    productoActual.conRinSeleccionado = true;
                });
            } else {
                llantaSeleccionada = null;
                productoActual.llantaSeleccionada = null;
                precioElement.textContent = `$${precioBase} USD`;
                llantaContainer.style.display = 'none';
                productoActual.conRinSeleccionado = false;
            }
        });
    }

    document.querySelector('.comprar-ahora-btn')?.addEventListener('click', function() {
        cantidadActual = parseInt(document.getElementById('cantidad-detalles').value) || 1;
        
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

function mostrarModalPedido(productoId) {
    productoActual = productos.find(p => p.id == productoId);
    if (!productoActual) return;
    if (productoActual.categoria === 'Llantas' || 
       (productoActual.categoria === 'Gomas' && conRin)) {
        mostrarNotificacion('🚚 ¡Mensajería GRATIS para La Habana y Artemisa!', 'info');
    }
    const esPieza = Config.categoriasPiezas.includes(productoActual.categoria);
    const esGoma = productoActual.categoria === 'Gomas';
    const precioBase = productoActual.precio;
    const precioMostrado = conRin && llantaSeleccionada ? 
        (calcularPrecioBaseGoma(precioBase) + llantaSeleccionada.precio) : 
        precioBase;
    
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
                ${esGoma && conRin && llantaSeleccionada ? `
                    <p class="precio-rin" style="color:#2b8a3e;">
                        Incluye Rin: ${llantaSeleccionada.nombre} ($${llantaSeleccionada.precio} USD)
                    </p>
                ` : ''}
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
                    <option value="no" ${!conRin ? 'selected' : ''}>No ($${precioBase} USD)</option>
                    <option value="si" ${conRin ? 'selected' : ''}>Sí (Seleccionar llanta)</option>
                </select>
            </div>
            ${conRin && llantaSeleccionada ? `
            <div class="llanta-seleccionada-info" style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                <p><strong>Llanta seleccionada:</strong> ${llantaSeleccionada.nombre}</p>
                <p><strong>Precio llanta:</strong> $${llantaSeleccionada.precio} USD</p>
            </div>
            ` : ''}
            ` : ''}
            <button type="submit" class="btn btn-primary">Confirmar Pedido <i class="fas fa-paper-plane"></i></button>
        </form>
    `;
    
    if (esGoma) {
        const tamanioRin = extraerTamanioRin(productoActual.descripcion);
        const selectRin = document.getElementById('con-rin');
        
        selectRin.addEventListener('change', function() {
            conRin = this.value === 'si';
            
            if (conRin) {
                mostrarModalLlantas(tamanioRin, (llanta) => {
                    llantaSeleccionada = llanta;
                    const precioBaseGoma = calcularPrecioBaseGoma(productoActual.precio);
                    const precioTotal = precioBaseGoma + llanta.precio;
                    
                    const precioElement = document.querySelector('.pedido-producto-texto .precio');
                    const precioRinElement = document.querySelector('.pedido-producto-texto .precio-rin');
                    
                    if (precioElement) {
                        precioElement.textContent = `$${precioTotal} USD`;
                    }
                    
                    const llantaInfoContainer = document.querySelector('.llanta-seleccionada-info');
                    if (llantaInfoContainer) {
                        llantaInfoContainer.innerHTML = `
                            <p><strong>Llanta seleccionada:</strong> ${llanta.nombre}</p>
                            <p><strong>Precio llanta:</strong> $${llanta.precio} USD</p>
                        `;
                    } else {
                        const gomaRinContainer = document.getElementById('goma-rin-container');
                        if (gomaRinContainer) {
                            gomaRinContainer.insertAdjacentHTML('afterend', `
                                <div class="llanta-seleccionada-info" style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                                    <p><strong>Llanta seleccionada:</strong> ${llanta.nombre}</p>
                                    <p><strong>Precio llanta:</strong> $${llanta.precio} USD</p>
                                </div>
                            `);
                        }
                    }
                });
            } else {
                llantaSeleccionada = null;
                const precioElement = document.querySelector('.pedido-producto-texto .precio');
                if (precioElement) {
                    precioElement.textContent = `$${productoActual.precio} USD`;
                }
                
                const llantaInfoContainer = document.querySelector('.llanta-seleccionada-info');
                if (llantaInfoContainer) {
                    llantaInfoContainer.remove();
                }
            }
        });
    }
    
    const provinciaSelectModal = document.querySelector('#pedidoModal #provincia');
    const municipioSelectModal = document.querySelector('#pedidoModal #municipio');
    
    provinciaSelectModal.innerHTML = '<option value="">Seleccione una provincia</option>';
    for (const provincia in ubicacionesCuba) {
        provinciaSelectModal.innerHTML += `<option value="${provincia}">${provincia}</option>`;
    }
    
    provinciaSelectModal.addEventListener('change', function() {
        cargarMunicipiosEnModal(this.value, municipioSelectModal);
        verificarMensajeria(this.value, municipioSelectModal.value);
    });
    
    municipioSelectModal.addEventListener('change', function() {
        verificarMensajeria(provinciaSelectModal.value, this.value);
    });
    
    document.getElementById('pedidoModal').classList.add('show');
}

function mostrarModalPago(productoId) {
    productoActual = productos.find(p => p.id == productoId);
    if (!productoActual) return;
     // Mostrar notificación si es llanta o goma con rin
    if (productoActual.categoria === 'Llantas' || 
       (productoActual.categoria === 'Gomas' && productoActual.conRinSeleccionado)) {
        mostrarNotificacion('🚚 ¡Mensajería GRATIS para La Habana y Artemisa!', 'info');
    }
    // Verificar nuevamente la cantidad
    const cantidadInput = document.getElementById(`cantidad-${productoId}`) || document.getElementById('cantidad-detalles');
    if (cantidadInput) {
        cantidadActual = parseInt(cantidadInput.value) || 1;
    }
    
    const esGoma = productoActual.categoria === 'Gomas';
    let precioBase = productoActual.precio;
    let precioLlanta = 0;
    
    if (esGoma) {
        if (productoActual.conRinSeleccionado) {
            if (productoActual.llantaSeleccionada) {
                llantaSeleccionada = productoActual.llantaSeleccionada;
            }
            precioBase = calcularPrecioBaseGoma(productoActual.precio);
            precioLlanta = llantaSeleccionada?.precio || 0;
        } else {
            const selectRin = document.getElementById(`rin-${productoId}`) || document.getElementById('rin-detalles');
            if (selectRin?.value === 'si' && llantaSeleccionada) {
                precioBase = calcularPrecioBaseGoma(productoActual.precio);
                precioLlanta = llantaSeleccionada.precio;
            }
        }
    }
    
    const total = (precioBase + precioLlanta) * cantidadActual;
    
    const metodosPagoContainer = document.getElementById('metodos-pago');
    const esPieza = Config.categoriasPiezas.includes(productoActual.categoria);
    
    let resumenCompra = '';
    if (esGoma && (productoActual.conRinSeleccionado || llantaSeleccionada)) {
        resumenCompra = `
            <div class="resumen-compra">
                <h4 class="resumen-titulo">Resumen de compra</h4>
                <div class="resumen-item">
                    <span class="resumen-label">Producto:</span>
                    <span class="resumen-valor">${productoActual.nombre}</span>
                </div>
                <div class="resumen-item">
                    <span class="resumen-label">Precio goma:</span>
                    <span class="resumen-valor">$${precioBase} USD</span>
                </div>
                ${llantaSeleccionada ? `
                <div class="resumen-item">
                    <span class="resumen-label">Llanta:</span>
                    <span class="resumen-valor">${llantaSeleccionada.nombre}</span>
                </div>
                <div class="resumen-item">
                    <span class="resumen-label">Precio llanta:</span>
                    <span class="resumen-valor">$${llantaSeleccionada.precio} USD</span>
                </div>
                ` : ''}
                <div class="resumen-item">
                    <span class="resumen-label">Precio unitario:</span>
                    <span class="resumen-valor">$${precioBase + (llantaSeleccionada?.precio || 0)} USD</span>
                </div>
                <div class="resumen-item">
                    <span class="resumen-label">Cantidad:</span>
                    <span class="resumen-valor">${cantidadActual}</span>
                </div>
                <div class="resumen-item total">
                    <span class="resumen-label">Total:</span>
                    <span class="resumen-valor">$${total} USD</span>
                </div>
            </div>
        `;
    } else {
        resumenCompra = `
            <div class="resumen-compra">
                <h4 class="resumen-titulo">Resumen de compra</h4>
                <div class="resumen-item">
                    <span class="resumen-label">Producto:</span>
                    <span class="resumen-valor">${productoActual.nombre}</span>
                </div>
                <div class="resumen-item">
                    <span class="resumen-label">Precio unitario:</span>
                    <span class="resumen-valor">${esPieza ? `$${precioBase} USD` : formatearPrecio(precioBase)}</span>
                </div>
                <div class="resumen-item">
                    <span class="resumen-label">Cantidad:</span>
                    <span class="resumen-valor">${cantidadActual}</span>
                </div>
                <div class="resumen-item total">
                    <span class="resumen-label">Total:</span>
                    <span class="resumen-valor">${esPieza ? `$${total} USD` : formatearPrecio(total)}</span>
                </div>
            </div>
        `;
    }
    
    let metodosPagoHTML = '';
    
    if (esPieza) {
        metodosPagoHTML = `
            ${resumenCompra}
            <div class="metodos-pago-container">
                <h4 class="metodos-titulo">Métodos de pago</h4>
                <div class="metodo-pago" data-metodo="zelle" data-porcentaje="5">
                    <div class="metodo-icono">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="metodo-info">
                        <h4 class="metodo-nombre">Pago por Zelle</h4>
                        <p class="metodo-detalle">Total: $${(total * (1 + Config.tasaZelle)).toFixed(2)} USD (incluye 5%)</p>
                    </div>
                    <div class="metodo-seleccion">
                        <input type="radio" name="metodo-pago" id="zelle" required>
                    </div>
                </div>
                <div class="metodo-pago" data-metodo="transferencia" data-porcentaje="10">
                    <div class="metodo-icono">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    <div class="metodo-info">
                        <h4 class="metodo-nombre">Transferencia</h4>
                        <p class="metodo-detalle">Total: $${(total * (1 + Config.tasaTransferencia)).toFixed(2)} USD (incluye 10%)</p>
                    </div>
                    <div class="metodo-seleccion">
                        <input type="radio" name="metodo-pago" id="transferencia" required>
                    </div>
                </div>
                <div class="metodo-pago" data-metodo="efectivo-cup">
                    <div class="metodo-icono">
                        <i class="fas fa-money-bill"></i>
                    </div>
                    <div class="metodo-info">
                        <h4 class="metodo-nombre">Efectivo (CUP)</h4>
                        <p class="metodo-detalle">Total: $${total} USD (Tasa del día)</p>
                    </div>
                    <div class="metodo-seleccion">
                        <input type="radio" name="metodo-pago" id="efectivo-cup" required>
                    </div>
                </div>
                <div class="metodo-pago" data-metodo="efectivo-usd">
                    <div class="metodo-icono">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="metodo-info">
                        <h4 class="metodo-nombre">Efectivo (USD)</h4>
                        <p class="metodo-detalle">Total: $${total} USD</p>
                    </div>
                    <div class="metodo-seleccion">
                        <input type="radio" name="metodo-pago" id="efectivo-usd" required>
                    </div>
                </div>
            </div>
        `;
    } else {
        metodosPagoHTML = `
            ${resumenCompra}
            <div class="metodos-pago-container">
                <h4 class="metodos-titulo">Métodos de pago</h4>
                <div class="metodo-pago" data-metodo="transferencia">
                    <div class="metodo-icono">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    <div class="metodo-info">
                        <h4 class="metodo-nombre">Transferencia</h4>
                        <p class="metodo-detalle">Pago por transferencia bancaria</p>
                    </div>
                    <div class="metodo-seleccion">
                        <input type="radio" name="metodo-pago" id="transferencia-hm" required>
                    </div>
                </div>
                <div class="metodo-pago" data-metodo="efectivo-cup">
                    <div class="metodo-icono">
                        <i class="fas fa-money-bill"></i>
                    </div>
                    <div class="metodo-info">
                        <h4 class="metodo-nombre">Efectivo (CUP)</h4>
                        <p class="metodo-detalle">Pago en moneda nacional</p>
                    </div>
                    <div class="metodo-seleccion">
                        <input type="radio" name="metodo-pago" id="efectivo-cup-hm" required>
                    </div>
                </div>
                <div class="metodo-pago" data-metodo="efectivo-usd">
                    <div class="metodo-icono">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="metodo-info">
                        <h4 class="metodo-nombre">Efectivo (USD)</h4>
                        <p class="metodo-detalle">Pago en dólares americanos</p>
                    </div>
                    <div class="metodo-seleccion">
                        <input type="radio" name="metodo-pago" id="efectivo-usd-hm" required>
                    </div>
                </div>
            </div>
        `;
    }
    
    metodosPagoContainer.innerHTML = metodosPagoHTML;
    
    // Configurar evento para selección de método de pago
    document.querySelectorAll('.metodo-pago').forEach(metodo => {
        metodo.addEventListener('click', function() {
            document.querySelectorAll('.metodo-pago').forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });
    
    metodoPagoSeleccionado = null;
    
    document.querySelector('.cancelar-pago').addEventListener('click', cerrarModal);
    
    document.querySelector('.confirmar-pago').addEventListener('click', function() {
        const metodoSeleccionado = document.querySelector('input[name="metodo-pago"]:checked');
        if (!metodoSeleccionado) {
            mostrarNotificacion('Por favor seleccione un método de pago', 'error');
            return;
        }
        
        metodoPagoSeleccionado = metodoSeleccionado.closest('.metodo-pago').dataset.metodo;
        cerrarModal();
        enviarPedidoWhatsapp(productoActual.id, true);
    });
    
    // Asegurarse de que el modal sea responsive
    const pagoModal = document.getElementById('pagoModal');
    pagoModal.style.overflowY = 'auto';
    
    document.getElementById('pagoModal').classList.add('show');
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
    document.getElementById('detallesModal').classList.remove('show');
    document.getElementById('pedidoModal').classList.remove('show');
    document.getElementById('pagoModal').classList.remove('show');
}

// Enviar pedido por WhatsApp
// Enviar pedido por WhatsApp
function enviarPedidoWhatsapp(event, esCompra = false) {
    if (!esCompra) {
        event.preventDefault();
    }

    // Obtener el producto actual
    let producto;
    let cantidad;
    let conRinActual = false;
    let rinSeleccionado = "Sin Rin";
    let llantaInfo = '';

    if (esCompra) {
        producto = productoActual;
        cantidad = cantidadActual;
        
        if (producto.categoria === 'Gomas') {
            conRinActual = producto.conRinSeleccionado !== undefined ? 
                          producto.conRinSeleccionado : 
                          conRin;
            
            rinSeleccionado = conRinActual ? "Con Rin" : "Sin Rin";
            
            if (conRinActual && llantaSeleccionada) {
                const precioBaseGoma = calcularPrecioBaseGoma(producto.precio);
                llantaInfo = `
🛞 *Opción Rin:* Con Rin (Llanta seleccionada)
🔩 *Llanta seleccionada:* ${llantaSeleccionada.nombre}
🔧 *Descripción llanta:* ${llantaSeleccionada.descripcion}
💰 *Precio goma:* $${precioBaseGoma} USD
💰 *Precio llanta:* $${llantaSeleccionada.precio} USD
💰 *Precio unitario total:* $${precioBaseGoma + llantaSeleccionada.precio} USD
                `;
            } else {
                llantaInfo = `
🛞 *Opción Rin:* Sin Rin
💰 *Precio unitario:* $${producto.precio} USD
                `;
            }
        }
    } else {
        const productoId = document.getElementById('productoId').value;
        producto = productos.find(p => p.id == productoId);
        cantidad = document.getElementById('cantidad').value;
        
        if (producto.categoria === 'Gomas') {
            conRinActual = document.getElementById('con-rin')?.value === 'si';
            rinSeleccionado = conRinActual ? "Con Rin" : "Sin Rin";
            
            if (conRinActual && llantaSeleccionada) {
                const precioBaseGoma = calcularPrecioBaseGoma(producto.precio);
                llantaInfo = `
🛞 *Opción Rin:* Con Rin (Llanta seleccionada)
🔩 *Llanta seleccionada:* ${llantaSeleccionada.nombre}
🔧 *Descripción llanta:* ${llantaSeleccionada.descripcion}
💰 *Precio goma:* $${precioBaseGoma} USD
💰 *Precio llanta:* $${llantaSeleccionada.precio} USD
💰 *Precio unitario total:* $${precioBaseGoma + llantaSeleccionada.precio} USD
                `;
            } else {
                llantaInfo = `
🛞 *Opción Rin:* Sin Rin
💰 *Precio unitario:* $${producto.precio} USD
                `;
            }
        }
    }

    if (!producto) {
        mostrarNotificacion('Error al procesar el pedido', 'error');
        return;
    }

    const esPieza = Config.categoriasPiezas.includes(producto.categoria);
    const esGoma = producto.categoria === 'Gomas';
    const esLlanta = producto.categoria === 'Llantas';
    
    // Calcular precio total
    let precioUnitario = producto.precio;
    if (esGoma && conRinActual && llantaSeleccionada) {
        precioUnitario = calcularPrecioBaseGoma(producto.precio) + llantaSeleccionada.precio;
    }
    
    const total = precioUnitario * cantidad;
    
    // Mensaje de mensajería gratis (si aplica)
    const mensajeMensajeria = (esLlanta || (esGoma && conRinActual)) ? `
🎉 *¡OFERTA ESPECIAL!* 🎉
🚚 Mensajería GRATIS para clientes de La Habana y Artemisa
    ` : '';
    
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
            
            mensaje = `¡Hola! Quiero comprar en D&M-Shop:

📌 *Producto:* ${producto.nombre}
📝 *Descripción:* ${producto.descripcion}
${llantaInfo}
${mensajeMensajeria}
🔢 *Cantidad:* ${cantidad}
💵 *Total:* $${totalPago.toFixed(2)} USD
💳 *Método de pago:* ${metodoPagoText}

¿Podrías confirmarme la disponibilidad y el proceso de pago? ¡Gracias!`;
        } else {
            if (metodoPago === 'transferencia') {
                metodoPagoText = 'Transferencia';
            } else if (metodoPago === 'efectivo-cup') {
                metodoPagoText = 'Efectivo (CUP)';
            } else if (metodoPago === 'efectivo-usd') {
                metodoPagoText = 'Efectivo (USD)';
            }
            
            mensaje = `¡Hola! Quiero comprar en D&M-Shop:

📌 *Producto:* ${producto.nombre}
📝 *Descripción:* ${producto.descripcion}
${llantaInfo}
${mensajeMensajeria}
🔢 *Cantidad:* ${cantidad}
💵 *Total:* ${formatearPrecio(totalPago)}
💳 *Método de pago:* ${metodoPagoText}

¿Podrías confirmarme la disponibilidad y el proceso de pago? ¡Gracias!`;
        }
    } else {
        // Mensaje para encargo
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const municipio = document.getElementById('municipio').value;
        const provincia = document.getElementById('provincia').value;
        
        mensaje = `¡Hola! Quiero hacer un encargo en D&M-Shop:

📌 *Producto:* ${producto.nombre}
📝 *Descripción:* ${producto.descripcion}
${llantaInfo}
${mensajeMensajeria}
🔢 *Cantidad:* ${cantidad}
💵 *Total:* ${esPieza ? `$${total} USD` : formatearPrecio(total)}

👤 *Cliente:* ${nombre} ${apellidos}
📍 *Ubicación:* ${municipio}, ${provincia}

*Nota:* Entiendo que los pedidos tardan de 25 a 30 días en llegar.

¿Podrías confirmarme la disponibilidad y el proceso de pago? ¡Gracias!`;
        
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

// Modificar la función mostrarModalLlantas para mostrar notificación
function mostrarModalLlantas(tamanioRin, callbackSeleccion) {
    const llantasCompatibles = filtrarLlantasCompatibles(tamanioRin);
    
    if (llantasCompatibles.length === 0) {
        mostrarNotificacion('No hay llantas disponibles para este tamaño', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h3>Seleccione una llanta R${tamanioRin}</h3>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="llantas-container">
                ${llantasCompatibles.map(llanta => `
                    <div class="llanta-card" data-id="${llanta.id}">
                        <img src="${llanta.imagenes[0]}" alt="${llanta.nombre}">
                        <h4>${llanta.nombre}</h4>
                        <p>${llanta.descripcion}</p>
                        <p class="precio">$${llanta.precio} USD</p>
                        <button class="btn btn-primary seleccionar-llanta">Seleccionar</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal-llantas';
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelectorAll('.seleccionar-llanta').forEach(btn => {
        btn.addEventListener('click', function() {
            const llantaId = this.closest('.llanta-card').dataset.id;
            const llanta = llantasCompatibles.find(l => l.id == llantaId);
            callbackSeleccion(llanta);
            document.body.removeChild(modal);
            
            // Mostrar notificación de mensajería gratis
            mostrarNotificacion('🚚 ¡Mensajería GRATIS para La Habana y Artemisa en compras de llantas o gomas con rines!', 'info');
        });
    });
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

// Inicializar galería de imágenes
function inicializarGaleria() {
    const galeriaContainer = document.querySelector('.galeria-container');
    const galeriaItems = document.querySelectorAll('.galeria-item');
    const indicadores = document.querySelectorAll('.galeria-indicador');
    const btnPrev = document.querySelector('.galeria-prev');
    const btnNext = document.querySelector('.galeria-next');
    
    let currentIndex = 0;
    
    function showSlide(index) {
        galeriaItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        indicadores.forEach((indicador, i) => {
            indicador.classList.toggle('active', i === index);
        });
    }
    
    btnPrev?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galeriaItems.length) % galeriaItems.length;
        showSlide(currentIndex);
    });
    
    btnNext?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galeriaItems.length;
        showSlide(currentIndex);
    });
    
    indicadores.forEach((indicador, index) => {
        indicador.addEventListener('click', () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
    });
    
    // Mostrar el primer slide al inicializar
    if (galeriaItems.length > 0) {
        showSlide(0);
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'exito') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Verificar mensajería según ubicación
function verificarMensajeria(provincia, municipio) {
    // Implementar lógica para verificar disponibilidad de mensajería
    // según la provincia y municipio seleccionados
}

// Inicializar la aplicación
function init() {
    cargarProvincias();
    
    // Configurar eventos para provincia/municipio
    document.getElementById('provincia').addEventListener('change', function() {
        cargarMunicipios(this.value);
        verificarMensajeria(this.value, document.getElementById('municipio').value);
    });
    
    document.getElementById('municipio').addEventListener('change', function() {
        verificarMensajeria(document.getElementById('provincia').value, this.value);
    });
    
    // Configurar eventos de búsqueda
    document.getElementById('buscador').addEventListener('input', function() {
        buscarProductos(this.value);
    });
    
    // Configurar eventos de categorías
    document.querySelectorAll('.subcategory-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.subcategory-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtrarPorCategoria(this.dataset.categoria);
        });
    });
    
    // Configurar eventos para los botones de compra rápida
    document.addEventListener('click', function(e) {
        if (e.target.closest('.comprar-ahora')) {
            const productoId = e.target.closest('.comprar-ahora').dataset.id;
            const cantidadInput = document.getElementById(`cantidad-${productoId}`);
            cantidadActual = parseInt(cantidadInput.value) || 1;
            
            productoActual = productos.find(p => p.id == productoId);
            
            if (productoActual.categoria === 'Gomas') {
                const selectRin = e.target.closest('.producto-card').querySelector('[id^="rin-"]');
                conRin = selectRin?.value === 'si';
                
                if (conRin && productoActual.llantaSeleccionada) {
                    llantaSeleccionada = productoActual.llantaSeleccionada;
                }
            }
            
            mostrarModalPago(productoId);
        }
        
        if (e.target.closest('.hacer-pedido')) {
            const productoId = e.target.closest('.hacer-pedido').dataset.id;
            const cantidadInput = document.getElementById(`cantidad-${productoId}`);
            cantidadActual = parseInt(cantidadInput.value) || 1;
            
            // Asegurarnos de actualizar productoActual correctamente
            productoActual = productos.find(p => p.id == productoId);
            
            if (productoActual.categoria === 'Gomas') {
                const selectRin = e.target.closest('.producto-card').querySelector('[id^="rin-"]');
                conRin = selectRin?.value === 'si';
                
                if (conRin) {
                    // Si es goma con rin, asegurarnos de tener la llanta seleccionada
                    if (!productoActual.llantaSeleccionada && llantaSeleccionada) {
                        productoActual.llantaSeleccionada = llantaSeleccionada;
                    }
                } else {
                    productoActual.conRinSeleccionado = false;
                    productoActual.llantaSeleccionada = null;
                }
            }
            
            // Limpiar posibles valores anteriores
            llantaSeleccionada = productoActual.llantaSeleccionada;
            conRin = productoActual.categoria === 'Gomas' ? 
                    (productoActual.conRinSeleccionado || false) : false;
            
            mostrarModalPedido(productoId);
        }
        
        if (e.target.closest('.ver-detalles')) {
            const productoId = e.target.closest('.ver-detalles').dataset.id;
            mostrarModalDetalles(productoId);
        }
    });
    
    
    // Configurar evento para el formulario de pedido
    document.getElementById('pedidoForm')?.addEventListener('submit', enviarPedidoWhatsapp);
}

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);