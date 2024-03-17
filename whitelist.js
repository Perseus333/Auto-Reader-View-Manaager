displayWhitelist();

// Checking which mode has been toggled
const modeToggleWhitelist = document.getElementById("modeToggle");
let enableByDefaultWhitelist; // Declare the variable outside of the if statement block

// Funciton to add URL to whitelist
async function addToWhitelist() {
    var url = document.getElementById("urlInputWhitelist").value.trim();

    if (url === "") {
        setMessage("Please enter a valid URL.");
        return;
    }

    // Read the existing whitelist from storage
    let result = await browser.storage.local.get("whitelist");
    let whitelist = result.whitelist || [];

    // Check if the URL is already in the whitelist
    if (whitelist.includes(url)) {
    setMessage("URL already in whitelist.");
    return;
    }

    // Append the new URL to the whitelist
    whitelist.push(url);

    // Update the whitelist in storage
    await browser.storage.local.set({ whitelist });
    setMessage("URL added to whitelist.");

    // Refresh the displayed whitelist
    displayWhitelist();
}

// Function to remove URL from the whitelist
async function removeFromWhitelist(urlToRemove) {
    // Read the existing whitelist from storage
    let result = await browser.storage.local.get("whitelist");
    let whitelist = result.whitelist || [];

    // Filter out the URL to remove from the whitelist
    let updatedWhitelist = whitelist.filter(url => url !== urlToRemove);

    // Update the whitelist in storage
    await browser.storage.local.set({ whitelist: updatedWhitelist });

    setMessage("URL removed from whitelist: " + urlToRemove);

    // Refresh the displayed whitelist
    displayWhitelist();
}

// Function to add current page URL to the whitelist
async function addCurrentPageToWhitelist() {
    // Get the current tab
    let tabs = await browser.tabs.query({ active: true, currentWindow: true });
    let currentTab = tabs[0];
    if (currentTab.url.startsWith("about:reader?url=")) {
    var currentTabUrl = decodeURIComponent(currentTab.url.split("about:reader?url=")[1])
    }
    else {
    var currentTabUrl = currentTab.url
    }
    // Check if the current tab's URL is already in the whitelist
    let result = await browser.storage.local.get("whitelist");
    let whitelist = result.whitelist || []; 
    if (whitelist.includes(currentTabUrl)) {
    setMessage("URL already in whitelist.");
    return;
    }

    // Add the current tab's URL to the whitelist
    whitelist.push(currentTabUrl);
    await browser.storage.local.set({ whitelist });
    setMessage("Current page added to whitelist.");

    // Refresh the displayed whitelist
    displayWhitelist();

    browser.runtime.sendMessage({ updateAutoReader: true });
    console.log("Whitelist -> Convert to reader")
}

function setMessage(message) {
    document.getElementById("messageWhitelist").textContent = message;
    console.log(message);
    browser.storage.local.get("whitelist").then(result => {
        const whitelistArray = result.whitelist || []; // If "whitelist" is not found, default to an empty array
        console.log(whitelistArray);
      });
}

function displayWhitelist() {
    // Clear the current whitelist display
    let whitelistElement = document.getElementById("whitelist");
    whitelistElement.innerHTML = "";

    // Read the whitelist from storage and display it
    browser.storage.local.get("whitelist").then(result => {
    let whitelist = result.whitelist || [];
    whitelist.forEach(url => {
        let listItem = document.createElement("li");
        listItem.textContent = url;
        let removeButton = document.createElement("button");
        removeButton.textContent = "⛔";
        removeButton.addEventListener("click", () => {
        removeFromWhitelist(url);
        });
        listItem.appendChild(removeButton);
        whitelistElement.appendChild(listItem);
    });
    });
}

modeToggleWhitelist.addEventListener("change", function () {
  enableByDefaultWhitelist = this.checked;

  if (!enableByDefaultWhitelist) {
    displayWhitelist();
    }
});

// Add event listeners for the "Add" button and the "Add Current Page" button
document.getElementById("addButtonWhitelist").addEventListener("click", addToWhitelist);
document.getElementById("addCurrentPageButtonWhitelist").addEventListener("click", addCurrentPageToWhitelist);