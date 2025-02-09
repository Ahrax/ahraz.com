let currentIndex = 0;
let imageElements = [];

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
                imgElement.onload = () => adjustContainerSize(imgWrapper, imgElement);
            }
        });
    } catch (error) {
        console.error(`Failed to load images: ${error.message}`);
    }
}


// Define the function to show the previous image
function prevImage() {
    imageElements[currentIndex].style.display = "none";
    currentIndex = (currentIndex - 1 + imageElements.length) % imageElements.length;
    imageElements[currentIndex].style.display = "flex";
}

// Define the function to show the next image
function nextImage() {
    imageElements[currentIndex].style.display = "none";
    currentIndex = (currentIndex + 1) % imageElements.length;
    imageElements[currentIndex].style.display = "flex";
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

// Load images when page loads
loadImages();
