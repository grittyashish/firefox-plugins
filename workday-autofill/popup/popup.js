document.addEventListener('DOMContentLoaded', function() {
    const fillButton = document.getElementById('fillButton');
    const statusMessage = document.getElementById('status');
    
    fillButton.addEventListener('click', function() {
      statusMessage.textContent = "Filling form...";
      
      // Send message to content script to fill the form
      browser.tabs.query({active: true, currentWindow: true})
        .then(tabs => {
          browser.tabs.sendMessage(tabs[0].id, { command: "fillForms" })
            .then(response => {
              statusMessage.textContent = "Form filling initiated!";
            })
            .catch(error => {
              statusMessage.textContent = "Error: " + error.message;
            });
        })
        .catch(error => {
          statusMessage.textContent = "Error: Cannot access active tab";
        });
    });
  });
  