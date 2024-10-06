# CyberDragons OWASP5 Workshop

![image](https://github.com/user-attachments/assets/e5905f4b-3de0-48a4-a66a-4a2245e3b633)

## Introduction
Welcome to the CyberDragons OWASP5 Workshop! In this hands-on event, two teams will compete head-to-head to navigate the vulnerabilities present in the OWASP Juice Shop application. Each team will strive to exploit as many vulnerabilities as possible within a set timeframe, putting their skills and knowledge to the test in a fun and challenging environment. The Juice Shop, known for its rich set of security flaws and issues, is the perfect playground to sharpen your skills and learn about real-world application security threats in web development!

### *Why OWASP5 and not OWASP10?*
The specific slides we reviewed leading up to these workshops only covered the top five, not the top ten, unfortunately. However, OWASP Juice Shop does cover OWASP10!

## Overview
This repository contains the resources and scripts used to automate the creation of user accounts and virtual machines for the OWASP5 workshop. Using a combination of Google Forms, Google Sheets, Google Apps Script, and Apache Guacamole, this process allows workshop participants to access Kali Linux instances remotely via their browser with minimal manual intervention. 

### Workshop Workflow Summary (tl;dr)

1. **Google Form**: Participants sign up via a form, and responses are populated in a Google Sheet.
2. **Google Apps Script**: Automates the team division and password generation, populating another sheet with login credentials.
3. **Guacamole Setup**: Apache Guacamole instances are configured to allow remote access to Kali Linux VMs.
4. **User Creation**: Python and Google Cloud API are used to automate user account creation and setup.
5. **Workshop Execution**: Participants access their designated virtual machines and complete the workshop tasks.

## Steps to Set Up and Reproduce

### 1. Create Sign-Up Form
Start by creating a Google Form for participants to sign up for the workshop. The responses should be populated into a Google Sheet, which will be used for further automation.

- Use Google Apps Script to automatically assign teams and generate random passwords for each participant upon submission. The script will populate these values in the designated columns. You can find an example script [here](https://github.com/anishgoyal1108/OWASP5-Workshop/blob/main/team-assignments.js) (it's also below):
- Make sure to get the IDs of the sheet and form correctly! You can find them in the URL.

```js
var sheet = SpreadsheetApp.openById('127tfOUFWpw5MMWCanvuNBexCkUhFnshiWSMvn3F3N1c');
var form = FormApp.openById('1v32RV-qi4y18OSAMdtasi8SBF_mTvNUY03j7R9jeCfc');

function emailAndGenerateLogins() {
  var teams = JSON.parse(PropertiesService.getScriptProperties().getProperty('teams'));
  var logins = JSON.parse(PropertiesService.getScriptProperties().getProperty('logins'));
  for (var i = 0; i < teams.length; i++) {
    var teamNumber = i+1;
    for (var j = 0; j < teams[i].length; j++) {
      var emailSubject = "OWASP10 Workshop Login";
      var name = teams[i][j]["fullName"].toLowerCase();
      var username = name[0] + name.substring(name.indexOf(" ")+1, name.indexOf(" ")+6);
      var password = randomStr();
      logins.push({ username: username, password: password });
      PropertiesService.getScriptProperties().setProperty('logins', JSON.stringify(logins));
      var emailBody = "Hello " + teams[i][j]["fullName"] + "!\n\n";
      emailBody += "Your login for the OWASP10 Workshop is:\n";
      emailBody += "Username: " + username + "\n";
      emailBody += "Password: " + password + "\n\n";
      emailBody += "You are part of Team " + teamNumber + ". You can access the competition instance by logging in at  99.66.220.97:8080\n"
      emailBody += "This login is specifically for you, so please do not share it with anyone. Best of luck!";
      MailApp.sendEmail(teams[i][j]["email"], emailSubject, emailBody);
    }
  }
  sheet.getSheetByName('Logins').getRange("A:D").clear();
  console.log(teams);
  for (var i = 0; i < logins.length - teams[1].length; i++) {
    sheet.getSheetByName('Logins').getRange(i+1, 1).setValue(logins[i]["username"]);
    sheet.getSheetByName('Logins').getRange(i+1, 2).setValue(logins[i]["password"]);
  }
  for (var i = 0; i < teams[1].length; i++) {
    sheet.getSheetByName('Logins').getRange(i+1, 3).setValue(logins[logins.length - teams[1].length + i]["username"]);
    sheet.getSheetByName('Logins').getRange(i+1, 4).setValue(logins[logins.length - teams[1].length + i]["password"]);
  }
}

function randomStr(m) {
    var m = 8 || 15; s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
    return(s);
};

function populateTeams() {
  var formResponses = form.getResponses();
  var membersList = [];

  // retrieve all form responses
  for (var i = 0; i < formResponses.length; i++) {
    var response = formResponses[i];
    var fullName = response.getItemResponses()[0].getResponse().toString().trim();
    var email = response.getRespondentEmail();
    var timestamp = response.getTimestamp();
    
    // check timestamp
    if (timestamp.toString().includes("Fri Feb 09 2024"))
      membersList.push({ fullName: fullName, email: email });
  }

  // randomize responses
  for (var i = membersList.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = membersList[i];
    membersList[i] = membersList[j];
    membersList[j] = temp;
  }
  
  // divide responses into teams
  var teamSize = Math.ceil(membersList.length / 2);
  var teams = [];
  for (let i = 0; i < membersList.length; i += teamSize) {
    const chunk = membersList.slice(i, i + teamSize);
    teams.push(chunk);
  }

  // output teams on google sheet
  for (var i = 0; i < teams.length; i++) {
    if (i == 0) sheet.getSheetByName('Assignments').getRange(5, i+1).setValue("Team " + (i + 1)).setFontWeight("bold");
    else sheet.getSheetByName('Assignments').getRange(5, i+2).setValue("Team " + (i + 1)).setFontWeight("bold");
    for (var j = 0; j < teams[i].length; j++) {
      if (i == 0) sheet.getSheetByName('Assignments').getRange(5 + j + 1, (i + 1)).setValue(teams[i][j].fullName);
      else sheet.getSheetByName('Assignments').getRange(5 + j + 1, (i + 2)).setValue(teams[i][j].fullName);
    }
  }

  // initialize global variable for the teams
  PropertiesService.getScriptProperties().setProperty('teams', JSON.stringify(teams));
  PropertiesService.getScriptProperties().setProperty('logins', JSON.stringify([]));
}
```

![Google Form](https://github.com/anishgoyal1108/OWASP5-Workshop/assets/90469168/3fc58c49-814d-48c6-bd2b-535a93b7dadf)

![Main Sheet](https://github.com/anishgoyal1108/OWASP5-Workshop/assets/90469168/dbab564a-576e-4fb9-8a5d-5a99d1a94528)

### 2. Set Up Google Cloud Service Worker
To handle the automation, create a Google Cloud service worker with the appropriate scopes (Google Drive and Sheets API). Download the service worker's secret token JSON file, as it will be used in later steps.

### 3. Automate Account Creation via Jupyter Notebook
Adjust the cells in this [Jupyter Notebook](https://github.com/anishgoyal1108/OWASP5-Workshop/blob/main/Guacamole%20REST%20API/Main.ipynb), which automates user account creation on Apache Guacamole. You may need to customize connection types, IP addresses, and ports depending on your setup.

- Note: If you're cloning this repo for your own use, it's recommended to clear the Guacamole container cache or even rebuild the container to avoid conflicts with previous configurations.

### 4. Configure Kali Linux Instances
For the workshop, configure two Kali Linux virtual machines running `xvncserver` as a service. Assign each team to their respective Kali instance based on the team divisions in the Google Sheet. Ensure you adjust for different network configurations (IP, ports, etc.).

### 5. Hardware and Bandwidth Considerations
Make sure to run the workshop on hardware capable of handling multiple user sessions. If not possible, consider limiting the connection types and implementing bandwidth-saving techniques. For more advanced configurations, study the [Guacamole REST API documentation](https://github.com/ridvanaltun/guacamole-rest-api-documentation/tree/master).

### 6. Automate User Creation on VMs
Use the Google Cloud service worker to automate the user creation on the virtual machines. The script, available [here](https://github.com/anishgoyal1108/OWASP5-Workshop/blob/main/user_initialization_script.py) (or below), will:
- Copy necessary files from the root folder into each user’s desktop.
- Add users to `/etc/passwd`.
- Assign each user their randomly generated password (from the Google Sheet).
- Add users to the RDP group.

```python
# Run this script on each container you will be using for the workshop!
# Remember, you must run this script within the CONTAINERS! Plz dont run this on your own machine
# Also, it uses the same service account secret so make sure the json file is available too

import gspread
import os
from oauth2client.service_account import ServiceAccountCredentials

# Define the scope and credentials
scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('service_account_secret.json', scope)

# Authorize the client
client = gspread.authorize(creds)

# Open the Google Sheet by its ID
sheet = client.open_by_key('127tfOUFWpw5MMWCanvuNBexCkUhFnshiWSMvn3F3N1c')
worksheet = sheet.worksheet('Logins')

# Get all values from columns A/B and C/D
usernames = worksheet.col_values(3)
passwords = worksheet.col_values(4)

# Create key-value pairs
login_info = dict(zip(usernames[:], passwords[:]))

for username, password in login_info.items():
    # create user with given password
    os.system(f'useradd -s /usr/bin/zsh -m -p $(openssl passwd -1 {password}) {username}')
    # create desktop directory
    os.system(f'mkdir /home/{username}/Desktop')
    # copy all files from root desktop to user's desktop
    os.system(f'cp -r /root/Desktop/* /home/{username}/Desktop/')
    # make the file world-readable
    os.system(f'chmod 777 /home/{username}/Desktop/README')
    # add user to group rdp
    os.system(f'usermod -a -G rdp {username}')
```

### 7. Profit!
Once the above steps are completed, participants can log in to their assigned Kali Linux instances via Guacamole, and the workshop can proceed.

![image](https://github.com/user-attachments/assets/e9867b21-e219-4d1a-ae7a-ce34573e3888)


---

## Takeaways and Lessons Learned

### 1. **Scalability**:
   - Running multiple VNC or RDP sessions on a single machine can cause performance issues. It's important to consider resource allocation if many users will be logging in simultaneously.
   - VNC proved to be more efficient than RDP in terms of bandwidth and reliability. Future workshops should prefer VNC for remote desktop connections.

### 2. **Automation Gaps**:
   - Some manual steps were still required, such as running the user creation script on each virtual machine. Further automation could be achieved by developing a more robust deployment pipeline for VM setup.

### 3. **Security**:
   - Protecting the login Google Sheet and ensuring the security of generated credentials is crucial. In future versions, this process could be further enhanced by integrating multi-factor authentication (MFA) or other security measures.

## Future Suggestions

### 1. **Infrastructure Enhancements**:
   - To improve the user experience and scalability, migrating from personal hardware to cloud-based infrastructure (e.g., using AWS or Google Cloud VMs) would enable better performance for multiple concurrent sessions.

### 2. **Enhanced Automation**:
   - Automating the VM setup, including user creation and Guacamole integration, via a CI/CD pipeline would reduce manual interventions and speed up the deployment process.
   - Implementing Ansible or Terraform scripts to provision infrastructure as code could also streamline the setup for future workshops.

### 3. **Monitoring and Support**:
   - For future workshops, real-time monitoring of the VM instances and the Guacamole server can ensure quick troubleshooting if issues arise. Integrating logs and alert systems could prevent downtime during the workshop.

### 4. **SWITCH TO PROXMOX ALREADY**!
   - I set up this repository because I didn't have the computing resources to create a Proxmox server. Using Apache Guacamole on a Docker container to VNC/RDP into a virtual machine is less than ideal when you can have 10x better performance on Proxmox. I'll say it again: USE PROXMOX!

### 5. **Implement automatic score tracking?**
   - Currently, there is no way to track the progress for both teams automatically. During the workshop and the mini-competition period, I meticulously tracked the progress of all registered users, including how far they got in Juice Shop, and how much time they spent working overall, to award prizes. If there was a way to track this automatically, perhaps through a custom scoring engine built into Juice Shop, that would be great, as I created a personal spreadsheet to determine which team was the winning team overall.

## Acknowledgements
Thank you to OWASP for creating [Juice Shop](https://github.com/juice-shop/juice-shop), which is the full basis for this workshop and its challenges.
