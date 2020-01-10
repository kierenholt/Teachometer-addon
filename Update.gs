
function writeToSheet(workbookId, sheetName, user, scores) {

  var sheet = getSheet(workbookId, sheetName);
  
  var topRowValues = getTopRowValues(sheet);
  var userRow = getUserRow(sheet,user);
  var userValues = getUserRowValues(sheet,userRow);
  var userColors = getUserRowColors(sheet,userRow);
  
  
  //AGGREGATE COLUMNS
  scores.append({"name":"% Correct","value":Math.round(scores["Correct"]/scores["Out of"]*100)});
  scores.append({"name":"% Stars","value":Math.round(scores["Stars"]/scores["Out of"]*100)});
  scores.append({"name":"% Attempted","value":Math.round(scores["Attempted"]/scores["Out of"]*100)});
  
  //OTHER COLUMN HEADERS
  //"Checks remaining"
  //"Time remaining"
  
  for (var s = 0, score; score = scores[s]; s++) {
    var col = topRowValues.indexOf(score.name); //if name is in topRow then alter that cell 
    if (col > -1) {
      userValues[col] = score["value"];
      if ("color" in score) {
        userColors[col] = score["color"];
      }
    }
  }
  
  setUserRowValues(sheet,userRow,userValues);
  setUserRowColors(sheet,userRow,userColors);
}