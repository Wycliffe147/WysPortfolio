// Projects Dashboard JavaScript
// Handles CRUD operations for portfolio projects using Firebase

// ============================================
// Firebase & Storage Management
// ============================================

const database = firebase.database();
const PROJECTS_PATH = 'projects';

// ============================================
// Image Processing (Base64 + Compression)
// ============================================

async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const progressContainer = document.getElementById('uploadProgressContainer');
    const progressBar = document.getElementById('uploadProgressBar');
    const uploadStatus = document.getElementById('uploadStatus');

    progressContainer.style.display = 'block';
    uploadStatus.textContent = 'Processing image...';
    progressBar.style.width = '50%';

    try {
        const compressedBase64 = await compressImage(file);
        document.getElementById('projectImage').value = compressedBase64;
        
        progressBar.style.width = '100%';
        uploadStatus.textContent = '✅ Image Optimized!';
        showNotification('Image processed and optimized!', 'success');
        
        setTimeout(() => { progressContainer.style.display = 'none'; }, 2000);
    } catch (error) {
        console.error('Processing failed:', error);
        showNotification('Failed to process image', 'danger');
        progressContainer.style.display = 'none';
    }
}

function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with 0.6 quality (60%)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

function resetUploadUI() {
    const progressContainer = document.getElementById('uploadProgressContainer');
    const progressBar = document.getElementById('uploadProgressBar');
    if (progressContainer) progressContainer.style.display = 'none';
    if (progressBar) progressBar.style.width = '0%';
}

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
function testLink(button) {
    const urlInput = button.closest('.input-with-action').querySelector('input');
    const url = urlInput.value.trim();
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

// Dynamic Link Row Management
const linksContainer = document.getElementById('linksContainer');

function createLinkRow(label = '', url = '') {
    const row = document.createElement('div');
    row.className = 'link-row';
    row.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Link Label</label>
                <input type="text" class="link-label" placeholder="e.g., Live Site" value="${label}">
            </div>
            <div class="form-group">
                <label>Link URL</label>
                <div class="input-with-action">
                    <input type="text" class="link-url" placeholder="https://..." value="${url}">
                    <button type="button" class="btn-test" onclick="testLink(this)">Test</button>
                    <button type="button" class="btn-danger btn-remove" onclick="removeLinkRow(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <span class="validation-hint">Please enter a valid URL (including https://)</span>
            </div>
        </div>
    `;
    
    // Add real-time validation to the new URL input
    const urlInput = row.querySelector('.link-url');
    urlInput.addEventListener('input', () => {
        if (isValidUrl(urlInput.value.trim())) {
            urlInput.classList.remove('is-invalid');
        } else {
            urlInput.classList.add('is-invalid');
        }
    });

    return row;
}

function addLinkRow(label = '', url = '') {
    linksContainer.appendChild(createLinkRow(label, url));
}

function removeLinkRow(button) {
    const row = button.closest('.link-row');
    row.remove();
}

function clearLinkRows() {
    linksContainer.innerHTML = '';
}

function clearValidationStates() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
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
    clearValidationStates();
    clearLinkRows();
    resetUploadUI();
    // Start with two default rows for new projects
    addLinkRow('Live Demo', '');
    addLinkRow('GitHub', '');
    projectModal.classList.add('active');
}

// Open edit project modal
function editProject(key) {
    currentEditKey = key;
    const project = allProjects.find(p => p.firebaseKey === key);
    if (!project) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Project';
    resetTabs();
    clearValidationStates();
    clearLinkRows();
    resetUploadUI();
    
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
    
    // Handle dynamic links with backward compatibility
    if (Array.isArray(project.links)) {
        project.links.forEach(link => addLinkRow(link.label, link.url));
    } else if (project.links) {
        // Migration logic for old object format
        if (project.links.live && project.links.live !== '#') addLinkRow('Live Demo', project.links.live);
        if (project.links.github && project.links.github !== '#') addLinkRow('GitHub', project.links.github);
    }
    
    // Ensure at least one row if empty
    if (linksContainer.children.length === 0) addLinkRow();
    
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
    
    const linkRows = document.querySelectorAll('.link-row');
    const links = [];
    let hasInvalidUrl = false;

    linkRows.forEach(row => {
        const label = row.querySelector('.link-label').value.trim();
        const url = row.querySelector('.link-url').value.trim();
        
        if (url) {
            if (!isValidUrl(url)) {
                row.querySelector('.link-url').classList.add('is-invalid');
                hasInvalidUrl = true;
            }
            links.push({ label: label || 'Link', url: url });
        }
    });

    if (hasInvalidUrl) {
        showNotification('Please correct the invalid URLs', 'danger');
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
        links: links
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
document.getElementById('addLinkBtn').addEventListener('click', () => addLinkRow());
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
    
    // Setup Image Upload listener
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) imageUpload.addEventListener('change', handleImageUpload);
    
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
            setTimeout(() => { 
                const statusDiv = document.getElementById('connectionStatus');
                if (statusDiv) statusDiv.style.display = 'none'; 
            }, 3000);
        });
    } catch (e) {
        updateConnectionStatus(`❌ Initialization Error: ${e.message}`, 'danger');
    }
});
