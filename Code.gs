
function AMEUser() {
  return "teachometer@gmail.com"; 
}

function onInstall() {
  onOpen();
}

function onOpen() {
  var menu = SpreadsheetApp.getUi().createAddonMenu();
  menu.addItem("Lesson builder", "showSidebar").addToUi();  // Run the showSidebar function when someone clicks the menu
  menu.addItem("Settings", "showSettings").addToUi();  // Run the showSidebar function when someone clicks the menu
  
  //menu.addItem("Homework checker", "showHomeworkChecker").addToUi();  
}

//assignment builder sidebar
function showSidebar() {
  var dialog = HtmlService.createTemplateFromFile("builder.html");
  dialog.author = Session.getActiveUser().getEmail();
  
  var html = dialog.evaluate().setTitle("Lesson builder"); // The title shows in the sidebar
  SpreadsheetApp.getUi().showSidebar(html);
}

//upload confirmation dialog
function showUploadConfirmation(paramUploadDataString) {
  var dialog = HtmlService.createTemplateFromFile("uploadConfirm.html");
  dialog.uploadDataString = paramUploadDataString;
  var html = dialog.evaluate().setWidth(600).setHeight(400).setTitle("upload"); // The title shows in the sidebar
  SpreadsheetApp.getUi().showModalDialog(html, "upload");
}

function showMessage(html,title) {  
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html), title);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
