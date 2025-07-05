document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for ALL navigation links (header, popover, etc.)
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    const scrollToTopButton = document.getElementById('scrollToTop');
    const heroSection = document.getElementById('hero');

    // Function to check scroll position and toggle button visibility
    function toggleScrollToTopButton() {
        if (!heroSection) return;
        
        const heroRect = heroSection.getBoundingClientRect();
        const isHeroOutOfView = heroRect.bottom <= 0;
        
        if (isHeroOutOfView) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', toggleScrollToTopButton);
    
    // Initial check in case page is loaded with scroll position
    toggleScrollToTopButton();

    // Scroll to top functionality
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for all nav and popover links
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.slice(1);
                if (targetId.length === 0) {
                    // Scroll to top for href="#"
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        window.scrollTo({
                            top: targetElement.offsetTop - 70, // Adjust for fixed header height
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // Smooth scroll for logo-link (to top)
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Hamburger mobile nav logic
    const hamburger = document.querySelector('.hamburger');
    const popover = document.getElementById('mobileNavPopover');
    if (hamburger && popover) {
        hamburger.addEventListener('click', function(e) {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!expanded));
            if (!expanded) {
                popover.removeAttribute('hidden');
            } else {
                popover.setAttribute('hidden', '');
            }
        });
        // Close popover on outside click
        document.addEventListener('click', function(e) {
            if (!popover.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.setAttribute('aria-expanded', 'false');
                popover.setAttribute('hidden', '');
            }
        });
        // Close popover on nav link click
        popover.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.setAttribute('aria-expanded', 'false');
                popover.setAttribute('hidden', '');
            });
        });
    }

    // Auto-close mobile nav popover when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && popover && hamburger) {
            popover.setAttribute('hidden', '');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // Update current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
        // Honeypot anti-spam check
        if (e.target.website && e.target.website.value) {
            // Detected bot fill, silently ignore
            return;
        }
        e.preventDefault();
        const form = e.target;
        const status = document.getElementById('feedbackStatus');
        // Hide status before action
        status.classList.remove('visible');
        // Плавный скролл к секции feedback
        const feedbackSection = document.getElementById('feedbackForm');
        if (feedbackSection) {
            feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => {
            status.textContent = "Sending...";
            status.classList.add('visible');
        }, 400);
        try {
            await fetch('https://script.google.com/macros/s/AKfycbwApf61NMIsyL78Tp4Fk9z6lHm8FKE58ssIPQznla54rkB2t62TdGi7Ou2wqsqwrfcPnA/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: form.name.value,
                    email: form.email.value,
                    message: form.message.value
                })
            });
            setTimeout(() => {
                status.textContent = "Thank you for your feedback!";
                status.classList.add('visible');
                // Scroll to form after notification appears
                const feedbackSection = document.getElementById('feedbackForm');
                if (feedbackSection) {
                    feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 800);
            form.reset();
        } catch (err) {
            setTimeout(() => {
                status.textContent = "Error sending feedback. Please try again.";
                status.classList.add('visible');
                // Scroll to form after notification appears
                const feedbackSection = document.getElementById('feedbackForm');
                if (feedbackSection) {
                    feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 800);
        }
    });
});
