import * as all from './app.js';

/* =========================================== Toggle Between Light/Dark Theme =========================================== */
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
/* =========================================== END Toggle Between Light/Dark Theme =========================================== */



/* =========================================== TOGGLE HAMBURGER MENU =========================================== */
{
    document.addEventListener("DOMContentLoaded", function () {
        // Select the hamburger icon and nav-links container
        var hamburger = document.querySelector(".hamburger");
        var navLinks = document.querySelector(".nav-links");

        // Define the screen breakpoint (768px for this example)
        var breakpoint = 768;

        // Add click event to the hamburger icon
        hamburger.addEventListener("click", function () {
            // Toggle the 'is-active' class to animate the hamburger bars
            hamburger.classList.toggle("is-active");

            // Toggle the 'open' class to show or hide the nav links
            navLinks.classList.toggle("open");
        });

        // Function to reset the menu on screen resize
        function resetMenuOnResize() {
            if (window.innerWidth > breakpoint) {
                // If screen width is larger than the breakpoint, make sure nav-links are visible and hamburger is inactive
                navLinks.classList.remove("open");
                hamburger.classList.remove("is-active");
            }
        }

        // Call the reset function when the window is resized
        window.addEventListener("resize", resetMenuOnResize);

        // Initial check to set the menu state based on current screen size
        resetMenuOnResize();
    });
}

/* =========================================== END TOGGLE HAMBURGER MENU =========================================== */



/* =========================================== HIGHLIGHTING THE ACTIVE SECTION =========================================== */
{
    document.addEventListener('DOMContentLoaded', function () {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        // Function to remove active class from all nav links
        function removeActiveClasses() {
            navLinks.forEach(link => link.classList.remove('active'));
        }

        // Function to add active class to the currently visible section's nav link
        function addActiveClass(id) {
            removeActiveClasses();
            document.querySelector(`.nav-links a[href="#${id}"]`).classList.add('active');
        }

        // Scroll event listener to highlight the nav link of the section in view
        window.addEventListener('scroll', function () {
            let currentSection = '';

            // Loop through each section to check which one is in the viewport
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - sectionHeight / 3) {
                    currentSection = section.getAttribute('id');
                }
            });

            if (currentSection) {
                addActiveClass(currentSection);
            }
        });

        // On page load, check if a section is already in view (in case the user refreshes the page)
        window.dispatchEvent(new Event('scroll'));
    });
}
/* =========================================== END HIGHLIGHTING THE ACTIVE SECTION =========================================== */



/* =========================================== CONTACT FORM =========================================== */
{
    /* ========================== FORM INPUT VALIDATION ========================== */
    {
        const form = document.querySelector("form");
        let nField = form.querySelector(".name"),
            nInput = nField.querySelector("input"),
            eField = form.querySelector(".email"),
            eInput = eField.querySelector("input"),
            pField = form.querySelector(".phone"),
            pInput = pField.querySelector("input"),
            mField = form.querySelector(".message"),
            mInput = mField.querySelector("textarea"),
            charCountDisplay = mField.querySelector(".sub-container #charCount"),
            nMaxChars = 74,
            mCurrentLength = 0,
            mMaxChars = 500; // Set maximum character limit

        // Initialize character counter
        charCountDisplay.innerText = `${mCurrentLength} / ${mMaxChars}`;

        // Update character counter on input
        mInput.addEventListener("input", () => {
            mCurrentLength = mInput.value.length;
            charCountDisplay.innerText = `${mCurrentLength} / ${mMaxChars}`;
        });

        form.onsubmit = (e) => {
            e.preventDefault(); // prevent form submitting

            // Validate fields
            validateForm();

            // If no validation errors, send data to Google Sheets
            if (!nField.classList.contains("error") &&
                !eField.classList.contains("error") &&
                !pField.classList.contains("error") &&
                !mField.classList.contains("error")) {

                sendDataToGoogleSheets();
            }
        };


        function validateForm() {
            // If fields are blank or invalid, add shake and error classes else call specified functions
            (nInput.value == "") ? nField.classList.add("shake", "error") : checkName();
            (eInput.value == "") ? eField.classList.add("shake", "error") : checkEmail();
            (pInput.value == "") ? pField.classList.add("shake", "error") : checkPhone();
            (mInput.value == "") ? mField.classList.add("shake", "error") : checkMessage();

            // Attach validation functions to keyup events
            nInput.onkeyup = () => { checkName(); };
            eInput.onkeyup = () => { checkEmail(); };
            pInput.onkeyup = () => { checkPhone(); };
            mInput.onkeyup = () => { checkMessage(); };

            // Validation functions for each field
            function checkName() { //checkName function
                // let namePattern = /^[a-zA-ZÀ-ÿ' -]{2,40}$/; //namePattern to validate name (doesn't support non-Latin languages. {Arabic, Chinese, etc})
                // let namePattern = /^\p{L}[\p{L}' -]{1,39}$/u; //namePattern to validate name (support all languages)
                let namePattern = new RegExp(`^\\p{L}[\\p{L}' -]{1,${nMaxChars}}$`, 'u'); //namePattern to validate name (support all languages)
                if (!nInput.value.match(namePattern)) { //if namePattern not matched then add error and remove valid class
                    nField.classList.add("error");
                    nField.classList.remove("valid");
                    let errorTxt = nField.querySelector(".error-txt");

                    if (nInput.value.length > nMaxChars) { // Check if character limit is exceeded
                        errorTxt.innerText = "Your name is too long.";
                    } else if (nInput.value != "") {
                        //if name value is not empty (too small < 2 char) then show "Enter a valid name." 
                        errorTxt.innerText = "Enter a valid name.";
                    } else {
                        // Otherwise show "Name can't be blank."
                        errorTxt.innerText = "Name can't be blank.";
                    }
                } else { //if namePattern matched then remove error and add valid class
                    nField.classList.remove("error");
                    nField.classList.add("valid");
                }
            }

            function checkEmail() { //checkEmail function
                let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //emailPattern to validate email
                if (!eInput.value.match(emailPattern)) { //if emailPattern not matched then add error and remove valid class
                    eField.classList.add("error");
                    eField.classList.remove("valid");
                    let errorTxt = eField.querySelector(".error-txt");
                    //if email value is not empty then show "Enter a valid email address." else show "Email can't be blank.
                    (eInput.value != "") ? errorTxt.innerText = "Enter a valid email address." : errorTxt.innerText = "Email can't be blank.";
                } else { //if emailPattern matched then remove error and add valid class
                    eField.classList.remove("error");
                    eField.classList.add("valid");
                }
            }

            function checkPhone() { //checkPhone function
                let phonePattern = /^\+?[0-9]\d{1,19}$/; //phonePattern to validate phone
                if (!pInput.value.match(phonePattern)) { //if phonePattern not matched then add error and remove valid class
                    pField.classList.add("error");
                    pField.classList.remove("valid");
                    let errorTxt = pField.querySelector(".error-txt");
                    //if phone value is not empty then show "Enter a valid phone." else show "Phone can't be blank."
                    (pInput.value != "") ? errorTxt.innerText = "Enter a valid phone. " : errorTxt.innerText = "Phone can't be blank.";
                } else { //if phonePattern matched then remove error and add valid class
                    pField.classList.remove("error");
                    pField.classList.add("valid");
                }
            }

            function checkMessage() { //checkMessage function
                // let messagePattern = /^(?=.{3,})(?=.{0,500}$)[\s\S]*$/; //messagePattern to validate message
                let messagePattern = new RegExp(`^(?=.{3,})(?=.{0,${mMaxChars}}$)[\\s\\S]*$`);  //messagePattern to validate message
                if (!mInput.value.match(messagePattern)) { //if messagePattern not matched then add error and remove valid class
                    mField.classList.add("error");
                    mField.classList.remove("valid");
                    let errorTxt = mField.querySelector(".error-txt");

                    if (mCurrentLength > mMaxChars) { // Check if character limit is exceeded
                        errorTxt.innerText = "Your message is too long.";
                    } else if (mInput.value != "") {
                        //if message value is not empty (too small < 3 char) then show "Enter a valid message."
                        errorTxt.innerText = "Enter a valid message.";
                    } else { // Otherwise show "Message can't be blank."
                        errorTxt.innerText = "Message can't be blank.";
                    }
                } else { //if messagePattern matched then remove error and add valid class
                    mField.classList.remove("error");
                    mField.classList.add("valid");
                }
            }

            // Add shake effect to invalid fields
            addShakeEffect();

            // Helper function to shake invalid fields
            function addShakeEffect() {
                if (nField.classList.contains("error")) nField.classList.add("shake");
                if (eField.classList.contains("error")) eField.classList.add("shake");
                if (pField.classList.contains("error")) pField.classList.add("shake");
                if (mField.classList.contains("error")) mField.classList.add("shake");

                setTimeout(() => {
                    nField.classList.remove("shake");
                    eField.classList.remove("shake");
                    pField.classList.remove("shake");
                    mField.classList.remove("shake");
                }, 500);
            }
        }

        form.onreset = () => {
            nField.classList.remove("shake", "error");
            eField.classList.remove("shake", "error");
            pField.classList.remove("shake", "error");
            mField.classList.remove("shake", "error");
            charCountDisplay.innerText = `0 / ${mMaxChars}`; // Reset character counter on reset

            // Remove validation listeners on reset
            nInput.onkeyup = null;
            eInput.onkeyup = null;
            pInput.onkeyup = null;
            mInput.onkeyup = null;
        };
    }

    /* ========================== END FORM INPUT VALIDATION ========================== */

    /* ===================== GOOGLE SHEETS INTEGRATION WITH SPINNER AND POPUP ===================== */
    // Function to send form data to Google Sheets
    function sendDataToGoogleSheets() {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzxIqgSmIZ6EDhUxLfl26cpW2OMDFRk6Sdl81gsJnvuXQ_3KH6OKWzDNpopKidBmPlNzQ/exec';
        const form = document.querySelector("form");
        const formData = new FormData(form);

        // Hide the form and show the spinner
        document.querySelector("form").classList.remove("show");
        document.getElementById("loading-spinner").classList.add("show");

        // Send the form data to Google Sheets
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    console.log('Success:', data); // Print Google Apps Scrip API response to console

                    // Hide the spinner and show success message
                    document.getElementById("loading-spinner").classList.remove("show");
                    showPopupMessage('Form submitted successfully!', 'success');

                    // Reset the form
                    form.reset();

                    // Show the form again after 3 seconds
                    setTimeout(() => {
                        document.getElementById("popup-message").classList.remove("show", "success"); // Hide message
                        document.querySelector("form").classList.add("show");  // Show form again
                    }, 3000);
                } else {
                    // Error returned from Google Apps Script: Handle failure
                    console.error('Error from server:', data);
                    document.getElementById("loading-spinner").classList.remove("show");
                    showPopupMessage('Form submission failed, Please try again.', 'failure');

                    // Show the form again after 3 seconds
                    setTimeout(() => {
                        document.getElementById("popup-message").classList.remove("show", "failure"); // Hide message
                        form.classList.add("show");  // Show form again
                    }, 3000);
                }
            })
            .catch(error => {
                console.error('Error:', error); // Handle error

                // Hide the spinner and show failure message
                document.getElementById("loading-spinner").classList.remove("show");
                showPopupMessage('Form submission failed, Please try again.', 'failure');

                // Show the form again after 3 seconds
                setTimeout(() => {
                    document.getElementById("popup-message").classList.remove("show", "failure"); // Hide message
                    document.querySelector("form").classList.add("show");  // Show form again
                }, 3000);
            });
    }

    // Function to show popup message by adding the 'show' class
    function showPopupMessage(message, status) {
        const popup = document.getElementById("popup-message");
        const popupText = document.getElementById("popup-text");

        popupText.innerText = message;

        if (status === 'success') {
            popup.classList.add('success');
            popup.classList.remove('failure');
        } else {
            popup.classList.add('failure');
            popup.classList.remove('success');
        }

        popup.classList.add("show"); // Show the popup by adding 'show' class
    }
    /* ===================== END GOOGLE SHEETS INTEGRATION WITH SPINNER AND POPUP ===================== */
}
/* =========================================== END CONTACT FORM =========================================== */



/* =========================================== DYNAMICALLY SET THE FOOTER COPYRIGHT YEAR =========================================== */
{
    // Get the current year
    const currentYear = new Date().getFullYear();
    // Set the current year to the span with ID 'currentYear'
    document.getElementById('currentYear').textContent = currentYear;
}
/* =========================================== END DYNAMICALLY SET THE FOOTER COPYRIGHT YEAR =========================================== */



/* =========================================== SMOOTH SCROLL =========================================== */
{
    $('nav .nav-links a').click(function () {
        $('html, body').animate({
            scrollTop: $('#' + $(this).data('value')).offset().top
        }, 1000);

        // console.log($(this).data('value'));
    });
}
/* =========================================== END SMOOTH SCROLL =========================================== */
