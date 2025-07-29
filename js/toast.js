// Estilos dinámicos para las notificaciones toast
const toastStyles = document.createElement('style');
toastStyles.innerHTML = `
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    width: 100%;
}

.notification {
    background-color: white;
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(150%);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    display: flex;
    align-items: center;
    border-left: 4px solid #2b2d42;
}

.notification.show {
    transform: translateX(0);
}

.notification.exito {
    border-left-color: #2b2d42;
}

.notification.error {
    border-left-color: #ef233c;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification i {
    font-size: 1.2rem;
}

.notification.exito i {
    color: #2b2d42;
}

.notification.error i {
    color: #ef233c;
}

.notification span {
    flex: 1;
}

@media (max-width: 768px) {
    .notification-container {
        left: 20px;
        right: 20px;
        max-width: 100%;
    }
    
    .notification {
        transform: translateY(-150%);
    }
    
    .notification.show {
        transform: translateY(0);
    }
}
`;
document.head.appendChild(toastStyles);