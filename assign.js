function courseDetails() {
 var len = arguments.length;
 if(len == 0) {
   Logger.log("courseDetails need to have one argument - the array of the row information");
   return;
 }
  
  var row = arguments[0][0];
  
  this.code = row[0];
  this.name = row[1];
  this.startGrade = row[2];
  this.endGrade = row[3];
  this.courseDay = row[4];
  this.maxSeats = row[5];
  this.startTime = row[6];
  this.endTime = row[7];
  this.description = row[8];
  this._enrolledSeats = 0;
  this._enrolledStudents = [];
  
  
  this.printCourseInfo = function() {
    Logger.log("Course" + this.name + "Max Seat: " + this. maxSeats + " Enrolled Seats :" + this._enrolledSeats + this._enrolledStudents);
  };
  
  //check the courseDay is correct
  this._checkCourseDay = function() {
    var len = arguments.length;
    if(len == 0) {
      Logger.log("checkCourseDay function needs an List to check");
      return;
    }
    var studentEnrolledCourseList = arguments[0];
    var studentName = arguments[1]; //only for debugging purposes
          
    for each (c in studentEnrolledCourseList) {
      if(this.courseDay == c.courseDay) {
        Logger.log("This course can not be assigned since student has chosen another course that falls on the same day");
        return(false);
      }
    }
    return(true);
  };
  
  //Check student course grade
  this._checkCourseGrade = function() {
    var len = arguments.length;
    if(len == 0) {
      Logger.log("checkCourseGrade function needs an single grade arguement to check");
      return;
    }
    var courseGrade = arguments[0];
    
    if (courseGrade < this.startGrade || courseGrade > this.endGrade) {
      var res = "Student Grade "+ courseGrade + " is not with in start grade " + this.startGrade + " and end grade " + this.endGrade ;
      Logger.log(res);
      return(false);
    }
    return(true);
  };
  
  this._checkCourseCode = function() {
    var len = arguments.length;
    if(len == 0) {
      Logger.log("checkCourseCode function needs an single code arguement to check");
      return;
    }
    var courseCode = arguments[0];
    if( this.code == courseCode) { 
      if (this._enrolledSeats < this.maxSeats)
        return(true);
      else {
        Logger.log("Course is full" + courseCode + " enrolled: " + this._enrolledSeats + " max: " + this.maxSeats);
        return(false);
      }
    }
    return(false);
  };
  
  
  this._IncrementEnrolledSeats = function() {
    if(this._enrolledSeats > this.maxSeats)
      Logger.log("Error: Calling to increment when the seats are full");
    this._enrolledSeats++;
  };
  
  this._EnrollStudent = function () {
    var len = arguments.length;
    if(len == 0) {
      Logger.log("_EnrollStudent function needs an single student name arguement to enroll");
      return;
    }
    var studentName = arguments[0];
    this._enrolledStudents.push(studentName);
  };
}


function studentApplication() {
  
  var len = arguments.length;
 if(len == 0) {
   Logger.log("courseDetails need to have one argument - the array of the row information");
   return;
 }
  
  var row = arguments[0][0];
  
  this.name = row[0];
  this.grade = row[1];
  this.choice = [];
  
  //Enhancement: Assign choices from least to most favorite
  for(var i = 2; i < 7; i++) {
    if(row[i] != '') {
      this.choice.push(row[i]);
    }
  }
  //this.choice = [row[2], row[3], row[4], row[5], row[6]];
  
  this._choiceIndex = 0;
  this._coursesAssigned = 0;
  this._maxChoices = 3;
  this._maxCourses = row[7];
  this._enrolledCourses = [];
  this._enrolledCoursesCode = [];
  
  
  this._PrintStudentApplicationInfo = function() {
    Logger.log("Name : " + this.name);
    Logger.log("Grade : " + this.grade);
    Logger.log("CourseChoice : " + this.choice);
  };
  
}

function readStudentApplicationSheet() {
  var len = arguments.length;
  if(len == 0) {
    Logger.log("readStudentApplicationSheet function needs an excel sheet to read");
    return;
  }
  var studentApplicationSheet = arguments[0];
  var lastRow = studentApplicationSheet.getLastRow();
  
  var studentArray = [];
  
  var rowNum=2;
  while (rowNum <= lastRow) {
    var tmp = "A" + rowNum + ":H" + rowNum;
    
    var feed1 = studentApplicationSheet.getRange(tmp);
    var t = new studentApplication(feed1.getValues());
    
    studentArray.push(t);
    rowNum++;
  }
  return studentArray;
}

 
function readCourseDetailsSheet() {
  var len = arguments.length;
  if(len == 0) {
    Logger.log("readCourseDetailsSheet function needs an excel sheet to read");
    return;
  }
  var coursedetailsSheet = arguments[0];
  var lastRow = coursedetailsSheet.getLastRow();
  
  
  var courseArray = [];
  
  var rowNum=2;
  while (rowNum <= lastRow) {
    var tmp = "A" + rowNum + ":I" + rowNum;
    
    var feed1 = coursedetailsSheet.getRange(tmp);
    var t = new courseDetails(feed1.getValues());
    
    courseArray.push(t);
    rowNum++;
  }
  return courseArray;
 }

function updateCourseDetailsSheet()
{
  var len = arguments.length;
  if(len == 0) {
    Logger.log("updateCourseDetailsSheet function needs an excel sheet and courseArray");
    return;
  }
  var coursedetailsSheet = arguments[0];
  var courseArray = arguments[1];
  var c;
  var lastRow = coursedetailsSheet.getLastRow();
  var rowNum=2;
  for each (c in courseArray) {
    var tmp = "J" + rowNum;
    
    var r1 = coursedetailsSheet.getRange(tmp);
    r1.setValue(c._enrolledSeats);
    
    tmp = "K" + rowNum;
    var r2 = coursedetailsSheet.getRange(tmp);
    r2.setValue(c._enrolledStudents.toString());
    
    rowNum++;
  }
}

function updateStudentApplicationShhet()
{
  var len = arguments.length;
  if(len == 0) {
    Logger.log("updateStudentApplicationSheet function needs an excel sheet and courseArray");
    return;
  }
  var studentAppSheet = arguments[0];
  var studentArray = arguments[1];
  
  var rowNum=2;
  
  var s;
  for each (s in studentArray) {
    var tmp = "I" + rowNum;
    
    var r1 = studentAppSheet.getRange(tmp);
    
    r1.setValue(s._enrolledCoursesCode.toString());
    
    rowNum++;    
  }
  

}


function main() {
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1av37dl7c-Zoahlg-_76aLjxu6M-nFHyVM0R8aoMPKCw/edit#gid=1800218277");
  Logger.log(ss.getName());
  
  var coursedetailsSheet = ss.getSheets()[0];
  Logger.log(coursedetailsSheet.getName());
  
  var studentAppSheet = ss.getSheets()[1];
  Logger.log(studentAppSheet.getName());
  
  var courseArray = readCourseDetailsSheet(coursedetailsSheet);
  
  var studentArray = readStudentApplicationSheet(studentAppSheet);

  var code;
  //assign students here
  //five choices allowed
  for(var i = 1; i < 6; i++) {
    Logger.log("Round " + i);
    var s;
    for each (s in studentArray) {
      if( s._coursesAssigned < s._maxCourses) {
   
        //Enhancement: Assign choices from least to most favorite
        var j = 0;
        if(s.choice.length - i > 0) {
          j = s.choice.length - i;
        }
          
        code = s.choice[j];
        //check for empty choices
        if(code != "") {
          //Logger.log("Trying to assign code" + code + " for student " + s.name);
          
          var c;
          for each (c in courseArray) {
            if(c._checkCourseCode(code)) {
              if(c._checkCourseGrade(s.grade)) {
                if(c._checkCourseDay(s._enrolledCourses, s.name)) {
                  canAssign = true;
                  s._coursesAssigned++;
                  c._IncrementEnrolledSeats();
                  c._EnrollStudent(s.name);
                  s._enrolledCourses.push(c);
                  s._enrolledCoursesCode.push(c.code);
                  break;
                }
              }
            }
          }
        }
      }
    }
  } 
  
  for each (t in courseArray) {
    //Logger.log(t.name);
    t.printCourseInfo();
  }
  
  updateCourseDetailsSheet(coursedetailsSheet, courseArray);
  updateStudentApplicationShhet(studentAppSheet, studentArray);
}
