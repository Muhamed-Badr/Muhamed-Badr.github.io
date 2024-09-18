import * as all from './app.js';

/* ===================================== Toggle Between Light/Dark Theme ===================================== */
{
    // Function to initialize particles.js with a given configuration
    function initParticles(config) {
        particlesJS('particles-js', config);  // Initialize particles.js with the provided config
    }

    // Set initial theme based on localStorage or default to light
    const currentTheme = localStorage.getItem('theme') || 'dark-theme';
    document.body.classList.add(currentTheme);

    // Initialize particles.js with the correct theme configuration
    initParticles(currentTheme === 'light-theme' ? all.lightThemeConfig : all.darkThemeConfig);

    // Toggle theme on button click
    var btnModeDiv = document.querySelector('.btn-mode');
    var btnModeIcon = document.querySelector('.btn-mode-icon');

    // Function to set the correct icon based on the current theme
    function setThemeIcon(isLightTheme) {
        if (isLightTheme) {
            btnModeIcon.classList.remove('ri-sun-line');
            btnModeIcon.classList.add('ri-moon-line');
        } else {
            btnModeIcon.classList.remove('ri-moon-line');
            btnModeIcon.classList.add('ri-sun-line');
        }
    }

    // Set the correct icon on initial load based on the theme
    setThemeIcon(currentTheme === 'light-theme');

    // Add the click event listener to the div
    btnModeDiv.onclick = function () {
        const isLightTheme = document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme', !isLightTheme);

        // Toggle between sun and moon icons
        setThemeIcon(isLightTheme);

        // Save the current theme to localStorage
        localStorage.setItem('theme', isLightTheme ? 'light-theme' : 'dark-theme');

        // Reinitialize particles.js with the correct theme configuration
        initParticles(isLightTheme ? all.lightThemeConfig : all.darkThemeConfig);
    };

    // On page load, set the theme from localStorage
    window.onload = function () {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.add(savedTheme);
            initParticles(savedTheme === 'light-theme' ? all.lightThemeConfig : all.darkThemeConfig);
        } else {
            // Default to dark theme
            initParticles(darkThemeConfig);
        }
    };
}
/* ===================================== END Toggle Between Light/Dark Theme ===================================== */


/* ============================================ Smooth Scrolling ============================================ */
{
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the default jump
    
            const targetSection = document.querySelector(this.getAttribute('href')); // Get the target section by its ID
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth', // Smooth scroll effect
                    block: 'start' // Scroll to the start of the section
                });
            }
        });
    });
    
}
/* ============================================ END Smooth Scrolling ============================================ */
