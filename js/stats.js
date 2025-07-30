document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos de visitas del localStorage
    const stats = JSON.parse(localStorage.getItem('websiteStats')) || {
        totalVisits: 0,
        uniqueVisitors: 0,
        dailyVisits: {},
        visitsData: [],
        productViews: {}
    };

    // Actualizar contadores
    document.getElementById('total-visits').textContent = stats.totalVisits;
    document.getElementById('unique-visitors').textContent = stats.uniqueVisitors;
    
    // Visitas hoy
    const today = new Date().toLocaleDateString();
    const todayVisits = stats.dailyVisits[today] || 0;
    document.getElementById('today-visits').textContent = todayVisits;
    
    // Producto más popular
    let popularProduct = '-';
    let maxViews = 0;
    for (const [product, views] of Object.entries(stats.productViews)) {
        if (views > maxViews) {
            maxViews = views;
            popularProduct = product;
        }
    }
    document.getElementById('popular-product').textContent = popularProduct;
    
    // Gráfico de visitas
    const last7Days = [];
    const visitCounts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        last7Days.push(dateStr);
        visitCounts.push(stats.dailyVisits[dateStr] || 0);
    }
    
    const ctx = document.getElementById('visitsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Visitas por día',
                data: visitCounts,
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Tabla de últimas visitas
    const visitsList = document.getElementById('visits-list');
    const lastVisits = stats.visitsData.slice(-10).reverse(); // Últimas 10 visitas
    
    lastVisits.forEach(visit => {
        const row = document.createElement('tr');
        
        const date = new Date(visit.timestamp);
        const dateCell = document.createElement('td');
        dateCell.textContent = date.toLocaleDateString();
        
        const timeCell = document.createElement('td');
        timeCell.textContent = date.toLocaleTimeString();
        
        const pageCell = document.createElement('td');
        pageCell.textContent = visit.page;
        
        const deviceCell = document.createElement('td');
        deviceCell.textContent = visit.device;
        
        row.appendChild(dateCell);
        row.appendChild(timeCell);
        row.appendChild(pageCell);
        row.appendChild(deviceCell);
        
        visitsList.appendChild(row);
    });
});