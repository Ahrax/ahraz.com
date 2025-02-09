async function loadImages() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWjRJYiNBSCZCOpUOdvrFxrQbMn8tDjEIi1Z99VhS_iaoKt5MdZL_UnLVSezhkNaJiQMTbr3ZBmW8O/pub?gid=0&single=true&output=csv"; // Replace with your GitHub Pages CSV link
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
        imageURLs.forEach(url => {
            if (url) {
                console.log(`Loading image: ${url}`); // Debug log

                let imgWrapper = document.createElement("div");
                imgWrapper.className = "photo-container";

                // Image Element
                let imgElement = document.createElement("img");
                imgElement.src = url; // Use the direct URL to fetch the image
                imgElement.alt = "Photo";
                imgElement.loading = "lazy";
                imgElement.onerror = () => console.error(`Failed to load image: ${url}`); // Log error if image fails to load

                // Button to toggle dropdown visibility
                let button = document.createElement("button");
                button.className = "details-button";
                button.innerText = "View Details";
                button.onclick = () => toggleDropdown(button);

                // Dropdown for metadata
                let dropdown = document.createElement("div");
                dropdown.className = "photo-info-dropdown";
                dropdown.style.display = "none";  // Initially hidden

                // Add EXIF data to the dropdown (this will be extracted later)
                EXIF.getData(imgElement, function() {
                    let camera = EXIF.getTag(this, "Make") + " " + EXIF.getTag(this, "Model");
                    let exposure = EXIF.getTag(this, "ExposureTime");
                    let aperture = EXIF.getTag(this, "FNumber");
                    let iso = EXIF.getTag(this, "ISOSpeedRatings");
                    let date = EXIF.getTag(this, "DateTimeOriginal");

                    dropdown.innerHTML = `
                        <strong>Date: </strong> ${date}<br>
                        <strong>Camera: </strong> ${camera}<br>
                        <strong>Exposure: </strong> ${exposure}s<br>
                        <strong>F-Stop: </strong> f/${aperture}<br>
                        <strong>ISO: </strong> ${iso}
                    `;
                });

                // Append the image, button, and dropdown to the wrapper
                imgWrapper.appendChild(imgElement);
                imgWrapper.appendChild(button);
                imgWrapper.appendChild(dropdown);

                // Add the image wrapper to the gallery
                gallery.appendChild(imgWrapper);
            }
        });
    } catch (error) {
        console.error(`Failed to load images: ${error.message}`);
    }
}

// Define the toggleDropdown function
function toggleDropdown(button) {
    const dropdown = button.nextElementSibling;
    if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}

loadImages();
