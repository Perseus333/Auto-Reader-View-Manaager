// Forces the conversion of a tab to reader mode
async function forceConvert(tabId, tabUrl, tabIndex) {
  try {
      // Remove the original tab
      await browser.tabs.remove(tabId);
      console.log("Original tab removed:", tabId);

      // Create a new tab in reader mode
      let createdTab = await browser.tabs.create({
          openInReaderMode: true,
          url: tabUrl,
          index: tabIndex
      });
      console.log("New tab created:", createdTab);
  } catch (error) {
      console.error("Error creating or removing tab:", error);
  }
}

// Retrieve the value of "enableByDefault" from storage
browser.storage.local.get("enableByDefault").then(result => {
    autoRead = result.enableByDefault;
    // Call a function to handle any necessary updates based on the new value
    displaySections();
});

// Listen for messages from the popup script to update autoRead
browser.runtime.onMessage.addListener((message) => {
    if (message.autoRead !== undefined) {
        autoRead = message.autoRead;
        displaySections();
    }
});

async function initializeBlacklist() {
    // Read the blacklist from storage
    let resultBlacklist = await browser.storage.local.get("blacklist");
    return resultBlacklist.blacklist || [];
}

async function initializeWhitelist() {
    // Read the whitelist from storage
    let resultWhitelist = await browser.storage.local.get("whitelist");
    return resultWhitelist.whitelist || [];
}

async function checkAndUpdate(tab) {
    displaySections();
    // Check if autoRead is true (enableByDefault)
    console.log("AutoRead:", autoRead);
    if (autoRead) {
        // Initialize the blacklist
        let blacklist = await initializeBlacklist();
        console.log("Blacklist:", blacklist);

        // Check if the URL contains any item from the blacklist array
        var isBlacklisted = blacklist.some(function(url) {
            return tab.url.includes(url);
        });
        console.log("Is blacklisted:", isBlacklisted);

        if (!isBlacklisted) {
            console.log("Creating tab in reader mode...");

            // Create a new tab in reader mode
            try {
                var createdTab = await browser.tabs.create({
                    openInReaderMode: true,
                    url: tab.url,
                    index: tab.index
                });

                console.log("New tab created:", createdTab);

                // Remove the original tab
                await browser.tabs.remove(tab.id);
                console.log("Original tab removed:", tab.id);
            } catch (error) {
                console.error("Error creating or removing tab:", error);
            }
        } else {
            console.log("URL is blacklisted. Skipping execution.");
        }
    } else {
        // Initialize the whitelist
        let whitelist = await initializeWhitelist();
        console.log("Whitelist:", whitelist);

        // Check if the URL contains any item from the whitelist array
        var isInWhitelist = whitelist.some(function(url) {
            return tab.url.includes(url);
        });
        console.log("Is in whitelist:", isInWhitelist);

        if (isInWhitelist) {
            console.log("Creating tab in reader mode...");

            // Create a new tab in reader mode
            try {
                var createdTab = await browser.tabs.create({
                    openInReaderMode: true,
                    url: tab.url,
                    index: tab.index
                });

                console.log("New tab created:", createdTab);

                // Remove the original tab
                await browser.tabs.remove(tab.id);
                console.log("Original tab removed:", tab.id);
            } catch (error) {
                console.error("Error creating or removing tab:", error);
            }
        } else {
            console.log("URL is not in whitelist. Skipping execution.");
        }
    }
}

// Function to handle any necessary updates based on the value of autoRead
function displaySections() {
    // Define your logic here based on the value of autoRead
    // For example:
    if (autoRead) {
        console.log("AutoRead is true. Displaying blacklist sections.");
    } else {
        console.log("AutoRead is false. Displaying whitelist sections.");
    }
}

// Add listener for tab updates
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        console.log("Tab updated:", tab);
        checkAndUpdate(tab);
    }
});


browser.runtime.onMessage.addListener(async (message) => {
  console.log("Message received");
  if (message.updateAutoReader) {
      console.log("Updating from whitelist_message");
      // Get the current active tab
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs && tabs.length > 0) {
          const currentTab = tabs[0];
          // Pass the tab ID, URL, and index to the forceConvert function
          forceConvert(currentTab.id, currentTab.url, currentTab.index);
          console.log("Tab updated:", currentTab);
      } else {
          console.error("No active tab found.");
      }
  }
});



browser.runtime.onMessage.addListener(async (message) => {
  console.log("Message received");
  if (message.convertToRegular) {
      console.log("Converting from Blacklist message");
      // Get the current active tab
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs && tabs.length > 0) {
          const currentTab = tabs[0];
          // Pass the tab ID, URL, and index to the forceConvert function
          convertToRegularTab(currentTab.id, currentTab.url, currentTab.index);
          console.log("Tab updated:", currentTab);
      } else {
          console.error("No active tab found.");
      }
  }
});