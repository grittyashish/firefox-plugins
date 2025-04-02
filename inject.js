// Handle file uploads
async function handleFileUpload(filePath, inputSelector) {
  try {
    const response = await fetch(`file://${filePath}`);
    const blob = await response.blob();
    const file = new File([blob], filePath.split('/').pop() || filePath.split('\\').pop());
    
    const input = document.querySelector(inputSelector);
    if (input) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  } catch (error) {
    console.error('File upload error:', error);
    return false;
  }
}

// Fill a form field
function fillField(selector, value) {
  const field = document.querySelector(selector);
  if (field) {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  return false;
}

// Fill a dynamic section (like work history)
function fillDynamicSection(sectionSelector, data, index) {
  const section = document.querySelectorAll(sectionSelector)[index];
  if (section) {
    Object.entries(data).forEach(([key, value]) => {
      const input = section.querySelector(`[data-automation-id="${key}"]`);
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    return true;
  }
  return false;
}

// Main message handler
window.addEventListener('message', async (event) => {
  if (event.data.type === 'FROM_EXTENSION' && event.data.action === 'FILL_WORKDAY_FORM') {
    const formData = event.data.data;
    const results = {
      personalInfo: {},
      resumeUpload: false,
      workHistory: []
    };
    
    try {
      // Fill personal information
      if (formData.personal) {
        results.personalInfo.firstName = fillField(
          '[data-automation-id="name"] input:first-of-type',
          formData.personal.firstName
        );
        
        results.personalInfo.lastName = fillField(
          '[data-automation-id="name"] input:last-of-type',
          formData.personal.lastName
        );
        
        results.personalInfo.email = fillField(
          '[data-automation-id="email"] input',
          formData.personal.email
        );
        
        results.personalInfo.phone = fillField(
          '[data-automation-id="phone"] input',
          formData.personal.phone
        );
        
        if (formData.personal.resumePath) {
          results.resumeUpload = await handleFileUpload(
            formData.personal.resumePath,
            '[data-automation-id="resume"] input[type="file"]'
          );
        }
      }
      
      // Fill work history
      if (formData.workHistory) {
        for (let i = 0; i < formData.workHistory.length; i++) {
          if (i > 0) {
            const addButton = document.querySelector('[data-automation-id="addWorkExperience"]');
            if (addButton) addButton.click();
          }
          
          const filled = fillDynamicSection(
            '[data-automation-id="workExperience"]',
            formData.workHistory[i],
            i
          );
          
          results.workHistory.push({
            index: i,
            success: filled,
            company: formData.workHistory[i].company
          });
        }
      }
      
      // Report success
      window.postMessage({
        type: 'FROM_PAGE',
        status: 'Form filled successfully',
        details: results
      }, '*');
      
    } catch (error) {
      window.postMessage({
        type: 'FROM_PAGE',
        status: 'Error: ' + error.message,
        details: results
      }, '*');
    }
  }
});