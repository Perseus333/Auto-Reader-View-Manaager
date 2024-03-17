// Get the modeToggle checkbox element
const modeToggle = document.getElementById("modeToggle");


// Function to handle changes in the checkbox state
async function handleCheckboxChange() {
  // Update the stored value of enableByDefault based on the checkbox state
  await browser.storage.local.set({ enableByDefault: this.checked });
  // Update the UI
  displaySections();
  // Send a message to the background script to update autoRead
  browser.runtime.sendMessage({ autoRead: this.checked });
}

// Attach event listener for changes to the checkbox
modeToggle.addEventListener("change", handleCheckboxChange);

// Retrieve the stored value of enableByDefault from browser storage
browser.storage.local.get("enableByDefault").then(result => {
    // Check if enableByDefault is true
    if (result.enableByDefault) {
        // If true, set the checkbox to checked
        modeToggle.checked = true;
    } else {
        // If false, set the checkbox to unchecked
        modeToggle.checked = false;
    }
});

// Function to display sections based on the enableByDefault value
async function displaySections() {
    // Retrieve the stored value of enableByDefault from local storage
    const result = await browser.storage.local.get("enableByDefault");
    const enableByDefault = result.enableByDefault;
    // Apply styles based on the stored value
    if (enableByDefault) {
        document.querySelectorAll(".whitelist-section").forEach(function (element) {
            element.style.display = "none";
        });
        document.querySelectorAll(".blacklist-section").forEach(function (element) {
            element.style.display = "";
        });
    } else {
        document.querySelectorAll(".blacklist-section").forEach(function (element) {
            element.style.display = "none";
        });
        document.querySelectorAll(".whitelist-section").forEach(function (element) {
            element.style.display = "";
        });
    }
}

// Retrieve the stored value of enableByDefault from browser storage
browser.storage.local.get("enableByDefault").then(result => {
    // Check if enableByDefault is true
    if (result.enableByDefault) {
        // If true, set the checkbox to checked
        modeToggle.checked = true;
    } else {
        // If false, set the checkbox to unchecked
        modeToggle.checked = false;
    }
});

// Call the displaySections function initially to ensure correct initial display
displaySections();
