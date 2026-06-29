// Projects Loader for All_Projects.html
// Loads projects from localStorage and displays them

(function() {
    'use strict';
    
    const STORAGE_KEY = 'portfolioProjects';
    
    // Load projects from localStorage
    function loadProjectsFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            return [];
        } catch (error) {
            console.error('Error loading projects:', error);
            return [];
        }
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Render projects to the grid
    function renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;
        
        const projects = loadProjectsFromStorage();
        
        if (projects.length === 0) {
            projectsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <i class="fas fa-folder-open" style="font-size: 4rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No projects yet</h3>
                    <p style="color: #666;">Projects added through the dashboard will appear here.</p>
                </div>
            `;
            return;
        }
        
        projectsGrid.innerHTML = projects.map((project, index) => {
            const tagsHtml = project.tags.map(tag => 
                `<span class="tag">${escapeHtml(tag)}</span>`
            ).join('');
            
            return `
                <div class="project-card" data-search="${escapeHtml(project.searchKeywords.toLowerCase())}">
                    <div class="project-img">
                        <img src="${escapeHtml(project.image)}" 
                             alt="${escapeHtml(project.name)}"
                             onerror="this.src='https://via.placeholder.com/350x200?text=No+Image'">
                    </div>
                    <div class="project-content">
                        <h3>${escapeHtml(project.name)}</h3>
                        <p>${escapeHtml(project.description)}</p>
                        <div class="project-tags">
                            ${tagsHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log(`Loaded ${projects.length} projects from dashboard`);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderProjects);
    } else {
        renderProjects();
    }
    
    // Re-render when storage changes (for real-time updates from dashboard)
    window.addEventListener('storage', function(e) {
        if (e.key === STORAGE_KEY) {
            renderProjects();
        }
    });
    
})();
