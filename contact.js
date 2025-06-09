// Google Sign-In Configuration
let currentUser = null;
let isGoogleApiLoaded = false;
let isFirebaseLoaded = false;

// Check Firebase availability
function checkFirebaseAvailability() {
    if (typeof firebase !== 'undefined' && firebase.database) {
        isFirebaseLoaded = true;
        console.log('Firebase loaded successfully');
        return true;
    } else {
        console.error('Firebase not loaded properly');
        return false;
    }
}

// Cookie management functions
function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
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
                console.error('Error parsing cookie:', e);
                return null;
            }
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Function to show error messages
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
    console.error('Google Sign-In Error:', message);
}

// Function to hide error messages
function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

// Show loading state
function showLoadingState() {
    const loadingState = document.getElementById('signinLoadingState');
    const signinButton = document.getElementById('g_id_signin');
    if (loadingState) loadingState.classList.remove('hidden');
    if (signinButton) signinButton.classList.add('hidden');
}

// Hide loading state and show button
function showSigninButton() {
    const loadingState = document.getElementById('signinLoadingState');
    const signinButton = document.getElementById('g_id_signin');
    if (loadingState) loadingState.classList.add('hidden');
    if (signinButton) signinButton.classList.remove('hidden');
}

// Initialize Google Sign-In when API loads
function initializeGoogleSignIn() {
    console.log('Initializing Google Sign-In...');
    
    try {
        if (typeof google === 'undefined' || !google.accounts) {
            throw new Error('Google Sign-In API not loaded');
        }
        
        // Initialize Google Sign-In
        google.accounts.id.initialize({
            client_id: '650247727271-mcufppu5e4u1ksdt8758lstfvnj9ki3i.apps.googleusercontent.com',
            callback: handleSignInResponse,
            auto_select: false,
            cancel_on_tap_outside: false,
            use_fedcm_for_prompt: false
        });
        
        // Render the proper Google Sign-In button
        const signinContainer = document.getElementById('g_id_signin');
        if (signinContainer) {
            google.accounts.id.renderButton(
                signinContainer,
                {
                    theme: 'outline',
                    size: 'large',
                    type: 'standard',
                    text: 'signin_with',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                    width: 280
                }
            );
        }
        
        isGoogleApiLoaded = true;
        showSigninButton();
        console.log('Google Sign-In initialized successfully');
        hideError();
        
    } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error);
        showError('Failed to load Google Sign-In. Please refresh the page and try again.');
        const loadingState = document.getElementById('signinLoadingState');
        if (loadingState) loadingState.classList.add('hidden');
    }
}

// Handle Google Sign-In response
function handleSignInResponse(response) {
    console.log('Sign-in response received');
    hideError();
    
    try {
        if (!response.credential) {
            throw new Error('No credential received from Google');
        }
        
        // Decode the JWT token to get user info
        const userInfo = parseJwt(response.credential);
        console.log('User info decoded:', userInfo);
        
        currentUser = {
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            token: response.credential,
            signInTime: Date.now()
        };
        
        // Store auth info persistently
        storeUserSession(currentUser);
        
        // Store in Firebase with better error handling
        storeUserInFirebase(currentUser).then(() => {
            console.log('User stored in Firebase successfully');
        }).catch(error => {
            console.error('Failed to store user in Firebase:', error);
            // Don't prevent sign-in if Firebase fails, just log the error
        });
        
        // Show authenticated state
        showAuthenticatedView();
        
        console.log('User authenticated successfully');
        
    } catch (error) {
        console.error('Error handling sign-in:', error);
        showError('Authentication failed. Please try again.');
    }
}

// Parse JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        throw new Error('Invalid token format');
    }
}

// Check if session is still valid (within 7 days)
function isSessionValid(sessionData) {
    if (!sessionData || !sessionData.signInTime) {
        return false;
    }
    
    const sessionAge = Date.now() - sessionData.signInTime;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    return sessionAge < maxAge;
}

// Store user session persistently
function storeUserSession(user) {
    try {
        // Store in cookie for persistence across sessions
        setCookie('userSession', user, 7);
        
        // Also store in memory for immediate access
        window.tempUserSession = user;
        
        console.log('User session stored successfully');
    } catch (error) {
        console.error('Error storing session:', error);
        window.tempUserSession = user;
    }
}

// Store user in Firebase with improved error handling
function storeUserInFirebase(user) {
    return new Promise((resolve, reject) => {
        try {
            if (!checkFirebaseAvailability()) {
                throw new Error('Firebase not available');
            }
            
            const userId = btoa(user.email).replace(/=/g, ''); // Base64 encode email as ID
            const userRef = firebase.database().ref('activeUsers/' + userId);
            
            const userData = {
                name: user.name,
                email: user.email,
                picture: user.picture,
                signInTime: user.signInTime
            };
            
            console.log('Attempting to store user in Firebase:', userData);
            
            userRef.set(userData)
                .then(() => {
                    console.log('User successfully stored in Firebase');
                    resolve();
                })
                .catch((error) => {
                    console.error('Firebase set operation failed:', error);
                    reject(error);
                });
                
        } catch (error) {
            console.error('Error in storeUserInFirebase:', error);
            reject(error);
        }
    });
}

// Clear user session
function clearUserSession() {
    try {
        deleteCookie('userSession');
        window.tempUserSession = null;
        
        // Remove from Firebase
        if (currentUser && checkFirebaseAvailability()) {
            const userId = btoa(currentUser.email).replace(/=/g, '');
            firebase.database().ref('activeUsers/' + userId).remove().then(() => {
                console.log('User removed from Firebase');
            }).catch(error => {
                console.error('Error removing user from Firebase:', error);
            });
        }
        
        console.log('User session cleared');
    } catch (error) {
        console.error('Error clearing session:', error);
        window.tempUserSession = null;
    }
}

// Check for existing authentication
function checkExistingAuth() {
    console.log('Checking for existing authentication...');
    
    try {
        // First check memory
        if (window.tempUserSession && isSessionValid(window.tempUserSession)) {
            currentUser = window.tempUserSession;
            storeUserInFirebase(currentUser).catch(e => console.error('Firebase store error:', e));
            showAuthenticatedView();
            console.log('Found valid session in memory');
            return;
        }
        
        // Then check cookie
        const cookieSession = getCookie('userSession');
        if (cookieSession && isSessionValid(cookieSession)) {
            currentUser = cookieSession;
            window.tempUserSession = cookieSession;
            storeUserInFirebase(currentUser).catch(e => console.error('Firebase store error:', e));
            showAuthenticatedView();
            console.log('Found valid session in cookie');
            return;
        }
        
        console.log('No valid existing authentication found');
        clearUserSession();
        
    } catch (error) {
        console.error('Error checking existing auth:', error);
        clearUserSession();
    }
}

// Show authenticated view
function showAuthenticatedView() {
    const authSection = document.getElementById('authSection');
    const contactFormSection = document.getElementById('contactFormSection');
    
    if (authSection) authSection.classList.add('hidden');
    if (contactFormSection) contactFormSection.classList.remove('hidden');
    
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    
    if (userAvatar) userAvatar.src = currentUser.picture || '';
    if (userName) userName.textContent = currentUser.name || '';
    if (userEmail) userEmail.textContent = currentUser.email || '';
    
    const senderName = document.getElementById('senderName');
    const senderEmail = document.getElementById('senderEmail');
    const authToken = document.getElementById('authToken');
    
    if (senderName) senderName.value = currentUser.name || '';
    if (senderEmail) senderEmail.value = currentUser.email || '';
    if (authToken) authToken.value = currentUser.token || '';
    
    console.log('Authenticated view displayed for:', currentUser.name);
}

// Show unauthenticated view
function showUnauthenticatedView() {
    const authSection = document.getElementById('authSection');
    const contactFormSection = document.getElementById('contactFormSection');
    
    if (authSection) authSection.classList.remove('hidden');
    if (contactFormSection) contactFormSection.classList.add('hidden');
    
    console.log('Unauthenticated view displayed');
}

// Initialize logout functionality
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            console.log('Logging out...');
            
            clearUserSession();
            currentUser = null;
            
            showUnauthenticatedView();
            
            const form = document.getElementById('contactForm');
            if (form) form.reset();
            
            if (isGoogleApiLoaded && google.accounts) {
                google.accounts.id.disableAutoSelect();
            }
            
            console.log('Logged out successfully');
        });
    }
}

// Form submission handling
function initializeForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form || !submitBtn) return;
    
    const originalBtnText = submitBtn.textContent;
    
    form.addEventListener('submit', function(e) {
        if (!currentUser || !isSessionValid(currentUser)) {
            e.preventDefault();
            alert('Your session has expired. Please sign in again to send your message.');
            clearUserSession();
            showUnauthenticatedView();
            return;
        }
        
        submitBtn.textContent = 'Sending Secure Message...';
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent Securely!';
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            
            setTimeout(() => {
                const subject = document.getElementById('subject');
                const message = document.getElementById('message');
                
                if (subject) subject.value = '';
                if (message) message.value = '';
                
                submitBtn.textContent = originalBtnText;
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
            }, 2000);
        }, 1000);
    });
    
    form.addEventListener('invalid', function(e) {
        e.preventDefault();
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.style.borderColor = '#e74c3c';
            firstInvalid.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        }
    }, true);
}

// Enhanced form interactions
function initializeFormInteractions() {
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.parentElement) {
                this.parentElement.style.transform = 'translateY(-2px)';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.parentElement) {
                this.parentElement.style.transform = 'translateY(0)';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '#27ae60';
            } else if (this.value.length > 0) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#e1e8ed';
            }
            
            if (this.style.borderColor === 'rgb(231, 76, 60)') {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    });
}

// Smooth scroll for back button
function initializeBackButton() {
    const backButton = document.querySelector('.back-to-home');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '0.8';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
                document.body.style.transition = '';
            }, 200);
        });
    }
}

// Add intersection observer
function initializeScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        const cards = document.querySelectorAll('.contact-info-card, .contact-form-card, .auth-section');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const backButton = document.querySelector('.back-to-home');
            if (backButton) backButton.focus();
        }
        
        if (e.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('social-link')) {
                focusedElement.style.transform = 'translateY(-3px) scale(1.05)';
                setTimeout(() => {
                    if (document.activeElement !== focusedElement) {
                        focusedElement.style.transform = '';
                    }
                }, 200);
            }
        }
    });
}

// Session validation check
function initializeSessionValidation() {
    setInterval(() => {
        if (currentUser && !isSessionValid(currentUser)) {
            console.log('Session expired, logging out user');
            clearUserSession();
            currentUser = null;
            showUnauthenticatedView();
            showError('Your session has expired. Please sign in again.');
        }
    }, 5 * 60 * 1000);
}

// Fallback initialization
let initAttempts = 0;
const maxAttempts = 5;

function attemptInitialization() {
    if (!isGoogleApiLoaded && initAttempts < maxAttempts) {
        initAttempts++;
        console.log(`Attempting Google Sign-In initialization (attempt ${initAttempts}/${maxAttempts})...`);
        
        if (typeof google !== 'undefined' && google.accounts) {
            initializeGoogleSignIn();
        } else {
            setTimeout(attemptInitialization, 2000);
        }
    } else if (initAttempts >= maxAttempts && !isGoogleApiLoaded) {
        console.error('Failed to initialize Google Sign-In after maximum attempts');
        showError('Failed to load Google Sign-In. Please refresh the page and try again.');
        const loadingState = document.getElementById('signinLoadingState');
        if (loadingState) loadingState.classList.add('hidden');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing contact page...');
    
    showLoadingState();
    
    // Wait for Firebase to load before checking auth
    setTimeout(() => {
        checkFirebaseAvailability();
        checkExistingAuth();
    }, 500);
    
    initializeLogout();
    initializeForm();
    initializeFormInteractions();
    initializeBackButton();
    initializeScrollAnimations();
    initializeKeyboardNavigation();
    initializeSessionValidation();
});

window.addEventListener('load', function() {
    console.log('Window loaded, initializing Google Sign-In...');
    
    setTimeout(() => {
        initializeGoogleSignIn();
    }, 1000);
    
    setTimeout(attemptInitialization, 2000);
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden && currentUser) {
        if (!isSessionValid(currentUser)) {
            console.log('Session expired while page was hidden');
            clearUserSession();
            currentUser = null;
            showUnauthenticatedView();
            showError('Your session has expired. Please sign in again.');
        }
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeGoogleSignIn,
        handleSignInResponse,
        parseJwt,
        showAuthenticatedView,
        checkExistingAuth,
        storeUserSession,
        clearUserSession,
        isSessionValid,
        storeUserInFirebase
    };
}