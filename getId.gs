function getTeacherId() {
  var userProperties = PropertiesService.getUserProperties();
  var ret = userProperties.getProperty("teacherId");
  if (ret == null) {
    ret = generateId();
    userProperties.setProperty("teacherId",ret);
  }
  Logger.log(ret); //teachometer account  844512473856267844408468608826640
  return ret;
}

function resetTeacherId() {
  var userProperties = PropertiesService.getUserProperties();
  var ret = userProperties.deleteProperty("teacherId");
}