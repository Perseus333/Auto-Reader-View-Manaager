displayBlacklist();
// Checking which mode has been toggled
const modeToggleBlacklist = document.getElementById("modeToggle");
let enableByDefaultBlacklist; // Declare the variable outside of the if statement block

// Function to add URL to the blacklist
async function addToBlacklist() {
    var url = document.getElementById("urlInputBlacklist").value.trim();
    
    if (url === "") {
        setMessage("Please enter a valid URL.");
        return;
    }
    
    // Read the existing blacklist from storage
    let result = await browser.storage.local.get("blacklist");
    let blacklist = result.blacklist || [];
    
    // Check if the URL is already in the blacklist
    if (blacklist.includes(url)) {
        setMessage("URL already in blacklist.");
        return;
    }
    
    // Append the new URL to the blacklist
    blacklist.push(url);
    
    // Update the blacklist in storage
    await browser.storage.local.set({ blacklist });
    setMessage("URL added to blacklist.");
    
    // Refresh the displayed blacklist
    displayBlacklist();
}

// Function to remove URL from the blacklist
async function removeFromBlacklist(urlToRemove) {
    // Read the existing blacklist from storage
    let result = await browser.storage.local.get("blacklist");
    let blacklist = result.blacklist || [];
    
    // Filter out the URL to remove from the blacklist
    let updatedBlacklist = blacklist.filter(url => url !== urlToRemove);
    
    // Update the blacklist in storage
    await browser.storage.local.set({ blacklist: updatedBlacklist });
    
    setMessage("URL removed from blacklist: " + urlToRemove);
    
    // Refresh the displayed blacklist
    displayBlacklist();
}

// Function to add current page URL to the blacklist
async function addCurrentPageToBlacklist() {
    // Get the current tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    const currentTabUrl = currentTab.url.startsWith("about:reader?url=") ? 
    decodeURIComponent(currentTab.url.split("about:reader?url=")[1]) :
    currentTab.url;
    
    // Check if the current tab's URL is already in the blacklist
    let result = await browser.storage.local.get("blacklist");
    let blacklist = result.blacklist || []; 
    
    // Check if the current tab's URL is already in the blacklist
    if (blacklist.includes(currentTabUrl)) {
        setMessage("URL already in blacklist.");
        return;
    }
    
    // Add the current tab's URL to the blacklist
    blacklist.push(currentTabUrl);
    await browser.storage.local.set({ blacklist });
    
    setMessage("Current page added to blacklist.");
    
    // Refresh the displayed blacklist
    displayBlacklist();

    browser.runtime.sendMessage({ convertToRegular: true });
    console.log("Blacklist -> Convert to regular")
}

// Function to set message
function setMessage(message) {
    document.getElementById("messageBlacklist").textContent = message;
    console.log(message);
    browser.storage.local.get("blacklist").then(result => {
        const blacklistArray = result.blacklist || []; // If "blacklist" is not found, default to an empty array
        console.log(blacklistArray);
      });
}

// Function to display blacklist
function displayBlacklist() {
    // Clear the current blacklist display
    let blacklistElement = document.getElementById("blacklist");
    blacklistElement.innerHTML = "";

    // Read the blacklist from storage and display it
    browser.storage.local.get("blacklist").then(result => {
        let blacklist = result.blacklist || [];
        blacklist.forEach(url => {
            let listItem = document.createElement("li");
            listItem.textContent = url;
            let removeButton = document.createElement("button");
            removeButton.textContent = "⛔";

            removeButton.addEventListener("click", () => {
                removeFromBlacklist(url);
            });

            listItem.appendChild(removeButton);
            blacklistElement.appendChild(listItem);
        });
    });
}

modeToggleBlacklist.addEventListener("change", function () {
    enableByDefaultBlacklist = this.checked;

    if (enableByDefaultBlacklist) {        
        // Initialize the display of the blacklist
        displayBlacklist();
    }
});

// Add event listeners
document.getElementById("addButtonBlacklist").addEventListener("click", addToBlacklist);
document.getElementById("addCurrentPageButtonBlacklist").addEventListener("click", addCurrentPageToBlacklist);
