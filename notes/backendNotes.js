window.onload = function() {
    const buttons = document.querySelectorAll('.noteLinkButton');
    const title = document.getElementById('mainTitle'); // Reference to the h1 element
    
    // Set a delay for all buttons to appear
    setTimeout(() => {
        buttons.forEach(button => {
            button.classList.add('visible'); // Add visible class to show all buttons
            button.classList.add('hoverable'); // Enable hover effect
        });

        // Set a delay before applying the blur effect to the h1
        setTimeout(() => {
            title.classList.add('blur'); // Add blur class to blur h1 text
        }, 0); // Delay of 1.5 seconds (1500 milliseconds) after fade-in
    }, 1000); // Delay of 1 second (1000 milliseconds) for fade-in
};
