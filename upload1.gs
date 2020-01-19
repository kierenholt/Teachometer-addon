//creates new sheet
//returns sheetName

function upload(uploadDataObject) {
   
  var userProperties = PropertiesService.getUserProperties();
  var prefix = SpreadsheetApp.getActiveSpreadsheet().getId();

  uploadDataObject.sowId = prefix;
  uploadDataObject.sowName = SpreadsheetApp.getActiveSpreadsheet().getName();
  uploadDataObject.teacherId = getTeacherId();
  uploadDataObject.studentNames = userProperties.getProperty(prefix + "studentNames");
  uploadDataObject.markbookSettings = getSettings(["shuffle-default","viewers-default","journal-mode-default",
                                      "append-default","remove-hyperlinks-default","mark-limit-default",
                                      "checks-limit-default","time-limit-default"],uploadDataObject.isTestMode);
  uploadDataObject.scoreSettings = getSettings(["correct-%-enabled","attempted-%-enabled","stars-%-enabled",
                              "correct-enabled","attempted-enabled","stars-enabled","outof-enabled"],false); //true or false
 
  Logger.log(JSON.stringify(uploadDataObject));
  var data = {
    "uploadDataString" : JSON.stringify(uploadDataObject) //this is how it likes to be used. it doesnt like strings for data or arrays for properties
  };
  var options = {
    'method' : 'post',
    'payload' : data
  };
  
  var dataString = UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty('MARKBOOK_UPDATE_API'), options);
  Logger.log(dataString);
  var ret = JSON.parse(dataString);
  
  //store for settings page
  userProperties.setProperty(prefix + "markbookId", ret["markbookId"]);
  userProperties.setProperty(prefix + "markbookUrl", ret["markbookUrl"]);
  userProperties.setProperty(prefix + "markbookName", ret["markbookName"]);
  userProperties.setProperty(prefix + "lessonUrl", ret["lessonUrl"]);
  userProperties.setProperty(prefix + "courseUrl", ret["courseUrl"]);
  userProperties.setProperty(prefix + "lessonName", uploadDataObject["name"]);
  
  return ret;
}
