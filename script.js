// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeThemeToggle();
    initializeTypingAnimation();
    initializeScrollAnimations();
    initializeSkillBars();
    initializeProjectFilters();
    initializeContactForm();
    initializeStatsAnimation();
    initializeSmoothScrolling();
    initializePWA();
});

// PWA functionality
function initializePWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('ServiceWorker registration successful: ', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content is available
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }

    // Handle install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });

    // Handle app installed
    window.addEventListener('appinstalled', (evt) => {
        console.log('App installed');
        hideInstallButton();
    });

    // Check if app is running standalone
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        document.body.classList.add('pwa-standalone');
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <span>New version available!</span>
            <button onclick="location.reload()" class="btn btn-primary btn-sm">Update</button>
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn-secondary btn-sm">Later</button>
        </div>
    `;
    document.body.appendChild(notification);
}

// function showInstallButton() {
//     const installButton = document.createElement('div');
//     installButton.id = 'install-button';
//     installButton.className = 'install-prompt';
//     installButton.innerHTML = `
//         <div class="install-content">
//             <span>Install this app for a better experience!</span>
//             <button id="install-btn" class="btn btn-primary btn-sm">Install</button>
//             <button onclick="this.parentElement.parentElement.remove()" class="btn btn-secondary btn-sm">×</button>
//         </div>
//     `;
    
//     document.body.appendChild(installButton);
    
//     document.getElementById('install-btn').addEventListener('click', () => {
//         if (deferredPrompt) {
//             deferredPrompt.prompt();
//             deferredPrompt.userChoice.then((choiceResult) => {
//                 if (choiceResult.outcome === 'accepted') {
//                     console.log('User accepted the install prompt');
//                 }
//                 deferredPrompt = null;
//                 hideInstallButton();
//             });
//         }
//     });
// }

// function hideInstallButton() {
//     const installButton = document.getElementById('install-button');
//     if (installButton) {
//         installButton.remove();
//     }
// }

// Network status monitoring
function initializeNetworkMonitoring() {
    let offlineIndicator = null;
    
    function showOfflineIndicator() {
        if (!offlineIndicator) {
            offlineIndicator = document.createElement('div');
            offlineIndicator.className = 'offline-indicator';
            offlineIndicator.textContent = 'You are offline';
            document.body.appendChild(offlineIndicator);
        }
    }
    
    function hideOfflineIndicator() {
        if (offlineIndicator) {
            offlineIndicator.remove();
            offlineIndicator = null;
        }
    }
    
    window.addEventListener('online', () => {
        hideOfflineIndicator();
        
        // Try to sync offline form data
        const pendingForm = localStorage.getItem('pendingContactForm');
        if (pendingForm) {
            console.log('Back online - syncing form data');
            // In a real app, you'd submit the form here
        }
    });
    
    window.addEventListener('offline', showOfflineIndicator);
    
    // Initial check
    if (!navigator.onLine) {
        showOfflineIndicator();
    }
}

// Initialize network monitoring
document.addEventListener('DOMContentLoaded', function() {
    initializeNetworkMonitoring();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    function toggleMenu() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    }
    
    // Add both click and keyboard support
    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });
    
    // Touch gesture support for mobile menu
    let startY = 0;
    let currentY = 0;
    
    navMenu.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    navMenu.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const diffY = startY - currentY;
        
        // If swiping up significantly, close menu
        if (diffY > 50 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    }, { passive: true });

    // Highlight active navigation link
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Update navbar background on scroll
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
            ? 'rgba(15, 23, 42, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
    }
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
        
        // Add a subtle animation
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

function updateThemeIcon(theme, icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Typing animation for hero section
function initializeTypingAnimation() {
    const typedText = document.getElementById('typed-text');
    const textArray = [
        'Software Developer Student',
        'Problem Solver',
        'Tech Enthusiast',
        'Creative Coder',
        'Lifelong Learner'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeText() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typedText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(typeText, typeSpeed);
    }

    typeText();
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('.about-content, .skills-category, .project-card, .profiles .tech-icon, .contact-content');
    animatedElements.forEach(el => observer.observe(el));
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 500);
                
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
}

// Project filtering
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects with animation
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease-in';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea');

    // Add floating label behavior
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });

        // Check if input has value on load
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });

    // Form submission with offline support
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const formStatus = document.getElementById('form-status');
        const originalText = submitBtn.innerHTML;
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Check if online
        if (navigator.onLine) {
            // Simulate form submission (replace with actual submission)
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully!';
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    formStatus.style.display = 'none';
                    
                    // Remove focused class from form groups
                    inputs.forEach(input => {
                        input.parentElement.classList.remove('focused');
                    });
                }, 2000);
            }, 1500);
        } else {
            // Store for offline submission
            localStorage.setItem('pendingContactForm', JSON.stringify(formData));
            
            // Request background sync if available
            if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                navigator.serviceWorker.ready.then((registration) => {
                    return registration.sync.register('contact-form-sync');
                });
            }
            
            submitBtn.innerHTML = '<span>Saved Offline</span><i class="fas fa-wifi"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            
            formStatus.className = 'form-status success';
            formStatus.textContent = 'Message saved offline. Will send when connection is restored.';
            
            // Reset form
            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                formStatus.style.display = 'none';
                
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
            }, 3000);
        }
    });

    // Real-time validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        const email = this.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
}

// Stats counter animation
function initializeStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 40);
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll indicator in hero section
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for better scroll performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Improved scroll performance with throttling
window.addEventListener('scroll', throttle(updateActiveNavLink, 50), { passive: true });

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('fade-in');
    
    // Trigger skill bar animations if skills section is in view
    const skillsSection = document.getElementById('skills');
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }
});

// Add hover effects for project cards
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Optimized parallax effect with performance checks
const heroImage = document.querySelector('.hero-image');
let ticking = false;

function updateParallax() {
    if (heroImage && window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        const speed = scrolled * 0.3; // Reduced intensity for better performance
        heroImage.style.transform = `translate3d(0, ${speed}px, 0)`; // Use translate3d for hardware acceleration
    }
    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

// Only add parallax on larger screens and when user hasn't requested reduced motion
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth > 768) {
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

// Optimized particle system with performance controls
let particlesEnabled = window.innerWidth > 768; // Disable on mobile
let particleCount = 0;
const maxParticles = 5;

function createParticle() {
    // Performance check - limit particles and disable on low-end devices
    if (!particlesEnabled || particleCount >= maxParticles || document.hidden) return;
    
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDelay = Math.random() * 6 + 's';
    
    document.body.appendChild(particle);
    particleCount++;
    
    // Use animation events instead of setTimeout for better performance
    particle.addEventListener('animationend', () => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        particleCount--;
    }, { once: true });
}

// Reduce particle creation frequency for better performance
let particleInterval;
if (particlesEnabled) {
    particleInterval = setInterval(createParticle, 5000);
}

// Pause particles when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(particleInterval);
    } else if (particlesEnabled) {
        particleInterval = setInterval(createParticle, 5000);
    }
});

// Add optimized CSS for floating particles
const style = document.createElement('style');
style.textContent = `
    .floating-particle {
        position: fixed;
        width: 3px;
        height: 3px;
        background: rgba(99, 102, 241, 0.2);
        border-radius: 50%;
        pointer-events: none;
        animation: float 8s linear infinite;
        z-index: -1;
        will-change: transform, opacity;
        top: 100vh;
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.8;
        }
        90% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh) rotate(180deg);
            opacity: 0;
        }
    }
    
    /* Reduce motion for users who prefer it */
    @media (prefers-reduced-motion: reduce) {
        .floating-particle {
            animation: none;
            display: none;
        }
    }
`;
document.head.appendChild(style);