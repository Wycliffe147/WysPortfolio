document.addEventListener('DOMContentLoaded', () => {
    // Check for theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme !== 'light') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Secret Dashboard Access
    const logoElement = document.getElementById('logoElement');
    if (logoElement) {
        logoElement.style.cursor = 'pointer';
        logoElement.style.transition = 'transform 0.1s ease';
        logoElement.style.userSelect = 'none';

        logoElement.addEventListener('dblclick', (e) => {
            e.preventDefault();
            window.location.href = 'projects-dashboard.html';
        });

        logoElement.addEventListener('click', () => {
            logoElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                logoElement.style.transform = 'scale(1)';
            }, 100);
        });
    }
    
    if (currentTheme !== 'light') {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
    } else {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (isDark) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        });
    }

    const bentoGrid = document.getElementById('bentoGrid');
    const projectSearch = document.getElementById('projectSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('noResults');

    let allProjects = [];
    let currentCategory = 'all';
    let searchQuery = '';

    // Firebase initialization is handled by firebase-config.js
    const database = firebase.database();

    // Fetch projects from Firebase
    database.ref('projects').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            allProjects = Object.values(data);
            renderGrid();
        } else {
            // If Firebase is empty, try fallback to projects.json or show empty
            fetch('projects.json')
                .then(res => res.json())
                .then(data => {
                    allProjects = data;
                    renderGrid();
                })
                .catch(() => {
                    allProjects = [];
                    renderGrid();
                });
        }
    });

    function renderGrid() {
        const filtered = allProjects.filter(p => {
            const matchesCat = currentCategory === 'all' || p.category === currentCategory;
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            bentoGrid.style.display = 'none';
            noResults.style.display = 'block';
        } else {
            bentoGrid.style.display = 'grid';
            noResults.style.display = 'none';
            bentoGrid.innerHTML = filtered.map(p => `
                <div class="bento-item ${p.size}" onclick="window.location.href='project-details.html?id=${p.id}'">
                    <img src="${p.thumbnail}" class="item-img" alt="${p.title}" onerror="this.src='https://via.placeholder.com/600x400?text=Project'">
                    <div class="item-overlay">
                        <h3>${p.title}</h3>
                        <p>${p.category}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderGrid();
        });
    });

    // Search
    projectSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderGrid();
    });
});
