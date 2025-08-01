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

// Verificar mensajería disponible
function verificarMensajeria(provincia, municipio) {
    if (provincia === 'Artemisa' && mensajeriaGratuita.includes(municipio)) {
        mostrarNotificacion('Mensajería disponible - Gratuita', 'exito');
    }
}