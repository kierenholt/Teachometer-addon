//POST API 
//EXECUTES AS TEACHOMETER
function doPost(e) {  
  var data = e.parameter;
  //UPDATE RESPONSES
  if ("scores" in data) {
    writeToSheet(data["markbookId"], data["sheetId"], data["user"], JSON.parse(data["scores"]));
    return ContentService.createTextOutput("OK");
  }
  //NEW MARKSHEET
  else if ("uploadDataString" in data) {
    var ret = newMarksheet(data["uploadDataString"]);
    return ContentService.createTextOutput(JSON.stringify(ret));
  }
  //GENERATE NEW MARKBOOK generateMarkbook(teacherID, sowID, sowName)
  else if ("sowName" in data) {
    var ret = getFile(data["teacherId"], data["sowId"], data["sowName"]);
    return ContentService.createTextOutput(JSON.stringify(ret));
  }
  else {
    //SEND SETTINGS
    var settings = getMarkbookSettingsAndResponses(data["markbookId"],data["sheetId"],data["user"]);
    return ContentService.createTextOutput(JSON.stringify(settings));
  }
}


