// Projects Dashboard JavaScript
// Handles CRUD operations for portfolio projects

// ============================================
// Storage Management
// ============================================

const STORAGE_KEY = 'portfolioProjects';

// Default projects (for initial load if no data exists)
const defaultProjects = [
    {
        name: "Report Generator Tool",
        description: "A tool that helps teachers to generate students' report cards after exams.",
        image: "https://via.placeholder.com/350x200?text=Report+Generator",
        tags: ["Excel", "VBA", "Automation"],
        searchKeywords: "report generator tool excel vba automation"
    },
    {
        name: "A logo for Star",
        description: "The logo for Star Private Secondary School & other versions I tried.",
        image: "https://via.placeholder.com/350x200?text=Star+Logo",
        tags: ["Design", "Logo", "Branding"],
        searchKeywords: "logo star design branding"
    },
    {
        name: "Reports Portal",
        description: "A website for a school that allows students to download their report cards.",
        image: "https://via.placeholder.com/350x200?text=Reports+Portal",
        tags: ["Web", "Design", "Development"],
        searchKeywords: "reports portal web design development"
    },
    {
        name: "Future Project",
        description: "Another exciting project coming soon.",
        image: "https://via.placeholder.com/350x200?text=Future+Project",
        tags: ["Web", "Design"],
        searchKeywords: "future project web design"
    },
    {
        name: "Inventory Tracker",
        description: "A web application for managing school inventory and supplies.",
        image: "https://via.placeholder.com/350x200?text=Inventory+Tracker",
        tags: ["Web", "Database", "Management"],
        searchKeywords: "inventory tracker web database"
    },
    {
        name: "Attendance System",
        description: "An automated system for tracking student attendance using Python.",
        image: "https://via.placeholder.com/350x200?text=Attendance+System",
        tags: ["Automation", "Python", "Tracking"],
        searchKeywords: "attendance system automation python"
    },
    {
        name: "Portfolio Website",
        description: "This very website showcasing my projects and tutorials.",
        image: "https://via.placeholder.com/350x200?text=Portfolio+Website",
        tags: ["HTML", "CSS", "JavaScript"],
        searchKeywords: "portfolio website html css javascript"
    },
    {
        name: "Math Game",
        description: "An interactive game to help students practice math skills.",
        image: "https://via.placeholder.com/350x200?text=Math+Game",
        tags: ["Education", "JavaScript", "Game"],
        searchKeywords: "math game education javascript"
    },
    {
        name: "Chat Application",
        description: "A real-time chat app for school communication using WebSocket.",
        image: "https://via.placeholder.com/350x200?text=Chat+App",
        tags: ["Web", "Socket", "Communication"],
        searchKeywords: "chat application web socket"
    },
    {
        name: "Cybersecurity Demo",
        description: "A demonstration of phishing attack prevention techniques.",
        image: "https://via.placeholder.com/350x200?text=Cybersecurity+Demo",
        tags: ["Cybersecurity", "Demo", "Phishing"],
        searchKeywords: "cybersecurity demo phishing"
    }
];

// Load projects from localStorage
function loadProjects() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // If no stored data, use default projects and save them
        saveProjects(defaultProjects);
        return defaultProjects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return defaultProjects;
    }
}

// Save projects to localStorage
function saveProjects(projects) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        updateStats();
        return true;
    } catch (error) {
        console.error('Error saving projects:', error);
        alert('Failed to save projects. Please try again.');
        return false;
    }
}

// ============================================
// UI Update Functions
// ============================================

// Update statistics
function updateStats() {
    const projects = loadProjects();
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('publishedProjects').textContent = projects.length;
    
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    document.getElementById('lastUpdated').textContent = today;
}

// Render projects table
function renderProjectsTable(searchTerm = '') {
    const projects = loadProjects();
    const tbody = document.getElementById('projectsTableBody');
    
    // Filter projects based on search term
    const filteredProjects = projects.filter(project => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            project.name.toLowerCase().includes(search) ||
            project.description.toLowerCase().includes(search) ||
            project.tags.some(tag => tag.toLowerCase().includes(search)) ||
            project.searchKeywords.toLowerCase().includes(search)
        );
    });
    
    if (filteredProjects.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>${searchTerm ? 'No projects found' : 'No projects yet'}</h3>
                    <p>${searchTerm ? 'Try a different search term' : 'Click "Add New Project" to get started'}</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredProjects.map((project, index) => {
        // Find the actual index in the full projects array
        const actualIndex = projects.findIndex(p => 
            p.name === project.name && 
            p.description === project.description
        );
        
        return `
            <tr>
                <td class="project-name-cell">${escapeHtml(project.name)}</td>
                <td class="project-desc-cell" title="${escapeHtml(project.description)}">${escapeHtml(project.description)}</td>
                <td>
                    <div class="project-tags-cell">
                        ${project.tags.map(tag => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </td>
                <td class="project-image-cell">
                    <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.name)}" onerror="this.src='https://via.placeholder.com/80x50?text=No+Image'">
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editProject(${actualIndex})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete" onclick="deleteProject(${actualIndex})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Modal Management
// ============================================

const projectModal = document.getElementById('projectModal');
const deleteModal = document.getElementById('deleteModal');
const projectForm = document.getElementById('projectForm');
let currentEditIndex = null;
let currentDeleteIndex = null;

// Open add project modal
function openAddProjectModal() {
    currentEditIndex = null;
    document.getElementById('modalTitle').textContent = 'Add New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectIndex').value = '';
    projectModal.classList.add('active');
}

// Open edit project modal
function editProject(index) {
    currentEditIndex = index;
    const projects = loadProjects();
    const project = projects[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectIndex').value = index;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectImage').value = project.image;
    document.getElementById('projectTags').value = project.tags.join(', ');
    document.getElementById('projectSearchKeywords').value = project.searchKeywords;
    
    projectModal.classList.add('active');
}

// Close project modal
function closeProjectModal() {
    projectModal.classList.remove('active');
    projectForm.reset();
    currentEditIndex = null;
}

// Open delete confirmation modal
function deleteProject(index) {
    currentDeleteIndex = index;
    const projects = loadProjects();
    const project = projects[index];
    
    document.getElementById('deleteProjectName').textContent = project.name;
    deleteModal.classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    deleteModal.classList.remove('active');
    currentDeleteIndex = null;
}

// Confirm delete
function confirmDelete() {
    if (currentDeleteIndex === null) return;
    
    const projects = loadProjects();
    projects.splice(currentDeleteIndex, 1);
    
    if (saveProjects(projects)) {
        renderProjectsTable();
        closeDeleteModal();
        showNotification('Project deleted successfully!', 'success');
    }
}

// ============================================
// Form Submission
// ============================================

projectForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('projectName').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const image = document.getElementById('projectImage').value.trim();
    const tagsInput = document.getElementById('projectTags').value.trim();
    const searchKeywords = document.getElementById('projectSearchKeywords').value.trim();
    
    // Parse tags
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // Create project object
    const project = {
        name,
        description,
        image,
        tags,
        searchKeywords: searchKeywords || tags.join(' ').toLowerCase()
    };
    
    const projects = loadProjects();
    
    if (currentEditIndex !== null) {
        // Edit existing project
        projects[currentEditIndex] = project;
        if (saveProjects(projects)) {
            renderProjectsTable();
            closeProjectModal();
            showNotification('Project updated successfully!', 'success');
        }
    } else {
        // Add new project
        projects.push(project);
        if (saveProjects(projects)) {
            renderProjectsTable();
            closeProjectModal();
            showNotification('Project added successfully!', 'success');
        }
    }
});

// ============================================
// Notifications
// ============================================

function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Search Functionality
// ============================================

document.getElementById('searchProjects').addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim();
    renderProjectsTable(searchTerm);
});

// ============================================
// Event Listeners
// ============================================

// Add project button
document.getElementById('addProjectBtn').addEventListener('click', openAddProjectModal);

// Close modal buttons
document.getElementById('closeModal').addEventListener('click', closeProjectModal);
document.getElementById('cancelBtn').addEventListener('click', closeProjectModal);
document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

// Close modals when clicking outside
projectModal.addEventListener('click', function(e) {
    if (e.target === projectModal) {
        closeProjectModal();
    }
});

deleteModal.addEventListener('click', function(e) {
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        // Clear session
        window.tempUserSession = null;
        document.cookie = 'userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '../index.html';
    }
});

// ============================================
// Authentication Check
// ============================================

function checkAuthOnLoad() {
    // Check if user is authenticated
    const isAuthenticated = window.tempUserSession || getCookie('userSession');
    
    if (!isAuthenticated) {
        alert('Please login to access the dashboard');
        window.location.href = 'login.html';
        return;
    }
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            try {
                return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

// ============================================
// Export Function for All_Projects.html
// ============================================

// This function will be used by All_Projects.html to load projects
function getProjectsForDisplay() {
    return loadProjects();
}

// Make it globally available
window.getProjectsForDisplay = getProjectsForDisplay;

// ============================================
// Initialize Dashboard
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    // checkAuthOnLoad(); // Commented out for easy testing
    
    // Load and display projects
    renderProjectsTable();
    updateStats();
    
    console.log('Dashboard initialized successfully');
});
