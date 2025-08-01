// Configurar métodos de pago
function configurarMetodosPago(producto, total, conRin = false) {
    const esPieza = Config.categoriasPiezas.includes(producto.categoria);
    const metodosPagoContainer = document.getElementById('metodos-pago');
    
    let metodosPagoHTML = '';
    const conRinText = conRin ? ` (Con Rin)` : '';

    if (esPieza) {
        metodosPagoHTML = `
            <h3>Total: $${total} USD${conRinText}</h3>
            <div class="metodo-pago" data-metodo="zelle" data-porcentaje="5">
                <div class="metodo-icono">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="metodo-info">
                    <h4>Pago por Zelle</h4>
                    <p>Total: $${(total * (1 + Config.tasaZelle)).toFixed(2)} USD (incluye 5%)</p>
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
                    <h4>Transferencia</h4>
                    <p>Total: $${(total * (1 + Config.tasaTransferencia)).toFixed(2)} USD (incluye 10%)</p>
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
                    <h4>Efectivo (CUP)</h4>
                    <p>Total: $${total} USD (Tasa del día)</p>
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
                    <h4>Efectivo (USD)</h4>
                    <p>Total: $${total} USD</p>
                </div>
                <div class="metodo-seleccion">
                    <input type="radio" name="metodo-pago" id="efectivo-usd" required>
                </div>
            </div>
        `;
    } else {
        metodosPagoHTML = `
            <h3>Total: ${formatearPrecio(total)}${conRinText}</h3>
            <div class="metodo-pago" data-metodo="transferencia">
                <div class="metodo-icono">
                    <i class="fas fa-exchange-alt"></i>
                </div>
                <div class="metodo-info">
                    <h4>Transferencia</h4>
                    <p>Pago por transferencia bancaria</p>
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
                    <h4>Efectivo (CUP)</h4>
                    <p>Pago en moneda nacional</p>
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
                    <h4>Efectivo (USD)</h4>
                    <p>Pago en dólares americanos</p>
                </div>
                <div class="metodo-seleccion">
                    <input type="radio" name="metodo-pago" id="efectivo-usd-hm" required>
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
}