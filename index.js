// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Scroll navigation functionality
function setupScrollNavigation(containerId, prevBtnId, nextBtnId) {
    const container = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    
    if (!container || !prevBtn || !nextBtn) return;
    
    const cardWidth = 350; // Width of project cards + gap
    const tutorialCardWidth = 300; // Width of tutorial cards + gap
    const scrollAmount = containerId.includes('projects') ? cardWidth + 30 : tutorialCardWidth + 30;
    
    prevBtn.addEventListener('click', () => {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Update button visibility based on scroll position
    function updateButtonVisibility() {
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        prevBtn.style.opacity = scrollLeft > 0 ? '1' : '0.5';
        nextBtn.style.opacity = scrollLeft < maxScroll - 1 ? '1' : '0.5';
        
        prevBtn.disabled = scrollLeft <= 0;
        nextBtn.disabled = scrollLeft >= maxScroll - 1;
    }
    
    container.addEventListener('scroll', updateButtonVisibility);
    window.addEventListener('resize', updateButtonVisibility);
    updateButtonVisibility(); // Initial check
}

// Initialize scroll navigation for both sections
setupScrollNavigation('projectsContainer', 'projectsPrev', 'projectsNext');
setupScrollNavigation('tutorialsContainer', 'tutorialsPrev', 'tutorialsNext');

// Search functionality
const searchInput = document.getElementById('searchInput');
const stickySearchInput = document.getElementById('stickySearchInput');
const searchResults = document.getElementById('searchResults');
const stickySearchResults = document.getElementById('stickySearchResults');

// All project and tutorial cards
const allCards = [
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.tutorial-card')
];

// Highlight text function
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(searchTerm, 'gi');
    return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

// Search function
function performSearch(searchTerm, resultsContainer) {
    if (!searchTerm) {
        resultsContainer.style.display = 'none';
        return;
    }
    
    const results = [];
    allCards.forEach(card => {
        const searchData = card.getAttribute('data-search').toLowerCase();
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (searchData.includes(searchTerm) || 
            title.includes(searchTerm) || 
            description.includes(searchTerm)) {
            
            const type = card.classList.contains('project-card') ? 'Project' : 'Tutorial';
            const highlightedTitle = highlightText(card.querySelector('h3').textContent, searchTerm);
            const highlightedDesc = highlightText(card.querySelector('p').textContent, searchTerm);
            
            results.push({
                element: card,
                type,
                title: highlightedTitle,
                description: highlightedDesc
            });
        }
    });
    
    displayResults(results, searchTerm, resultsContainer);
}

// Display search results
function displayResults(results, searchTerm, resultsContainer) {
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `<div class="no-results">No results found for "${searchTerm}"</div>`;
    } else {
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result-item';
            resultElement.innerHTML = `
                <h4><span class="result-type">${result.type}</span>${result.title}</h4>
                <p>${result.description}</p>
            `;
            
            resultElement.addEventListener('click', () => {
                allCards.forEach(card => card.style.display = '');
                result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                result.element.style.boxShadow = '0 0 0 4px rgba(52, 152, 219, 0.7)';
                result.element.style.transform = 'scale(1.03)';
                result.element.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    result.element.style.boxShadow = '';
                    result.element.style.transform = '';
                }, 2500);
                
                resultsContainer.style.display = 'none';
                if (searchInput) searchInput.value = '';
                if (stickySearchInput) stickySearchInput.value = '';
                document.getElementById('stickySearchContainer').classList.remove('active');
            });
            
            resultsContainer.appendChild(resultElement);
        });
    }
    resultsContainer.style.display = 'block';
}

// Event listeners for search
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        performSearch(searchTerm, searchResults);
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            filterOnEnter(searchInput.value.trim().toLowerCase());
            searchResults.style.display = 'none';
        }
    });
}

if (stickySearchInput) {
    stickySearchInput.addEventListener('input', () => {
        const searchTerm = stickySearchInput.value.trim().toLowerCase();
        performSearch(searchTerm, stickySearchResults);
    });
    stickySearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            filterOnEnter(stickySearchInput.value.trim().toLowerCase());
            stickySearchResults.style.display = 'none';
            document.getElementById('stickySearchContainer').classList.remove('active');
        }
    });
}

function filterOnEnter(searchTerm) {
    if (!searchTerm) {
        allCards.forEach(card => card.style.display = '');
        return;
    }
    allCards.forEach(card => {
        const searchData = card.getAttribute('data-search').toLowerCase();
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (searchData.includes(searchTerm) || title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
    const firstVisible = document.querySelector('.project-card[style=""], .tutorial-card[style=""]');
    if (firstVisible) {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container') && !e.target.closest('.sticky-search-container')) {
        if (searchResults) searchResults.style.display = 'none';
        if (stickySearchResults) stickySearchResults.style.display = 'none';
    }
});

// --- Dynamic Header Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader');
    const heroSearchContainer = document.getElementById('heroSearchContainer');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');
    const stickySearchToggle = document.getElementById('stickySearchToggle');
    const stickySearchContainer = document.getElementById('stickySearchContainer');
    const closeStickySearch = document.getElementById('closeStickySearch');

    if (heroSearchContainer && mainHeader) {
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    mainHeader.classList.add('scrolled');
                } else {
                    mainHeader.classList.remove('scrolled');
                    if (mainNav) mainNav.classList.remove('mobile-active');
                    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
                }
            });
        }, {
            threshold: 0,
            rootMargin: "-80px 0px 0px 0px"
        });
        headerObserver.observe(heroSearchContainer);
    }

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mainNav.classList.toggle('mobile-active');
        });
    }

    if (stickySearchToggle && stickySearchContainer) {
        stickySearchToggle.addEventListener('click', () => {
            stickySearchContainer.classList.add('active');
            if (stickySearchInput) setTimeout(() => stickySearchInput.focus(), 100);
        });
    }

    if (closeStickySearch && stickySearchContainer) {
        closeStickySearch.addEventListener('click', () => {
            stickySearchContainer.classList.remove('active');
            if (stickySearchInput) stickySearchInput.value = '';
            if (stickySearchResults) stickySearchResults.style.display = 'none';
        });
    }

    document.querySelectorAll('#navLinks a').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav) mainNav.classList.remove('mobile-active');
            if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        });
    });

    // Authentication and Login Prompt Logic
    initializeContactLinkHandler();
    checkAuthOnLoad();

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Toggle icons
            if (isDark) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        });
    }
});

// Cookie management functions
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
                console.error('Error parsing cookie:', e);
                return null;
            }
        }
    }
    return null;
}

function isSessionValid(sessionData) {
    if (!sessionData || !sessionData.signInTime) return false;
    const sessionAge = Date.now() - sessionData.signInTime;
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    return sessionAge < maxAge;
}

function checkAuthStatus() {
    try {
        if (window.tempUserSession && isSessionValid(window.tempUserSession)) return true;
        const cookieSession = getCookie('userSession');
        if (cookieSession && isSessionValid(cookieSession)) {
            window.tempUserSession = cookieSession;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return false;
    }
}

function handleContactClick(event) {
    event.preventDefault();
    if (checkAuthStatus()) {
        window.location.href = 'contact.html';
    } else {
        window.location.href = 'login.html';
    }
}

function initializeContactLinkHandler() {
    const contactLinks = document.querySelectorAll('a[href="contact.html"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', handleContactClick);
    });
}

function showLoginPrompt() {
    if (document.getElementById('loginPromptOverlay')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'loginPromptOverlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.5); display: flex;
        justify-content: center; align-items: center; z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white; padding: 2rem; border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); text-align: center;
        max-width: 400px; width: 90%; animation: popupSlideIn 0.3s ease-out;
    `;
    
    if (!document.getElementById('popupAnimationStyles')) {
        const style = document.createElement('style');
        style.id = 'popupAnimationStyles';
        style.textContent = `
            @keyframes popupSlideIn { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        `;
        document.head.appendChild(style);
    }
    
    popup.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3498db, #2980b9); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10,17 15,12 10,7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
            </div>
            <h3 style="margin: 0 0 0.5rem 0; color: #2c3e50; font-size: 1.5rem;">Welcome to Wy's Portfolio!</h3>
            <p style="margin: 0; color: #7f8c8d; line-height: 1.5;">Sign in to access all features including the contact form and personalized experience.</p>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="loginNowBtn" style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Sign In</button>
            <button id="laterBtn" style="background: transparent; color: #7f8c8d; border: 2px solid #ecf0f1; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Later</button>
        </div>
    `;
    
    overlay.querySelector('#loginNowBtn').addEventListener('click', () => window.location.href = 'login.html');
    overlay.querySelector('#laterBtn').addEventListener('click', closeLoginPrompt);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLoginPrompt(); });
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function closeLoginPrompt() {
    const overlay = document.getElementById('loginPromptOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 200);
    }
}

function checkAuthOnLoad() {
    if (!checkAuthStatus()) {
        setTimeout(() => showLoginPrompt(), 1000);
    }
}
