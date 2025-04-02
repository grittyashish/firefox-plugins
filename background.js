function foo() {
    console.log('Hello from background')
}
// Background script handles storage and messaging
console.log("Workday Autofill background script loaded");

// Load saved user data
let userData = {};

// Load data from storage when the add-on starts
browser.storage.local.get('userData').then(result => {
  if (result.userData) {
    userData = result.userData;
    console.log("Loaded user data from storage");
  }
});

// Listen for messages from content script or popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveData") {
    userData = request.data;
    browser.storage.local.set({ userData });
    console.log("User data saved");
    sendResponse({status: "success"});
  } else if (request.action === "getData") {
    sendResponse({data: userData});
  } else if (request.action === "autofill") {
    // Forward the autofill request to the content script
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      browser.tabs.sendMessage(tabs[0].id, {
        action: "autofill",
        data: request.data || userData
      }).then(sendResponse);
    });
    return true; // Required to use sendResponse asynchronously
  }
});