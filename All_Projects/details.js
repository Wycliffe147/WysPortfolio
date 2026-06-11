document.addEventListener('DOMContentLoaded', () => {
    // Check for theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (currentTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
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

    const projectDetail = document.getElementById('projectDetail');
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        window.location.href = 'index.html';
        return;
    }

    fetch('projects.json')
        .then(res => res.json())
        .then(projects => {
            const project = projects.find(p => p.id === projectId);
            if (!project) {
                projectDetail.innerHTML = '<h1>Project not found</h1><a href="index.html">Back to Showcase</a>';
                return;
            }
            renderDetails(project);
        });

    function renderDetails(p) {
        projectDetail.innerHTML = `
            <div class="container">
                <div class="detail-hero">
                    <span class="detail-category">${p.category}</span>
                    <h1>${p.title}</h1>
                </div>

                <div class="detail-grid">
                    <div class="detail-image-container">
                        <img src="${p.thumbnail}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/800x600?text=Project+Preview'">
                    </div>
                    
                    <div class="detail-info">
                        <div class="detail-story">
                            <h2>The Challenge</h2>
                            <p>${p.story.challenge}</p>
                            
                            <h2>The Solution</h2>
                            <p>${p.story.solution}</p>
                            
                            <h2>The Result</h2>
                            <p>${p.story.result}</p>
                        </div>

                        <h2>Technologies Used</h2>
                        <div class="detail-tech">
                            ${p.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
                        </div>

                        <div class="detail-actions">
                            <a href="${p.links.live}" class="btn-main">Launch Live Site</a>
                            <a href="${p.links.github}" class="btn-github" target="_blank" style="text-decoration:none; color:white; padding:1.2rem; border-radius:15px; background:rgba(255,255,255,0.1); font-weight:700;">
                                <i class="fab fa-github"></i> View Code
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.title = `${p.title} - Wy's Portfolio`;
    }
});
