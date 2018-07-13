// PROMPT
// In this assignment, you'll create a train schedule application that incorporates Firebase to host arrival and departure data.
// Your app will retrieve and manipulate this information with Moment.js.
// This website will provide up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station.

// ### Instructions
//
// * Make sure that your app suits this basic spec:
//
//   * When adding trains, administrators should be able to submit the following:
//
//     * Train Name
//
//     * Destination
//
//     * First Train Time -- in military time
//
//     * Frequency -- in minutes
//
//   * Code this app to calculate when the next train will arrive; this should be relative to the current time.
//
//   * Users from many different machines must be able to view same train times.
//
//   * Styling and theme are completely up to you. Get Creative!


// ### Bonus (Extra Challenges)
//
// Consider updating your "minutes to arrival" and "next train time" text once every minute.
// This is significantly more challenging; only attempt this if you've completed the actual activity and committed it somewhere on GitHub for safekeeping (and maybe create a second GitHub repo).
//
// Try adding `update` and `remove` buttons for each train. Let the user edit the row's elements--
// allow them to change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).
//
// As a final challenge, make it so that only users who log into the site with their Google or GitHub accounts can use your site.
// You'll need to read up on Firebase authentication for this bonus exercise.


// ====================================================================================================================================================================================================================
// BEGIN
// ====================================================================================================================================================================================================================

// This code will need to be executed when the DOM has fully loaded
// $(document).ready(function()
// {
//   // This function controls the timing and fade of our loading gif. This will last for 3 seconds.
//   $("#loader").delay(7000).fadeOut("fast");
// });



/* global firebase moment */

// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyA_QypGPkcjPtylRDscf7-HQl8ribnFeIs",
  authDomain: "time-sheet-55009.firebaseapp.com",
  databaseURL: "https://time-sheet-55009.firebaseio.com",
  storageBucket: "time-sheet-55009.appspot.com"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-employee-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var empName = $("#employee-name-input").val().trim();
  var empRole = $("#role-input").val().trim();
  var empStart = moment($("#start-input").val().trim(), "DD/MM/YY").format("X");
  var empRate = $("#rate-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newEmp = {
    name: empName,
    role: empRole,
    start: empStart,
    rate: empRate
  };

  // Uploads employee data to the database
  database.ref().push(newEmp);

  // Logs everything to console
  console.log(newEmp.name);
  console.log(newEmp.role);
  console.log(newEmp.start);
  console.log(newEmp.rate);

  // Alert
  alert("Employee successfully added");

  // Clears all of the text-boxes
  $("#employee-name-input").val("");
  $("#role-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var empName = childSnapshot.val().name;
  var empRole = childSnapshot.val().role;
  var empStart = childSnapshot.val().start;
  var empRate = childSnapshot.val().rate;

  // Employee Info
  console.log(empName);
  console.log(empRole);
  console.log(empStart);
  console.log(empRate);

  // Prettify the employee start
  var empStartPretty = moment.unix(empStart).format("MM/DD/YY");

  // Calculate the months worked using hardcore math
  // To calculate the months worked
  var empMonths = moment().diff(moment(empStart, "X"), "months");
  console.log(empMonths);

  // Calculate the total billed rate
  var empBilled = empMonths * empRate;
  console.log(empBilled);

  // Add each train's data into the table
  $("#employee-table > tbody").append("<tr><td>" + empName + "</td><td>" + empRole + "</td><td>" +
  empStartPretty + "</td><td>" + empMonths + "</td><td>" + empRate + "</td><td>" + empBilled + "</td></tr>");
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case




// ====================================================================================================================================================================================================================



  // Assume the following situations.

  // (TEST 1)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 3 minutes.
  // Assume the current time is 3:16 AM....
  // What time would the next train be...? (Use your brain first)
  // It would be 3:18 -- 2 minutes away

  // (TEST 2)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 7 minutes.
  // Assume the current time is 3:16 AM....
  // What time would the next train be...? (Use your brain first)
  // It would be 3:21 -- 5 minutes away


  // ==========================================================

  // Solved Mathematically
  // Test case 1:
  // 16 - 00 = 16
  // 16 % 3 = 1 (Modulus is the remainder)
  // 3 - 1 = 2 minutes away
  // 2 + 3:16 = 3:18

  // Solved Mathematically
  // Test case 2:
  // 16 - 00 = 16
  // 16 % 7 = 2 (Modulus is the remainder)
  // 7 - 2 = 5 minutes away
  // 5 + 3:16 = 3:21
  //



  // // Assumptions
  // var tFrequency = 3;
  //
  // // Time is 3:30 AM
  // var firstTime = "03:30";
  //
  // // First Time (pushed back 1 year to make sure it comes before current time)
  // var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  // console.log(firstTimeConverted);
  //
  // // Current Time
  // var currentTime = moment();
  // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  //
  // // Difference between the times
  // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);
  //
  // // Time apart (remainder)
  // var tRemainder = diffTime % tFrequency;
  // console.log(tRemainder);
  //
  // // Minute Until Train
  // var tMinutesTillTrain = tFrequency - tRemainder;
  // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  //
  // // Next Train
  // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
