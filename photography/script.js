let currentIndex = 0;
let imageElements = [];
let detailsVisible = false;

async function loadImages() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWjRJYiNBSCZCOpUOdvrFxrQbMn8tDjEIi1Z99VhS_iaoKt5MdZL_UnLVSezhkNaJiQMTbr3ZBmW8O/pub?gid=0&single=true&output=csv"; // Replace with your Google Sheets CSV link
    const corsProxy = "https://api.allorigins.win/get?url="; // Alternative CORS proxy URL
    try {
        const response = await fetch(corsProxy + encodeURIComponent(sheetURL));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const base64Data = json.contents;
        const decodedData = atob(base64Data.split(",")[1]);
        console.log("Decoded CSV Data:", decodedData); // Log the decoded CSV data

        const lines = decodedData.split("\n");
        const imageURLs = lines.map(line => line.trim());
        console.log("Image URLs:", imageURLs); // Log the extracted image URLs

        const gallery = document.getElementById("gallery");
        imageURLs.forEach((url, index) => {
            if (url) {
                console.log(`Loading image: ${url}`); // Debug log

                let imgWrapper = document.createElement("div");
                imgWrapper.className = "photo-container";
                imgWrapper.style.display = index === 0 ? "flex" : "none"; // Show the first image initially

                // Image Element
                let imgElement = document.createElement("img");
                imgElement.src = url; // Use the direct URL to fetch the image
                imgElement.alt = "Photo";
                imgElement.loading = "lazy";
                imgElement.onerror = () => console.error(`Failed to load image: ${url}`); // Log error if image fails to load

                // Append the image to the wrapper
                imgWrapper.appendChild(imgElement);

                // Add the image wrapper to the gallery
                gallery.appendChild(imgWrapper);

                // Add the image element to the array
                imageElements.push(imgWrapper);

                // Call function to adjust container size after image loads
                imgElement.onload = () => adjustPadding(imgWrapper, imgElement);
            }
        });

        // Update dynamic text
        updateDynamicText();
        // Show details for the first image
        updateDetails();
        // Ensure details are visible from the start
        detailsVisible = true;
        document.querySelector(".detailsContent").style.display = "block";
    } catch (error) {
        console.error(`Failed to load images: ${error.message}`);
    }
}

// Function to adjust padding based on image dimensions
function adjustPadding(container, img) {
    let imgWidth = img.naturalWidth;
    let imgHeight = img.naturalHeight;
    let aspectRatio = imgWidth / imgHeight;

    // Calculate padding based on image dimensions
    let paddingValue = Math.max(16, 27 - (aspectRatio - 1.5) * 4);
    paddingValue = Math.min(paddingValue, 27); // Ensure padding does not exceed 27px

    // Apply padding value to the container
    container.style.padding = `${paddingValue}px`;
}

// Function to update dynamic text
function updateDynamicText() {
    const dynamicTextElement = document.getElementById("image-count");
    const totalImages = imageElements.length;
    const currentImageIndex = currentIndex + 1; // +1 to make it 1-based index
    dynamicTextElement.textContent = `Showing image ${currentImageIndex} of ${totalImages}`;
}

// Function to update image details
function updateDetails() {
    const imgElement = imageElements[currentIndex].querySelector("img");
    EXIF.getData(imgElement, function() {
        const dateTaken = EXIF.getTag(this, "DateTimeOriginal");

        // Format date as dd/mm/yyyy
        let dateFormatted = "N/A";
        if (dateTaken) {
            const dateParts = dateTaken.split(" ")[0].split(":");
            dateFormatted = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }

        const detailsContent = document.querySelector(".detailsContent");
        detailsContent.innerHTML = `
            <p>${dateFormatted}</p>
        `;
    });
}


// Define the function to show the previous image
function prevImage() {
    imageElements[currentIndex].style.display = "none";
    currentIndex = (currentIndex - 1 + imageElements.length) % imageElements.length;
    imageElements[currentIndex].style.display = "flex";
    updateDynamicText();
    updateDetails();
}

// Define the function to show the next image
function nextImage() {
    imageElements[currentIndex].style.display = "none";
    currentIndex = (currentIndex + 1) % imageElements.length;
    imageElements[currentIndex].style.display = "flex";
    updateDynamicText();
    updateDetails();
}

// Load images when page loads
loadImages();
