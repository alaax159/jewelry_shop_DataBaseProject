
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0.3';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });

    // Add staggered animation for cards
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add interactive chart functionality
    document.querySelectorAll('.chart-bar').forEach(bar => {
        bar.addEventListener('mouseenter', () => {
            bar.style.transform = 'scale(1.1)';
            bar.style.filter = 'brightness(1.2)';
        });
            
        bar.addEventListener('mouseleave', () => {
            bar.style.transform = 'scale(1)';
            bar.style.filter = 'brightness(1)';
        });
    });

    // Smooth scrolling for recommendations
    const recommendationsScroll = document.querySelector('.recommendations-scroll');
    let isScrolling = false;
    // Add sparkle effect to loyalty card
    function createSparkle() {
        const loyaltyCard = document.querySelector('.loyalty-card');
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--gold);
                border-radius: 50%;
                pointer-events: none;
                animation: sparkleFloat 2s ease-out forwards;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            
        loyaltyCard.appendChild(sparkle);
            
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }

    // Add sparkle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(0);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-20px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-40px) scale(0);
                }
            }
        `;
    document.head.appendChild(style);

    // Create sparkles periodically
    setInterval(createSparkle, 3000);

    // Add hover effects to product cards
    document.querySelectorAll('.product-card, .recommendation-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-medium)';
        });
            
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) translateY(0)';
            card.style.boxShadow = '';
        });
    });

    // Add click animation to cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });

    // Progress bar animation on scroll
    const progressBar = document.querySelector('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBar.style.width = '57%';
            }
        });
    }, { threshold: 0.5 });

    progressObserver.observe(progressBar);

    // Add subtle floating animation to icons
    document.querySelectorAll('.card-icon').forEach((icon, index) => {
        icon.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });

    // Add floating animation keyframes
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
            }
        `;
    document.head.appendChild(floatStyle);

    // Add loading animation for spending amount
    const spendingAmount = document.querySelector('.spending-amount');
    let currentAmount = 0;
    const targetAmount = 24750;
    const increment = targetAmount / 100;

    function animateCounter() {
        if (currentAmount < targetAmount) {
            currentAmount += increment;
            spendingAmount.textContent = `${Math.floor(currentAmount).toLocaleString()}`;
            requestAnimationFrame(animateCounter);
        } else {
            spendingAmount.textContent = `${targetAmount.toLocaleString()}`;
        }
    }

    // Start counter animation after page load
    setTimeout(() => {
        animateCounter();
    }, 1000);

    // Add smooth reveal animation for grid items
    document.querySelectorAll('.grid > .card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
            
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Add parallax effect to header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
        header.style.opacity = 1 - scrolled / 300;
    });

    // Add touch-friendly interactions for mobile
    if ('ontouchstart' in window) {
        document.querySelectorAll('.card, .product-card, .recommendation-card').forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.95)';
            });
                
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            });
        });
    }

