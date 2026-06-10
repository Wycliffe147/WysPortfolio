document.addEventListener('DOMContentLoaded', () => {
    const bentoGrid = document.getElementById('bentoGrid');
    const projectSearch = document.getElementById('projectSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('noResults');

    let allProjects = [];
    let currentCategory = 'all';
    let searchQuery = '';

    // Fetch projects
    fetch('projects.json')
        .then(res => res.json())
        .then(data => {
            allProjects = data;
            renderGrid();
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
