
function getSheet(workbookId, sheetName) {
  var workbook = SpreadsheetApp.openById(workbookId);
  
  if (workbook == null) {
    throw("workbook with Id: " + workbookId + " not found"); 
  }
  var sheet = workbook.getSheetByName(sheetName);
  if (sheet == null)  {
    throw("sheet with name: " + sheetName + " not found"); 
  } 
  return sheet;
}

function getTopRowValues(sheet) {
 return sheet.getRange('1:1').getValues()[0]; 
}

function getUserRow(sheet,user) {
  var secondColValues  = sheet.getRange('B:B').getValues();
  secondColValues = secondColValues.map(function(a) {return a[0]});
  return secondColValues.indexOf(user)+1;
}

function getUserRowValues(sheet,userRow) {
  return sheet.getRange(userRow+":"+userRow).getValues()[0];  //[[row1],[row2]]
}

function setUserRowValues(sheet,userRow,values) {
  return sheet.getRange(userRow+":"+userRow).setValues([values]); 
}

function getUserRowColors(sheet,userRow) {
  return sheet.getRange(userRow+":"+userRow).getBackgrounds()[0];  //[[row1],[row2]]
}

function setUserRowColors(sheet,userRow,values) {
  return sheet.getRange(userRow+":"+userRow).setBackgrounds([values]); 
}

function getMarkbookSettings(sheet) {
  var firstSecondColValues  = sheet.getRange('A:B').getValues();
  var firstColValues = firstSecondColValues.map(function(a) {return a[0]});
  var secondColValues = firstSecondColValues.map(function(a) {return a[1]});
  var ret = {};
  
  //settings
  var settingsIndex = firstColValues.indexOf("***QUIZ INFO***");
  if (settingsIndex > -1) {
    for (var i = settingsIndex; i < firstColValues.length; i++) {
      if (firstColValues[i]) {
        ret[firstColValues[i]] = secondColValues[i];
      }
    }
  } 
  return ret;
}

