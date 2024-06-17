document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach((project, index) => {
        project.style.animation = `fadeInUp ${index * 0.3 + 0.3}s ease-in-out forwards`;
    });
});

/* Add keyframes for JavaScript animations in the CSS file */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`, styleSheet.cssRules.length);

// Add scroll animation to sections
document.addEventListener('scroll', function () {
    var aboutSection = document.getElementById('about');
    var contactSection = document.getElementById('contact');
    
    var aboutSectionPos = aboutSection.getBoundingClientRect().top;
    var contactSectionPos = contactSection.getBoundingClientRect().top;

    var windowHeight = window.innerHeight;

    if (aboutSectionPos < windowHeight / 2) {
        aboutSection.classList.add('scroll-in');
    } else {
        aboutSection.classList.remove('scroll-in');
    }

    if (contactSectionPos < windowHeight / 2) {
        contactSection.classList.add('scroll-in');
    } else {
        contactSection.classList.remove('scroll-in');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarNav');

    navbarToggler.addEventListener('click', function() {
        navbarToggler.classList.toggle('collapsed');
    });

    navbarCollapse.addEventListener('shown.bs.collapse', function () {
        navbarToggler.classList.remove('collapsed');
    });

    navbarCollapse.addEventListener('hidden.bs.collapse', function () {
        navbarToggler.classList.add('collapsed');
    });
});


