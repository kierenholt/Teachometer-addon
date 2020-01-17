
//slideData must be array of string arrays e.g. [["slide1","content1"],["slide2","content2"]] 
function getRevealHTML() {
  return HtmlService.createHtmlOutputFromFile("reveal.html").getContent();
}