// Projects Dashboard JavaScript
// Handles CRUD operations for portfolio projects using Firebase

// ============================================
// Firebase & Storage Management
// ============================================

const database = firebase.database();
const PROJECTS_PATH = 'projects';

// Load projects from Firebase
function loadProjects(callback) {
    const projectsRef = database.ref(PROJECTS_PATH);
    projectsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        
        // Convert object to array and include Firebase keys
        const projectsWithKeys = data ? Object.entries(data).map(([key, value]) => ({
            ...value,
            firebaseKey: key
        })) : [];
        
        allProjects = projectsWithKeys; // Update global variable
        if (callback) callback(projectsWithKeys);
    }, (error) => {
        console.error('Error loading projects from Firebase:', error);
        showNotification(`Failed to load projects: ${error.message}`, 'danger');
    });
}

// Save project to Firebase
function saveProjectToFirebase(project, firebaseKey = null) {
    if (firebaseKey) {
        // Update existing
        return database.ref(`${PROJECTS_PATH}/${firebaseKey}`).set(project);
    } else {
        // Push new
        return database.ref(PROJECTS_PATH).push(project);
    }
}

// Delete project from Firebase
function deleteProjectFromFirebase(firebaseKey) {
    if (!firebaseKey) return Promise.reject('No key provided');
    return database.ref(`${PROJECTS_PATH}/${firebaseKey}`).remove();
}

// ============================================
// UI Update Functions
// ============================================

let allProjects = [];

// Update statistics
function updateStats(projects) {
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('publishedProjects').textContent = projects.length;
    
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    document.getElementById('lastUpdated').textContent = today;
}

// Render projects table
function renderProjectsTable(projects, searchTerm = '') {
    const tbody = document.getElementById('projectsTableBody');
    
    // Filter projects based on search term
    const filteredProjects = projects.filter(project => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            (project.title && project.title.toLowerCase().includes(search)) ||
            (project.shortDesc && project.shortDesc.toLowerCase().includes(search)) ||
            (project.category && project.category.toLowerCase().includes(search)) ||
            (project.tech && project.tech.some(t => t.toLowerCase().includes(search)))
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
        return `
            <tr>
                <td class="project-name-cell">${escapeHtml(project.title)}</td>
                <td class="project-desc-cell" title="${escapeHtml(project.shortDesc)}">${escapeHtml(project.shortDesc)}</td>
                <td>
                    <div class="project-tags-cell">
                        ${project.tech ? project.tech.map(t => `<span class="tag-badge">${escapeHtml(t)}</span>`).join('') : ''}
                    </div>
                </td>
                <td class="project-image-cell">
                    <img src="${escapeHtml(project.thumbnail)}" alt="${escapeHtml(project.title)}" onerror="this.src='https://via.placeholder.com/80x50?text=No+Image'">
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editProject('${project.firebaseKey}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete" onclick="deleteProject('${project.firebaseKey}')">
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
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// URL Validation helper
function isValidUrl(string) {
    if (!string || string === '#') return true; // Allow empty or # as "not provided"
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}

// Function to test links in a new tab
function testLink(inputId) {
    const url = document.getElementById(inputId).value.trim();
    if (!url || url === '#') {
        showNotification('Please enter a URL first', 'info');
        return;
    }
    
    try {
        new URL(url);
        window.open(url, '_blank');
    } catch (_) {
        showNotification('Invalid URL. Please include http:// or https://', 'danger');
    }
}

// ============================================
// Modal & Tab Management
// ============================================

const projectModal = document.getElementById('projectModal');
const deleteModal = document.getElementById('deleteModal');
const projectForm = document.getElementById('projectForm');
let currentEditKey = null;
let currentDeleteKey = null;

// Tab switching logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

function resetTabs() {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    tabBtns[0].classList.add('active');
    tabContents[0].classList.add('active');
}

// Auto-generate ID from Title
document.getElementById('projectName').addEventListener('input', function(e) {
    if (!currentEditKey) {
        const title = e.target.value;
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, '-');
        document.getElementById('projectId').value = slug;
    }
});

// Open add project modal
function openAddProjectModal() {
    currentEditKey = null;
    document.getElementById('modalTitle').textContent = 'Add New Project';
    projectForm.reset();
    resetTabs();
    projectModal.classList.add('active');
}

// Open edit project modal
function editProject(key) {
    currentEditKey = key;
    const project = allProjects.find(p => p.firebaseKey === key);
    if (!project) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Project';
    resetTabs();
    
    // Populate form
    document.getElementById('projectName').value = project.title || '';
    document.getElementById('projectId').value = project.id || '';
    document.getElementById('projectCategory').value = project.category || 'Web App';
    document.getElementById('projectSize').value = project.size || 'medium';
    document.getElementById('projectDescription').value = project.shortDesc || '';
    document.getElementById('projectImage').value = project.thumbnail || '';
    
    document.getElementById('storyChallenge').value = project.story?.challenge || '';
    document.getElementById('storySolution').value = project.story?.solution || '';
    document.getElementById('storyResult').value = project.story?.result || '';
    
    document.getElementById('projectTags').value = project.tech ? project.tech.join(', ') : '';
    document.getElementById('projectSearchKeywords').value = project.searchKeywords || '';
    document.getElementById('linkLive').value = project.links?.live || '';
    document.getElementById('linkGithub').value = project.links?.github || '';
    
    projectModal.classList.add('active');
}

// Close project modal
function closeProjectModal() {
    projectModal.classList.remove('active');
    projectForm.reset();
    currentEditKey = null;
}

// Open delete confirmation modal
function deleteProject(key) {
    currentDeleteKey = key;
    const project = allProjects.find(p => p.firebaseKey === key);
    if (!project) return;
    
    document.getElementById('deleteProjectName').textContent = project.title;
    deleteModal.classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    deleteModal.classList.remove('active');
    currentDeleteKey = null;
}

// Confirm delete
function confirmDelete() {
    if (!currentDeleteKey) return;
    
    deleteProjectFromFirebase(currentDeleteKey)
        .then(() => {
            closeDeleteModal();
            showNotification('Project deleted successfully!', 'success');
        })
        .catch(err => {
            console.error(err);
            showNotification('Failed to delete project', 'danger');
        });
}

// ============================================
// Form Submission
// ============================================

projectForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const liveUrl = document.getElementById('linkLive').value.trim();
    const githubUrl = document.getElementById('linkGithub').value.trim();

    // Validate URLs
    if (!isValidUrl(liveUrl)) {
        showNotification('Please enter a valid Live Demo URL (including http:// or https://)', 'danger');
        return;
    }
    if (!isValidUrl(githubUrl)) {
        showNotification('Please enter a valid GitHub URL (including http:// or https://)', 'danger');
        return;
    }

    const project = {
        id: document.getElementById('projectId').value.trim(),
        title: document.getElementById('projectName').value.trim(),
        category: document.getElementById('projectCategory').value,
        size: document.getElementById('projectSize').value,
        shortDesc: document.getElementById('projectDescription').value.trim(),
        thumbnail: document.getElementById('projectImage').value.trim(),
        story: {
            challenge: document.getElementById('storyChallenge').value.trim(),
            solution: document.getElementById('storySolution').value.trim(),
            result: document.getElementById('storyResult').value.trim()
        },
        tech: document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t),
        searchKeywords: document.getElementById('projectSearchKeywords').value.trim(),
        links: {
            live: liveUrl || '',
            github: githubUrl || ''
        }
    };
    
    saveProjectToFirebase(project, currentEditKey)
        .then(() => {
            closeProjectModal();
            showNotification(currentEditKey ? 'Project updated!' : 'Project added!', 'success');
        })
        .catch(err => {
            console.error(err);
            showNotification('Error saving project', 'danger');
        });
});

// ============================================
// Notifications
// ============================================

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// Search Functionality
// ============================================

document.getElementById('searchProjects').addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim();
    renderProjectsTable(allProjects, searchTerm);
});

// ============================================
// Event Listeners
// ============================================

const sidebar = document.querySelector('.sidebar');
const menuToggle = document.getElementById('menuToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// Close sidebar when clicking nav items on mobile
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    });
});

document.getElementById('addProjectBtn').addEventListener('click', openAddProjectModal);
document.getElementById('closeModal').addEventListener('click', closeProjectModal);
document.getElementById('cancelBtn').addEventListener('click', closeProjectModal);
document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

projectModal.addEventListener('click', (e) => { if (e.target === projectModal) closeProjectModal(); });
deleteModal.addEventListener('click', (e) => { if (e.target === deleteModal) closeDeleteModal(); });

document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../index.html';
    }
});

// Initialize Dashboard
// ============================================

function updateConnectionStatus(message, type = 'info') {
    const statusDiv = document.getElementById('connectionStatus');
    if (!statusDiv) return;
    
    statusDiv.style.display = 'block';
    statusDiv.textContent = message;
    
    if (type === 'success') {
        statusDiv.style.background = '#d1fae5';
        statusDiv.style.color = '#065f46';
    } else if (type === 'danger') {
        statusDiv.style.background = '#fee2e2';
        statusDiv.style.color = '#991b1b';
    } else {
        statusDiv.style.background = '#dbeafe';
        statusDiv.style.color = '#1e40af';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateConnectionStatus('Connecting to Firebase...');
    
    // Check if firebase is loaded
    if (typeof firebase === 'undefined') {
        updateConnectionStatus('❌ Firebase SDK not found. Check your internet or config.', 'danger');
        return;
    }

    try {
        const database = firebase.database();
        const projectsRef = database.ref(PROJECTS_PATH);

        loadProjects((projects) => {
            allProjects = projects;
            renderProjectsTable(projects);
            updateStats(projects);
            updateConnectionStatus('✅ Connected to Firebase', 'success');
            // Hide status after 3 seconds if successful
            setTimeout(() => { statusDiv.style.display = 'none'; }, 3000);
        });
    } catch (e) {
        updateConnectionStatus(`❌ Initialization Error: ${e.message}`, 'danger');
    }
});
