// Wait for Workday form to load
console.log("Workday Autofill content script loaded");

const workdayConfig = `{
    "personalInfo": {
      "firstName": "Ashish",
      "middleName": "Kumar",
      "lastName": "Choubey",
      "email": "contactchoubey@gmail.com",
      "phone": { 
          "countryCode" : "+91",
          "mobile" : "7003776268",
          "deviceType" : "Mobile"
      },
      "resumePath": "C:/Users/ASUS/Desktop/Job Change/DE.pdf",
      "address" : {
                  "addressLine1": "Lingrajpuram",
                  "city" : "Bengaluru",
                  "postalCode" : 560084,
                  "state" : "Karnataka"
      }
    },
    "experience" : {
        "workHistory": [
        {
            "company": "Analog Devices",
            "jobTitle": "Data Engineer",
            "fromDate": "06/2022",
            "toDate" : "Present",
            "location" : "Bengaluru",
            "roleDescription": [
            "Designing and developing IoT data solutions",
            "Developing and maintaining a FastAPI-based API to efficiently serve diverse data sources and requirements for enterprise applications.",
            "Working on Data Ingestion Layer for various data sources.",
            "Built Software Analytics Data Platform, a central data platform for data from that provides meaningful insights for Software Supply Chain data for Software Leaders",
            "Built Generative AI system to provide financial analyst like insights for earning call transcripts released by over 250 companies.",
            "Automated Pipeline monitoring, built Data Quality Framework(DQ), KPIs population and Data Drift system as part of DataOps, resulting in timely alerts to the stakeholders and 94% reduction in resolution time.",
            "Collaborating with stakeholders to develop ELT data pipelines that meet various business requirements.",
            "Developed Sagemaker Ground Truth jobs being used by 18 internal experts for collecting feedback on prediction of a segmentation model being used by the marketing vertical.",
            "Worked on Data Hygiene, cleansing and enriching data for 6+ pipelines",
            "Responsible for Migration of 10+ Data Pipelines from on-premise SAS Environment to AWS Environment"
            ]
        },
        {
            "company": "Wipro Limited",
            "title": "Data Engineer",
            "fromDate" : "07/2018",
            "toDate": "04/2020",
            "localtion" : "Pune",
            "description": [
                "Worked on ETL Pipelines on Informatica PowerCenter, Teradata and SQL.",
                "Responsible for creation and maintainance of ETL Data Pipelines",
                "Designed PoC titled Digital Data Trust, a rating system to help Organizations evaluate their data across dimensions.",
                "Designed ML model with training data extracted from various Informatica products' APIs"
            ]
            }
        ],
        "education": [
        {
            "institution": "Indian Institute of Technology Bhubaneswar",
            "degree": "Masters level degree",
            "fieldOfStudy": "Computer Engineering"
        },
        {
            "institution": "Government College of Engineering and Ceramic Technology",
            "degree": "Bachelors level degree",
            "fieldOfStudy": "Computer Engineering"
        }
        ],
        "languages" : [
            {
            "name" : "English",
            "reading" : "Fluent",
            "speaking" : "Fluent",
            "translation" : "Fluent",
            "writing" : "Fluent"
            },
            {
            "name" : "Hindi",
            "reading" : "Fluent",
            "speaking" : "Fluent",
            "translation" : "Fluent",
            "writing" : "Fluent"
            },
            {
            "name" : "Bengali",
            "reading" : "Beginner",
            "speaking" : "Fluent",
            "translation" : "Beginner",
            "writing" : "Beginner"
            }        
        ],
        "skills" : ["Python", "SQL", "PySpark", "pandas Python Library", "FastAPI", "Pydantic",  
                    "AWS Glue", "AWS Lambda", "Amazon Elastic Container Service (Amazon ECS)", "AWS Identity And Access Management (IAM)", "EC2", "Amazon S3", "RDS", "SageMaker", "AWS Step Functions", "Cloudwatch", "Azure", 
                    "IoT Hub", "Events Hub", "Blob Storage", "Stream Analytics", "ETL", "ELT", "Data Warehouse", "Data Lake", "Data Wrangling", "Data Modeling", "Fivetran",
                    "Airflow", "Redshift", "Snowflake (Platform)", "PostgreSQL", "Redis", "Oracle", "Document Database", "Relational Database", "Vector Database",
                    "Parquet", "Apache Avro", "json", "OpenSearch", "ElasticSearch", "ELK", "dbt", "Kafka", "Docker", "Kubernetes", "AWS CDK", "Jenkins",
                    "Microservices", "Linux", "RESTful APIs", "Agile" 
        ],
        "archiveSkills" : ["Datasets", "DataFrames", "RDDs", "Streamlit"],
        "websites" : [
            {"website1" : "https://www.github.com/grittyashish"}
        ],
        "social" : [
            {"linkedin" : "https://www.linkedin.com/in/ashishkc"}
        ]
    }
  }`;
const data = JSON.parse(workdayConfig);

(function() {
    // Helper functions
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
    console.log("Workday Form Filler loaded");
    
    // Listen for messages from the popup
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "fillForms") {
          console.log("Received form filling instruction from popup.js");
          console.log(`Starting to fill form with ${JSON.stringify(data)}`);
          fillWorkdayForms(data);
          return Promise.resolve({status: "success"});
        }
      });
    
    function fillWorkdayForms(data) {
      if (isMyInformationPage()) {
        console.log("Verified My Information Page, now filling the page using personal information");
        fillPersonalInfo(data.personalInfo);
      } else if (isExperiencePage()) {
        fillExperience(data.experience);
      }
    }
    
    function isMyInformationPage() {
      // Check if current page is the My Information page
      var pageHeading = document.querySelector('h2.css-1ylcaf3[tabindex="-1"]').innerHTML;
      console.log(`${pageHeading} is the page`);
      console.log(`myworday page found? : ${window.location.href.includes("myworkday")}`);
      return window.location.href.includes("myworkday") && 
        pageHeading == "My Information";
    }
    
    function isExperiencePage() {
      // Check if current page is the Experience page
      var pageHeading = document.querySelector('h2.css-1ylcaf3[tabindex="-1"]').innerHTML;
      console.log(`${pageHeading} is the page`);
      return window.location.href.includes("myworkday") && pageHeading == 'My Experience';
    }

    function fillExperience(experience){
        addExperience(experience.workHistory);
        console.log('Added work history');
        addSkills(experience.skills);
        console.log("Added skills");
        addEducation(experience.education);
        console.log("Added Education")
    }

    // Enhanced helper function to verify HTML change
    function verifyInputChange(labelText, value, originalValue = null) {
      const labels = Array.from(document.querySelectorAll('label'));
      const label = labels.find(el => el.textContent.includes(labelText));
      
      if (label) {
        const inputId = label.getAttribute('for');
        const input = document.getElementById(inputId) || 
                      label.closest('.field-container').querySelector('input, textarea');
        
        if (input) {
          // Check if the value has actually changed
          const currentValue = input.value;
          const isChanged = currentValue === value && 
                            (originalValue === null || currentValue !== originalValue);
          
          console.log(`Verification for ${labelText}:`, {
            expectedValue: value,
            currentValue: currentValue,
            changed: isChanged
          });
          
          return isChanged;
        }
      }
      
      console.log(`Could not verify change for ${labelText}`);
      return false;
    }

    // Enhanced input filling function
    function fillInputByLabel(labelText, value) {
      if (!value) return false;

      console.log(`Attempting to fill ${labelText} with ${value}`);
      
      // Special handling for First and Middle Name
      if (labelText === "First and Middle Name") {
        const nameParts = value.split(',');
        const firstName = nameParts[0];
        const middleName = nameParts[1];

        // First try to fill Middle Name if possible
        let middleNameFilled = false;
        middleNameFilled = fillInputByLabel('Middle Name', middleName);
        // Then fill First Name
        if(middleNameFilled){
            var firstNameFilled = fillInputByLabel("First Name", firstName);
            console.log(`First and middle names filled ${firstName}, ${middleName}`);
        }
        else{
            var firstNamemiddleNameFilled = fillInputByLabel("First Name", firstName + " " + middleName);
            console.log(`First Name filled with ${firstName + " " + middleName} : ${firstNamemiddleNameFilled}`);
        }
        return firstNameFilled;
      }

      const labels = Array.from(document.querySelectorAll('label'));
      const label = labels.find(el => el.textContent.includes(labelText));
      
      if (label) {
        const inputId = label.getAttribute('for');
        const input = document.getElementById(inputId) || 
                      label.closest('.field-container').querySelector('input, textarea');
        
        if (input) {
          // Store original value for comparison
          const originalValue = input.value;
          
          // Set the value
          input.value = value;
          
          // Trigger change events
          const events = ['input', 'change', 'blur'];
          events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            input.dispatchEvent(event);
          });

          // Wait a moment and verify the change
          return verifyInputChange(labelText, value, originalValue);
        }
      }
      
      console.log(`Could not find input for ${labelText}`);
      return false;
    }

    // Enhanced dropdown selection with verification
    function selectDropdownByLabel(labelText, value) {
      if (!value) return false;
      
      console.log(`Attempting to select ${value} for ${labelText}`);
      
      const labels = Array.from(document.querySelectorAll('label'));
      const label = labels.find(el => el.textContent.includes(labelText));
      console.log(`label for ${labelText} is ${label}`);
      if (label) {
        const dropdownId = label.getAttribute('for');
        const dropdownButton = document.getElementById(dropdownId);
        console.log(`dropdownId is ${dropdownId} and dropdown button is ${dropdownButton}`);
        if (dropdownButton && dropdownButton.tagName === 'BUTTON') {
          // Click the dropdown to open it
          dropdownButton.click();
          
          return new Promise((resolve) => {
            setTimeout(() => {
              const options = Array.from(document.querySelectorAll('[role="listbox"] [role="option"]'));
              const option = options.find(opt => opt.textContent.trim() === value);
              
              if (option) {
                option.click();
                
                // Verify change after a short delay
                setTimeout(() => {
                  const selectedText = dropdownButton.textContent.trim();
                  const isChanged = selectedText === value;
                  
                  console.log(`Dropdown ${labelText} verification:`, {
                    expectedValue: value,
                    currentValue: selectedText,
                    changed: isChanged
                  });
                  
                  resolve(isChanged);
                }, 500);
              } else {
                console.log(`Option "${value}" not found for ${labelText}`);
                resolve(false);
              }
            }, 500);
          });
        }
      }
      
      console.log(`Could not select dropdown for ${labelText}`);
      return Promise.resolve(false);
    }

    // Rest of the code remains the same as in the previous version...
    // (fillPersonalInfo, fillExperience, fillJobDetails functions)
    
    // Modify the existing functions to incorporate these new verification methods
    function fillPersonalInfo(personalInfo) {
      console.log("Filling Personal Information");
      //How did you hear about us?" - not working 
      //selectDropdownByLabel("How Did You Hear About Us?","LinkedIn");
      // Name fields
      fillInputByLabel("First and Middle Name", personalInfo.firstName + ',' + personalInfo.middleName);
      fillInputByLabel("Last Name", personalInfo.lastName);
      
      // Contact information
      fillInputByLabel("Email", personalInfo.email);
      
      // Phone details
      fillInputByLabel("Phone Device Type", personalInfo.phone.deviceType);
      fillInputByLabel("Country Phone Code", personalInfo.phone.countryCode);
      fillInputByLabel("Phone Number", personalInfo.phone.mobile);
      
      // Address fields
      fillInputByLabel("Address Line 1", personalInfo.address.addressLine1);
      fillInputByLabel("City", personalInfo.address.city);
      
      // Dropdown selections
      selectDropdownByLabel("State", personalInfo.address.state);
      fillInputByLabel("Postal Code", personalInfo.address.postalCode.toString());
    }

    //Add skills 
    async function addSkills(skills) {
        const skillsInput = document.getElementById('skills--skills');
        
        if (!skillsInput) {
            console.error('Skills input field not found');
            return false;
        }
        
        console.log("Fetched skills input field");
    
        // Process skills sequentially
        for (const skill of skills) {
            console.log(`Processing skill: ${skill}`);
            await simulateUserInteraction(skill);
        }
    
        async function simulateUserInteraction(skill) {
            try {
                // Step 1: Focus and click the input
                await clickAndFocus(skillsInput);
                
                // Step 2: Clear existing value
                await clearInput(skillsInput);
                
                // Step 3: Type the skill with realistic delays
                await typeText(skill, skillsInput);
                
                // Step 4: Press Enter
                await pressEnter(skillsInput);
                
                // Step 5: Wait for listbox and select first option
                await selectFirstOption();
                
                // Small delay before next skill
                await delay(500);
            } catch (error) {
                console.error(`Error processing skill ${skill}:`, error);
            }
        }
    
        async function clickAndFocus(input) {
            input.focus();
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            input.dispatchEvent(clickEvent);
            await delay(200);
        }
    
        async function clearInput(input) {
            input.value = '';
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
            await delay(200);
        }
    
        async function typeText(text, element) {
            element.focus();
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                element.value += char;
                
                // Dispatch all relevant events for this character
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    data: char,
                    inputType: 'insertText'
                });
                
                const keyDownEvent = new KeyboardEvent('keydown', {
                    key: char,
                    code: char === ' ' ? 'Space' : `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                    bubbles: true,
                    cancelable: true
                });
                
                const keyPressEvent = new KeyboardEvent('keypress', {
                    key: char,
                    code: char === ' ' ? 'Space' : `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                    bubbles: true,
                    cancelable: true
                });
                
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: char,
                    code: char === ' ' ? 'Space' : `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                    bubbles: true,
                    cancelable: true
                });
                
                element.dispatchEvent(keyDownEvent);
                element.dispatchEvent(keyPressEvent);
                element.dispatchEvent(inputEvent);
                element.dispatchEvent(keyUpEvent);
                
                // Random typing delay (50-150ms)
                await delay(Math.random() * 100 + 50);
            }
        }
    
        async function pressEnter(input) {
            const enterDown = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            
            const enterUp = new KeyboardEvent('keyup', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            
            input.dispatchEvent(enterDown);
            await delay(50);
            input.dispatchEvent(enterUp);
            await delay(500); // Wait for potential UI updates
        }
    
        async function selectFirstOption() {
            // Wait for the dropdown to appear
            const listContainer = await waitForElement('div[data-automation-id="activeListContainer"][role="listbox"]', 3000);
            
            if (!listContainer) {
                console.error('List container not found within timeout');
                return;
            }
            
            const firstOption = listContainer.querySelector('[data-automation-id="promptLeafNode"]');
            
            if (!firstOption) {
                console.error('No options found in the container');
                return;
            }
            
            const checkbox = firstOption.querySelector('input[type="checkbox"]');
            
            if (!checkbox) {
                console.error('Checkbox input not found in first option');
                return;
            }
            
            // Simulate a real click on the checkbox
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            firstOption.dispatchEvent(clickEvent);
            
            console.log('First checkbox option selected');
        }
    
        function waitForElement(selector, timeout = 3000) {
            return new Promise((resolve) => {
                const startTime = Date.now();
                
                const checkInterval = setInterval(() => {
                    const element = document.querySelector(selector);
                    
                    if (element) {
                        clearInterval(checkInterval);
                        resolve(element);
                    } else if (Date.now() - startTime >= timeout) {
                        clearInterval(checkInterval);
                        resolve(null);
                    }
                }, 100);
            });
        }
    }
    async function addExperience(workHistoryData) {
         
        // Find the Work Experience section
        const workExperienceSection = document.querySelector('h3[id="Work-Experience-section"]');
        console.log("Filling the work experience section");
        if (!workExperienceSection) {
            console.error("Work Experience section not found");
            return;
        }
        
        // Find the Add button within the section
        const addButton = workExperienceSection.nextElementSibling.querySelector('button[data-automation-id="add-button"]');
        
        if (!addButton) {
            console.error("Add button not found in Work Experience section");
            return;
        }
        
        // Click the Add button
        addButton.click();
        //section number with 1 indexed
        await delay(100);
        fillNExperience(1, workHistoryData[0], workExperienceSection);
        console.log("Filled first history");
        const addAnotherButton = parentElement.querySelector('button[data-automation-id="add-button"]');
        //click the add another button
        addAnotherButton.click();
        console.log("Another Add button clicked. Ready to populate");
        await delay(100);
        //fill the 2nd section number
        fillNExperience(2, workHistoryData[1], workExperienceSection);
        console.log("Filled second history");
        // Return true if successful
        return true;
    }

    //Fill in nth experience section using data : the n-1th part of the list of workHistory in the original json
    function fillNExperience(n, data, workExperienceSection){
        console.log(`fillNExperience Called for ${n}`);
        //because array is 0 indexed=>n-1
        const nWorkExDiv = getNthChildDiv(workExperienceSection.parentElement, n-1);
        console.log("FillNExperience received");
        console.log(workExperienceSection);
        console.log("parentElement of it is : ");
        console.log(workExperienceSection.parentElement);
        console.log("nWorkExDiv is ");
        console.log(nWorkExDiv);
        fillJobExperienceForm(nWorkExDiv, data);
    }
    //Fill particular job experience
    function fillJobExperienceForm(formElement, data) {
        console.log('Starting form fill process...');
        
        // Fill Job Title
        console.log(`Locating Job Title field with`);
        console.log(formElement);
        const jobTitleInput = formElement.querySelector('[id$="--jobTitle"]');
        if (jobTitleInput) {
          jobTitleInput.value = data.jobTitle || '';
          console.log(`Set Job Title to: ${data.jobTitle}`);
        } else {
          console.error('Job Title input not found');
        }
      
        // Fill Company
        const companyInput = formElement.querySelector('[id$="--companyName"]');
        if (companyInput) {
          companyInput.value = data.company || '';
          console.log(`Set Company to: ${data.company}`);
        } else {
          console.error('Company input not found');
        }
      
        // Handle current job checkbox
        const currentJobCheckbox = formElement.querySelector('[id$="--currentlyWorkHere"]');
        
        const isCurrentJob = data.toDate === "Present" || data.toDate === "present";
        console.log(`Current job status: ${isCurrentJob}`);
      
        if (currentJobCheckbox) {
          currentJobCheckbox.checked = isCurrentJob;
          console.log(`Set "I currently work here" checkbox to: ${isCurrentJob}`);
          
          // Trigger change event if needed
          const event = new Event('change');
          currentJobCheckbox.dispatchEvent(event);
        } else {
          console.error('Current job checkbox not found');
        }
        //Fill location
        const location = formElement.querySelector('[id$="--location"]');
        if(location){
            location.value = data.location;
        }
        // Fill Role Description
        const roleDescriptionTextarea = formElement.querySelector('[id$="--roleDescription"]');
        if (roleDescriptionTextarea) {
          const formattedDescription = data.roleDescription?.join('\n') || '';
          roleDescriptionTextarea.value = formattedDescription;
          console.log('Set Role Description with line breaks');
        } else {
          console.error('Role Description textarea not found');
        }
      
        console.log('Form fill process completed');
      }
      function getNthChildDiv(element, n) {
        console.log(`getNthChildDiv Called for ${n}, whose min value is 0`);
        if (!element || !element.children) return null;
        console.log("Get children with div for ");
        console.log(element);
        // Convert HTMLCollection to array and filter only DIVs
        const divChildren = Array.from(element.children).filter(
          child => child.tagName === 'DIV'
        );
        console.log("all childres : ");
        console.log(divChildren);
        return divChildren[n] || null; // Return nth div or null
      }
      //Fill education section
      async function addEducation(data){
        const educationSection = document.querySelector('h3[id="Education-section"]');
        console.log("Filling the education section");
        if (!educationSection) {
            console.error("Education Experience section not found");
            return;
        }
        // Find the Add button within the section
        const addButton = educationSection.nextElementSibling.querySelector('button[data-automation-id="add-button"]');
        if (!addButton) {
            console.error("Add button not found in Education section");
            return;
        }
        // Click the Add button
        addButton.click();
        //section number with 1 indexed
        await delay(500);
        fillNEducation(1, data[0], educationSection);
        const addAnotherButton = parentElement.querySelector('button[data-automation-id="add-button"]');
        //click the add another button
        await delay(500);
        addAnotherButton.click();
        //fill the 2nd section number
        fillNEducation(2, data[1], educationSection);
      }
      
      //Fill in nth experience section using data : the n-1th part of the list of workHistory in the original json
    function fillNEducation(n, data, educationSection){
        //because array is 0 indexed=>n-1
        const nEducationDiv = getNthChildDiv(educationSection.parentElement, n-1);
        fillEducationForm(nEducationDiv, data);
    }

      function fillEducationForm(formElement, data) {
        console.log('Starting education form fill process...');
        
        // Fill School/University Name
        const schoolInput = formElement.querySelector('[id$="--schoolName"]');
        if (schoolInput) {
          schoolInput.value = data.institution || '';
          console.log(`Set School/University to: ${data.institution}`);
          
          // Trigger input event to ensure any validation is triggered
          const event = new Event('input', { bubbles: true });
          schoolInput.dispatchEvent(event);
        } else {
          console.error('School/University input not found');
        }
      
        // Fill Degree
        const degreeButton = formElement.querySelector('[id$="--degree"]');
        if (degreeButton) {
          if (data.degree) {
            // This is a simplified approach - actual implementation might need to simulate dropdown selection
            degreeButton.value = data.degree;
            degreeButton.textContent = data.degree;
            degreeButton.setAttribute('aria-label', data.degree);
            
            console.log(`Set Degree to: ${data.degree}`);
            
            // Trigger change event
            const changeEvent = new Event('change', { bubbles: true });
            degreeButton.dispatchEvent(changeEvent);
          }
        } else {
          console.error('Degree dropdown button not found');
        }
      
        console.log('Education form fill process completed');
      }
})();