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
    document.querySelector('.galeria-prev')?.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + items.length) % items.length;
        showImage(newIndex);
    });
    
    document.querySelector('.galeria-next')?.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % items.length;
        showImage(newIndex);
    });
    
    // Eventos para indicadores
    indicadores.forEach((ind, index) => {
        ind.addEventListener('click', () => showImage(index));
    });
}