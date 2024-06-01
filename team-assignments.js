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
