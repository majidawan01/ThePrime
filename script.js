// ===================================
// UTILITY FUNCTIONS (Keeping these as you defined them)
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
// GLOBAL CONSTANTS
// ===================================
const MOBILE_BREAKPOINT = 992; // Consistent with the CSS media query in the previous response
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
const header = document.getElementById('header');
const sliderTrack = document.getElementById('industriesTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');


// ===================================
// MOBILE MENU & DROPDOWN LOGIC (Refined)
// ===================================

/**
 * Handles the click event for the mobile menu toggle (hamburger).
 */
function toggleMobileMenu() {
    if (navMenu) {
        // Use the CSS class names from the previous response: header__nav--active and is-active
        navMenu.classList.toggle('header__nav--active');
        mobileMenuToggle.classList.toggle('is-active');

        const isOpen = navMenu.classList.contains('header__nav--active');
        // Prevent body scrolling when menu is open on mobile
        document.body.style.overflow = isOpen ? 'hidden' : '';

        // Close all dropdowns when the main menu is closed
        if (!isOpen) {
            dropdownItems.forEach(item => item.classList.remove('dropdown-open'));
        }
    }
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

/**
 * Handles the click event for dropdowns in mobile view.
 */
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Use consistent breakpoint check (or match the CSS breakpoint)
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            e.preventDefault();
            
            // Close other open dropdowns in the mobile menu
            dropdownItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('dropdown-open');
                }
            });

            // Toggle the current dropdown's state
            item.classList.toggle('dropdown-open');
        }
        // Note: Desktop behavior is handled purely by CSS hover, so no else{} block is needed.
    });
});

/**
 * Closes mobile menu when clicking outside of the menu or toggle button.
 */
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('header__nav--active')) {
        // Check if the click target is NOT the menu, NOT the toggle button, and NOT a child of either
        const clickedInsideMenu = navMenu.contains(e.target);
        const clickedToggle = mobileMenuToggle.contains(e.target);
        
        if (!clickedInsideMenu && !clickedToggle) {
            // Use the function to centralize menu closing logic
            toggleMobileMenu();
        }
    }
});

// --- Window Resize Handler (New/Improved) ---
/**
 * Ensures mobile menu is closed when resizing back to desktop view.
 */
function handleResize() {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
        if (navMenu && navMenu.classList.contains('header__nav--active')) {
             // Use the function to centralize menu closing logic
             toggleMobileMenu(); 
        }
        // Ensure desktop dropdowns are closed if they were left open (active is used for mobile CSS, so this is fine)
        dropdownItems.forEach(item => item.classList.remove('dropdown-open'));
    }
}

// Apply debounce to the resize event listener for performance
window.addEventListener('resize', debounce(handleResize, 150));


// ===================================
// STICKY HEADER (Optimized with Throttle)
// ===================================

let lastScroll = 0;

function updateHeaderOnScroll() {
    const currentScroll = window.pageYOffset;
    
    if (header) {
        // Toggle shadow based on scroll position (keep as is)
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        // Optional: Hide/Show header on scroll down/up (if you want this feature)
        /*
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.classList.add('header--hidden');
        } else {
            // Scrolling up or near the top
            header.classList.remove('header--hidden');
        }
        */
    }
    
    lastScroll = currentScroll;
}

// Apply throttle to the scroll event for better performance
window.addEventListener('scroll', throttle(updateHeaderOnScroll, 100));


// ===================================
// INDUSTRIES SLIDER (Keeping original logic)
// ===================================
if (sliderTrack && sliderPrev && sliderNext) {
    let currentPosition = 0;
    const slideWidth = 320; // 300px + 20px gap

    const updateSlider = () => {
        sliderTrack.style.transform = `translateX(${currentPosition}px)`;
    };
    
    const calculateMaxScroll = () => {
        return sliderTrack.scrollWidth - sliderTrack.parentElement.offsetWidth;
    };

    sliderNext.addEventListener('click', () => {
        const maxScroll = calculateMaxScroll();
        if (currentPosition > -maxScroll) {
            currentPosition -= slideWidth;
            if (currentPosition < -maxScroll) {
                currentPosition = -maxScroll;
            }
            updateSlider();
        }
    });
    
    sliderPrev.addEventListener('click', () => {
        if (currentPosition < 0) {
            currentPosition += slideWidth;
            if (currentPosition > 0) {
                currentPosition = 0;
            }
            updateSlider();
        }
    });
    
    // Auto-slide 
    let autoSlide = setInterval(() => {
        const maxScroll = calculateMaxScroll();
        if (currentPosition <= -maxScroll) {
            // Reset to 0 if at the end
            currentPosition = 0;
        } else {
            // Move to next slide
            currentPosition -= slideWidth;
            if (currentPosition < -maxScroll) {
                currentPosition = -maxScroll;
            }
        }
        updateSlider();
    }, 4000);
    
    // Pause auto-slide on hover
    sliderTrack.parentElement.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
        autoSlide = null;
    });
    
    sliderTrack.parentElement.addEventListener('mouseleave', () => {
        if (!autoSlide) {
             autoSlide = setInterval(() => {
                const maxScroll = calculateMaxScroll();
                if (currentPosition <= -maxScroll) {
                    currentPosition = 0;
                } else {
                    currentPosition -= slideWidth;
                    if (currentPosition < -maxScroll) {
                        currentPosition = -maxScroll;
                    }
                }
                updateSlider();
            }, 4000);
        }
    });
}


// ===================================
// FAQ ACCORDION (Keeping original logic)
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
// FORM VALIDATION (Keeping original logic)
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
// SMOOTH SCROLL FOR ANCHOR LINKS (Refined)
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('header__nav--active')) {
                    // Use the function to centralize menu closing logic
                    toggleMobileMenu();
                }
            }
        }
    });
});

// ===================================
// SCROLL ANIMATIONS (Keeping original logic)
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
            observer.unobserve(entry.target); // Stop observing once animated
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
// PRICING TOGGLE (if needed for monthly/yearly) (Keeping original logic)
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
// LOADING ANIMATION (Keeping original logic)
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===================================
// PERFORMANCE OPTIMIZATIONS (Keeping original logic)
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