// DOM Elements
const userTableBody = document.getElementById('userTableBody');
const userCards = document.getElementById('userCards');
const noUsersMessage = document.getElementById('noUsersMessage');
const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// State Variables
let users = [];
let sortField = 'signInTime';
let sortDirection = -1;
let isAuthenticated = false;

// Message Functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function hideMessages() {
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
}

// Authentication Functions
async function authenticatePassword(password) {
    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Checking...';
        
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            isAuthenticated = true;
            showSuccess('Authentication successful! Loading dashboard...');
            setTimeout(() => {
                showDashboard();
                loadUsers();
            }, 1000);
        } else {
            showError(data.error || 'Invalid password');
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        console.error('Auth error:', error);
        showError('Authentication failed. Please try again.');
        passwordInput.value = '';
        passwordInput.focus();
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Access Dashboard';
    }
}

// View Functions
function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function showLogin() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    isAuthenticated = false;
    passwordInput.value = '';
    hideMessages();
}

// Firebase Functions
function loadUsers() {
    if (!isAuthenticated) return;
    
    console.log('Loading users from Firebase...');
    const usersRef = firebase.database().ref('activeUsers');
    
    usersRef.on('value', (snapshot) => {
        users = [];
        
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (isSessionValid(user)) {
                users.push({
                    id: childSnapshot.key,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    signInTime: user.signInTime
                });
            } else {
                // Remove expired sessions
                childSnapshot.ref.remove();
            }
        });
        
        renderUsers();
    }, (error) => {
        console.error('Firebase error:', error);
        showError('Failed to load user data: ' + error.message);
    });
}

function isSessionValid(user) {
    if (!user || !user.signInTime) return false;
    const sessionAge = Date.now() - user.signInTime;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    return sessionAge < maxAge;
}

// Render Functions
function renderUsers() {
    userTableBody.innerHTML = '';
    userCards.innerHTML = '';
    
    if (users.length === 0) {
        noUsersMessage.style.display = 'block';
        return;
    }
    noUsersMessage.style.display = 'none';
    
    users.sort((a, b) => {
        if (sortField === 'signInTime') {
            return (a[sortField] - b[sortField]) * sortDirection;
        }
        return a[sortField].localeCompare(b[sortField]) * sortDirection;
    });
    
    users.forEach(user => {
        // Table row for desktop
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td><img src="${user.picture || ''}" alt="Profile" class="user-avatar" onerror="this.src='https://via.placeholder.com/40'"></td>
            <td>${new Date(user.signInTime).toLocaleString()}</td>
        `;
        userTableBody.appendChild(row);

        // Card for mobile
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="user-card-header">
                <img src="${user.picture || ''}" alt="Profile" class="user-card-avatar" onerror="this.src='https://via.placeholder.com/50'">
                <div class="user-card-info">
                    <div class="user-card-name">${user.name || 'N/A'}</div>
                    <div class="user-card-email">${user.email || 'N/A'}</div>
                </div>
            </div>
            <div class="user-card-time">Signed in: ${new Date(user.signInTime).toLocaleString()}</div>
        `;
        userCards.appendChild(card);
    });
}

// Event Listeners
passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value.trim();
    if (password) {
        hideMessages();
        authenticatePassword(password);
    }
});

logoutBtn.addEventListener('click', () => {
    showLogin();
});

// Handle sorting
document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const newSortField = btn.dataset.sort;
        if (newSortField === sortField) {
            sortDirection *= -1;
        } else {
            sortField = newSortField;
            sortDirection = 1;
        }
        btn.querySelector('i').className = `fas fa-sort-${sortDirection === 1 ? 'up' : 'down'}`;
        document.querySelectorAll('.sort-btn').forEach(b => {
            if (b !== btn) b.querySelector('i').className = 'fas fa-sort';
        });
        renderUsers();
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    passwordInput.focus();
});