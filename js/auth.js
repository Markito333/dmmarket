function checkAuth() {
    // Verificar si está en la página de stats
    if (window.location.pathname.includes('stats.html')) {
        const password = prompt('Ingrese la contraseña de administrador:');
        const correctPassword = "admin123"; // Cambia esto por una contraseña segura
        
        if (password !== correctPassword) {
            window.location.href = "productos.html";
        }
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);