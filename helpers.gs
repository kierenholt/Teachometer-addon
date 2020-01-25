function escapeNonAlphaNumeric(str) {
  var code, i, len;
  var ret = "";
  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    //alpha;
    if ((code > 47 && code < 58) || // numeric (0-9)
        (code > 64 && code < 91) || // upper alpha (A-Z)
        (code > 96 && code < 123)) { // lower alpha (a-z)
      ret += str[i];
    }
    //non alpha
    else {
      ret += "-";
    }
  }
  return ret;
};

//TO FORMAT 2D ARRAYS INTO HTML TABLES
function arrayToHTMLTable(arr) {
  var rows = arr.map(function(r) {return "<td>"+r.join("</td><td>")+"</td>"});
  return "<table><tr>"+rows.join("</tr><tr>")+"</tr></table>";
}


//TO GET ROW DATA FROM SCHEMES OF WORK
//gets the purpose etc. column indexes
function getColNums() {
  colNames = ["purpose","left content", "right content", "title", "comment"];
  return colNames.map(function(n) { 
    var ret = getColNum(n);
    if (ret == -1) { throw new Error("Teachometer could not find a column header with value '" + n + "' in row 1 of the active sheet"); }
    return ret;
  });
}

//return column index given name of column
function getColNum(name) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var lastCol = sheet.getLastColumn();
    var values = sheet.getRange(1, 1, 1, lastCol).getValues();
    return values[0].indexOf(name); 
}

//returns row object data from spreadsheet 
function getSelectedRows() {
  
  var colNums = getColNums();
  var maxCol = Math.max.apply(null, colNums);
  
  var selected = SpreadsheetApp.getActiveRange();
  var rowIndex = selected.getRow();
  var numRows = selected.getNumRows();
  
  var values = SpreadsheetApp.getActiveSheet().getRange(rowIndex, 1, numRows, maxCol+1).getValues();
  
  var retVal = [];
  for (var r = 0; r < values.length; r++) {
    var row = {
      "purpose" : String(values[r][colNums[0]]),
      "leftRight" : [String(values[r][colNums[1]]), String(values[r][colNums[2]])],
      "title" : String(values[r][colNums[3]]),
      "comment" : String(values[r][colNums[4]])
    };
    if (row.purpose != "") {
      retVal.push(row);
    }
  }

  return retVal;
}



function enc(str) {
    var encoded = "";
    for (i=0; i<str.length;i++) {
        var a = str.charCodeAt(i);
        var b = a ^ 147;    // bitwise XOR with any number, e.g. 123
        encoded = encoded+String.fromCharCode(b);
    }
    return encoded;
}

function startsWith(a,ai,b,bi) {
  if (ai == 0 && bi != 0) {
    return false;
  }
  if (bi == 0) {
    return a[ai] == b[bi];
  }
  return a[ai] == b[bi] && startsWith(a,ai-1,b,bi-1);
}

function replaceAll(within,toReplace,replaceWith) {
  ret = "";
  i = 0;
  toReplaceLength = toReplace.length;
  while (i + toReplaceLength <= within.length) {
    if (startsWith(within,i+toReplaceLength-1,toReplace,toReplaceLength-1)) {
      ret += replaceWith;
      i+=toReplaceLength;
    }
    else {
      ret += within[i];
      i+= 1;
    }
  } 
  return ret;
}

function batch(arr,n) {
  i = 0;
  ret = [];
  while (i < arr.length)  {
    ret.push([]);
    for (var j = 0; j < n && i+j < arr.length; j++) {
      ret[ret.length-1].push(arr[i+j]);      
    }
    i += j;
  }
  return ret;
}

function generateId() {
  var x = Math.floor(Math.random() * 1000000000000000000000000000000000);
  return getDigits(x);
}

function getDigits(n) {
  if (n == 0) { return ""}
  return getDigits(Math.floor(n/10)) + String(n%10)
}