
function doPost(e) {  
  var data = e.parameter;
  //UPDATE RESPONSES
  if ("scores" in data) {
    writeToSheet(data["workbookId"], data["sheetName"], data["user"], JSON.parse(data["scores"]));
    return ContentService.createTextOutput("OK");
  }
  else {
    //SEND SETTINGS
    var settings = getMarkbookSettingsAndResponses(data["workbookId"],data["sheetName"],data["user"]);
    return ContentService.createTextOutput(JSON.stringify(settings));
  }
}

//including responses
function getMarkbookSettingsAndResponses(workbookId,sheetName,user) {
  
  var sheet = getSheet(workbookId,sheetName);
  var settings = getMarkbookSettings(sheet);
  
  var userRow = getUserRow(sheet,user);
  var topRowValues = getTopRowValues(sheet);
  var userValues = getUserRowValues(sheet,userRow);
  
  var responses = {};
  for (var u = 2; u < userValues.length; u++) {
    if (userValues[u] !== "") {
      responses[topRowValues[u]] = userValues[u];
    }
  }
  settings["responses"] = responses;
  
  return settings;
  
  //access settings
  //"viewers"
  //"nobody","only those listed above","everybody"
  //if (settings["author"] != user && (settings["viewers"] == "nobody" || (settings["viewers"] == "only those listed above" && userRow == 0))) {
  //    return HtmlService.createHtmlOutput("permission denied for " + user);  
  //}
  
  //journal mode
/*  if (settings["journal mode"] == "ON") {

    //if user exists and no timestamp, use same row
    if (userRow > 0 && sheet.getRange(userRow,3).getValue() == "") {
      
    }
    else {
      // Get a script lock, because we're about to modify a shared resource.
      var lock = LockService.getScriptLock();
      // Wait for up to 5 seconds for other processes to finish.
      lock.waitLock(5000);
      
      var metaData = sheet.createDeveloperMetadataFinder().withKey("settingsRow").find()[0];
      var settingsRow = Number(metaData.getValue());
      Logger.log(settingsRow);
      sheet.insertRowBefore(settingsRow);
      metaData.setValue(settingsRow+1);
      // Release the lock so that other processes can continue.
      lock.releaseLock();
      
      userRow = settingsRow;
      sheet.getRange(userRow,2).setValue(user);
      sheet.getRange(userRow,1).setValue(userName);
    }
    
  }
  
  //set timestamp
  if (userRow > 0) {
    sheet.getRange(userRow,3).setValue(new Date());
  }*/
  
}


