// ===================================
// MOBILE MENU TOGGLE
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Mobile dropdown toggle
const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (window.innerWidth <= 968) {
            e.preventDefault();
            item.classList.toggle('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ===================================
// STICKY HEADER
// ===================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// INDUSTRIES SLIDER
// ===================================
const sliderTrack = document.getElementById('industriesTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');

if (sliderTrack && sliderPrev && sliderNext) {
    let currentPosition = 0;
    const slideWidth = 320; // 300px + 20px gap
    
    sliderNext.addEventListener('click', () => {
        const maxScroll = sliderTrack.scrollWidth - sliderTrack.parentElement.offsetWidth;
        if (currentPosition > -maxScroll) {
            currentPosition -= slideWidth;
            if (currentPosition < -maxScroll) {
                currentPosition = -maxScroll;
            }
            sliderTrack.style.transform = `translateX(${currentPosition}px)`;
        }
    });
    
    sliderPrev.addEventListener('click', () => {
        if (currentPosition < 0) {
            currentPosition += slideWidth;
            if (currentPosition > 0) {
                currentPosition = 0;
            }
            sliderTrack.style.transform = `translateX(${currentPosition}px)`;
        }
    });
    
    // Auto-slide (optional)
    let autoSlide = setInterval(() => {
        const maxScroll = sliderTrack.scrollWidth - sliderTrack.parentElement.offsetWidth;
        if (currentPosition > -maxScroll) {
            currentPosition -= slideWidth;
            if (currentPosition < -maxScroll) {
                currentPosition = -maxScroll;
            }
        } else {
            currentPosition = 0;
        }
        sliderTrack.style.transform = `translateX(${currentPosition}px)`;
    }, 4000);
    
    // Pause auto-slide on hover
    sliderTrack.parentElement.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });
    
    sliderTrack.parentElement.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            const maxScroll = sliderTrack.scrollWidth - sliderTrack.parentElement.offsetWidth;
            if (currentPosition > -maxScroll) {
                currentPosition -= slideWidth;
                if (currentPosition < -maxScroll) {
                    currentPosition = -maxScroll;
                }
            } else {
                currentPosition = 0;
            }
            sliderTrack.style.transform = `translateX(${currentPosition}px)`;
        }, 4000);
    });
}

// ===================================
// FAQ ACCORDION
// ===================================
const faqQuestions = document.querySelectorAll('.faq-item__question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===================================
// FORM VALIDATION
// ===================================
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const formGroups = form.querySelectorAll('.form__group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('.form__input, .form__textarea, .form__select');
            const errorElement = group.querySelector('.form__error');
            
            if (input) {
                // Remove previous error state
                group.classList.remove('error');
                
                // Check if required field is empty
                if (input.hasAttribute('required') && !input.value.trim()) {
                    group.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'This field is required';
                    }
                    isValid = false;
                }
                
                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        group.classList.add('error');
                        if (errorElement) {
                            errorElement.textContent = 'Please enter a valid email address';
                        }
                        isValid = false;
                    }
                }
                
                // Phone validation
                if (input.type === 'tel' && input.value.trim()) {
                    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                    if (!phoneRegex.test(input.value.trim()) || input.value.trim().length < 10) {
                        group.classList.add('error');
                        if (errorElement) {
                            errorElement.textContent = 'Please enter a valid phone number';
                        }
                        isValid = false;
                    }
                }
            }
        });
        
        if (isValid) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #27ae60;
                color: white;
                padding: 1rem 2rem;
                border-radius: 6px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                animation: fadeInUp 0.5s ease;
            `;
            successMessage.textContent = 'Thank you! We will contact you shortly.';
            document.body.appendChild(successMessage);
            
            // Reset form
            form.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.style.animation = 'fadeOut 0.5s ease';
                setTimeout(() => {
                    successMessage.remove();
                }, 500);
            }, 5000);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('.form__input, .form__textarea, .form__select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            const group = input.closest('.form__group');
            const errorElement = group.querySelector('.form__error');
            
            group.classList.remove('error');
            
            if (input.hasAttribute('required') && !input.value.trim()) {
                group.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                }
            }
            
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    group.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                    }
                }
            }
            
            if (input.type === 'tel' && input.value.trim()) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(input.value.trim()) || input.value.trim().length < 10) {
                    group.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid phone number';
                    }
                }
            }
        });
        
        input.addEventListener('input', () => {
            const group = input.closest('.form__group');
            if (input.value.trim()) {
                group.classList.remove('error');
            }
        });
    });
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        }
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.stats__item, .benefit-card, .industry-slide, .feature-item, .process-step, .pricing-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// PRICING TOGGLE (if needed for monthly/yearly)
// ===================================
const pricingToggle = document.getElementById('pricingToggle');
if (pricingToggle) {
    pricingToggle.addEventListener('change', (e) => {
        const isYearly = e.target.checked;
        const prices = document.querySelectorAll('.pricing-card__price');
        
        prices.forEach(price => {
            const monthlyPrice = price.dataset.monthly;
            const yearlyPrice = price.dataset.yearly;
            
            if (isYearly && yearlyPrice) {
                price.textContent = yearlyPrice;
            } else if (monthlyPrice) {
                price.textContent = monthlyPrice;
            }
        });
    });
}

// ===================================
// LOADING ANIMATION
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
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

// Throttle function for scroll events
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
    };
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

console.log('ThePrime website loaded successfully!');
