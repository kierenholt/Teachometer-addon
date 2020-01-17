//creates new sheet
//returns sheetName

function upload(uploadDataObject) {
   
  var userProperties = PropertiesService.getUserProperties();
  var prefix = SpreadsheetApp.getActiveSpreadsheet().getId();
  
  uploadDataObject.markbookId = getMarkbook().getId();
  uploadDataObject.teacherId = getTeacherId();
  uploadDataObject.studentNames = userProperties.getProperty(prefix + "studentNames");
  uploadDataObject.markbookSettings = getSettings(["shuffle-default","viewers-default","journal-mode-default",
                                      "append-default","remove-hyperlinks-default","mark-limit-default",
                                      "checks-limit-default","time-limit-default"],uploadDataObject.isTestMode);
  uploadDataObject.scoreSettings = getSettings(["correct-%-enabled","attempted-%-enabled","stars-%-enabled",
                              "correct-enabled","attempted-enabled","stars-enabled","outof-enabled"],false); //true or false
 
  var data = {
    "uploadDataString" : JSON.stringify(uploadDataObject) //this is how it likes to be used. it doesnt like strings for data or arrays for properties
  };
  var options = {
    'method' : 'post',
    'payload' : data
  };
  
  var ret = UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty('MARKBOOK_UPDATE_API'), options);
  //Logger.log(ret);
  return JSON.parse(ret);
}


function getMarkbook() {
  var userProperties = PropertiesService.getUserProperties();
  var prefix = SpreadsheetApp.getActiveSpreadsheet().getId();
  var markbookId = userProperties.getProperty(prefix + "markbookId");
  var markbook = SpreadsheetApp.openById(markbookId);

  if (markbook == null) {
    var ret = generateMarkbook(); //returns {markbookId, markbookUrl, markbookName}
    markbookId = ret.markbookId;
    markbook = SpreadsheetApp.openById(markbookId);
  }
  return markbook;
}

function generateMarkbook() {
  var data = {
    "teacherId" : getTeacherId(),
    "sowId" : SpreadsheetApp.getActiveSpreadsheet().getId(),
    "sowName" : SpreadsheetApp.getActiveSpreadsheet().getName()
  };
  var options = {
    'method' : 'post',
    'payload' : data
  };
  
  //URL TO MARKBOOK UPDATE SCRIPT
  //returns {markbookName, markbookUrl, markbookId}
  var ret = JSON.parse(UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty('MARKBOOK_UPDATE_API'), options));
 
  var userProperties = PropertiesService.getUserProperties();
  var prefix = SpreadsheetApp.getActiveSpreadsheet().getId();
  
  userProperties.setProperty(prefix + "markbookId", ret["markbookId"]);
  userProperties.setProperty(prefix + "markbookUrl", ret["markbookUrl"]);
  userProperties.setProperty(prefix + "markbookName", ret["markbookName"]);
  return ret;
}