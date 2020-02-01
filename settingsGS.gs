function showSettings() {
  
  var dialog = HtmlService.createTemplateFromFile("settings.html");
  
  var userProperties = PropertiesService.getUserProperties();
  var prefix = SpreadsheetApp.getActiveSpreadsheet().getId();
  
  //workbook
  dialog.markbookUrl = userProperties.getProperty(prefix + "markbookUrl");
  dialog.markbookName = userProperties.getProperty(prefix + "markbookName");
  dialog.courseUrl = userProperties.getProperty(prefix + "courseUrl");
  dialog.lessonUrl = userProperties.getProperty(prefix + "lessonUrl");
  dialog.lessonName = userProperties.getProperty(prefix + "lessonName");
  
  //students
  dialog.studentNames = userProperties.getProperty(prefix + "studentNames");
  
  var html = dialog.evaluate().setWidth(600).setHeight(400).setTitle("settings"); // The title shows in the sidebar
  
  SpreadsheetApp.getUi().showModalDialog(html, "settings");
}

function settingToHTMLElement(settings) { //name: {validation: <>, value: <>}
  buffer = "<table>"
  for (var name in settings) {
    buffer += "<tr>";
    buffer += "<td>" + settings[name]["textBeforeElement"] +":</td><td>" ;
    
    if (settings[name]["element"] == ["select"]) {
      buffer += "<select name='"+name+"' onchange='saveSetting(this)'>"
      for (var j = 0; j < settings[name].validation.length; j++) {
        buffer += "<option value='"+settings[name].validation[j]+"'"; 
        if (settings[name].validation[j] == settings[name].value) { buffer += " selected " }
        buffer += ">"+settings[name].validation[j] + "</option>";
      }
      buffer += "</select>";
    }
    if (settings[name]["element"] == ["input"]) {
      buffer += "<input type='text' style='width:5em' name='"+name+"' value='"+settings[name].value+"' onblur='saveSetting(this)'/>"; 
    }
    if (settings[name]["element"] == ["checkbox"]) {
        buffer += "<input type='checkbox' name='"+name+"'";
      if (settings[name].value) { buffer += " checked " }
        buffer += " onclick='saveSetting(this)'/>";
    }
    
    if (settings[name]["long description"]) {
      buffer += "<img src='http://www.teachometer.co.uk/help16x16.png' title='" + settings[name]["long description"] + "'/>";
    }
    buffer += "</td></tr>";
  }
  buffer += "</table>";
  return HtmlService.createHtmlOutput(buffer).getContent();
}


//NO SPACES OR SYMBOLS IN THE NAME
function getSettings(names, isTestMode) {
  var ret = {};
  defaultValues = {
    
    "correct-%-enabled":{"value":true,"element":"checkbox","textBeforeElement":"% Correct","long description":""},
    "attempted-%-enabled":{"value":false,"element":"checkbox","textBeforeElement":"% Attempted","long description":""},
    "stars-%-enabled":{"value":false,"element":"checkbox","textBeforeElement":"% Stars","long description":""},
    "correct-enabled":{"value":true,"element":"checkbox","textBeforeElement":"Correct","long description":""},
    "attempted-enabled":{"value":false,"element":"checkbox","textBeforeElement":"Attempted","long description":""},
    "stars-enabled":{"value":false,"element":"checkbox","textBeforeElement":"Stars","long description":""},
    "outof-enabled":{"value":false,"element":"checkbox","textBeforeElement":"Out of","long description":""},
    
    "shuffle-default":{"value":false,"element":"checkbox","textBeforeElement":"shuffle questions","long description":"randomly shuffle the questions for each student"},
    "visible-default":{"value":true,"element":"checkbox","textBeforeElement":"visible","long description":"check this box to allow students to access the lesson, uncheck to hide it"},
    "journal-mode-default":{"value":false,"element":"checkbox","textBeforeElement":"journal mode","long description":"Every time a student visits the lesson page, a new row is added in the markbook for their responses. If they refresh the page this also starts a new row"},
    "append-default":{"value":false,"element":"checkbox","textBeforeElement":"append mode","long description":"add student responses to the end of a list in each cell rather than overwriting the cell contents each time"},
    "remove-hyperlinks-default":{"value":false,"element":"checkbox","textBeforeElement":"remove hyperlinks","long description":"remove all hyperlinks from the lesson webpage. Good for tests"},
    "mark-limit-default":{"value":-1,"element":"input","textBeforeElement":"mark limit","long description":"truncate questions to add up to the specified number of marks. Good for tests. set to -1 to disable this option."},
    "checks-limit-default":{"value":-1,"element":"input","textBeforeElement":"checks limit","long description":"limit the number of checks each student can make, when zero checks remain, the quiz will deactivate. set to -1 to disable this option."},
    "time-limit-default":{"value":-1,"element":"input","textBeforeElement":"time limit","long description":"a time limit will activate when students load the lesson page. set to -1 to disable this option."},
    
    "print-show-solutions":{"value":true,"element":"checkbox","textBeforeElement":"show solutions","long description":""},
    "print-jumbled-solutions":{"value":false,"element":"checkbox","textBeforeElement":"show jumbled solutions","long description":""},
    "print-show-titles":{"value":true,"element":"checkbox","textBeforeElement":"show question titles","long description":""},
    "print-every-question-new-page":{"value":false,"element":"checkbox","textBeforeElement":"every question on a new page","long description":""},
  };
  var userProperties = PropertiesService.getUserProperties();
  var prefix = SpreadsheetApp.getActiveSpreadsheet().getId();
  for (var i = 0, name; name = names[i]; i++) {
    if (!defaultValues[name]) { throw("setting with name "+name+"not found"); }
    ret[name] = defaultValues[name];
    var value = userProperties.getProperty(prefix + name);
    if (value != null) {
      if (value == "true") { value = true; }
      if (value == "false") { value = false; }
      ret[name]["value"] = value;
    }
  }
  if (isTestMode) {
    testModeDefaults = {    
      "shuffle-default":{"value":true},
      "visible-default":{"value":false},
      "journal-mode-default":{"value":false},
      "append-default":{"value":false},
      "remove-hyperlinks-default":{"value":true},
      "mark-limit-default":{"value":40},
      "checks-limit-default":{"value":1},
      "time-limit-default":{"value":30}
    };
    for (var key in testModeDefaults) {
      if (key in ret) {
        ret[key]["value"] = testModeDefaults[key]["value"];
      }
    }
  }
  return ret;
}


function saveSettings(obj) {
  var userProperties = PropertiesService.getUserProperties(); 
  var prefix = SpreadsheetApp.getActiveSpreadsheet().getId();
  for (var name in obj) {
    userProperties.setProperty(prefix + name, obj[name]);
  }
}


function resetAllSettings() {
  var userProperties = PropertiesService.getUserProperties();
  var keys = userProperties.getKeys();
  var prefix = SpreadsheetApp.getActiveSpreadsheet().getId();
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].substr(0,prefix.length) == prefix) {
      userProperties.deleteProperty(keys[i]);
    }
  }
}


function saveStudents(studentNames) {
  var userProperties = PropertiesService.getUserProperties(); 
  var prefix = SpreadsheetApp.getActiveSpreadsheet().getId();
  userProperties.setProperty(prefix + "studentNames", studentNames);
}

