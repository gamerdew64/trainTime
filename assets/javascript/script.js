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
  apiKey: "AIzaSyC918V-6qVdIohejYb1U7Nb7c-Sq-lQ0ws",
  authDomain: "traintime-409d3.firebaseapp.com",
  databaseURL: "https://traintime-409d3.firebaseio.com",
  projectId: "traintime-409d3",
  storageBucket: "",
  messagingSenderId: "779977122348"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var todayDate = moment($("#today-date-input").val().trim(), "DD/MM/YYYY").format("X");
  var firstTrain = moment($("#first-train-input").val().trim(), "h:mm A").format("HH:mm");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    date: todayDate,
    first: firstTrain,
    frequency: trainFrequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.date);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  // Alert
  alert("New Train Information Successfully Updated");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#today-date-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var todayDate = childSnapshot.val().date;
  var firstTrain = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;

  // Employee Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(todayDate);
  console.log(firstTrain);
  console.log(trainFrequency);

  // Prettify the employee start
  var todayDatePretty = moment.unix(todayDate).format("MM/DD/YYYY");

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + timeDifference);

  // Time apart (remainder)
  var timeRemainder = timeDifference % trainFrequency;
  console.log(timeRemainder);

  // Minute Until Train
  var timeMinutesTillTrain = trainFrequency - timeRemainder;
  console.log("MINUTES TILL TRAIN: " + timeMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(timeMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" +
  trainName + "</td><td>" +
  trainDestination + "</td><td>" +
  todayDatePretty + "</td><td>" +
  currentTime + "</td><td>" +
  // trainMonths + "</td><td>" +
  firstTrain + "</td><td>" +
  trainFrequency + " Minute(s)" + "</td><td>" +
  timeMinutesTillTrain + " Minute(s)" + "</td><td>");
  // trainBilled + "</td></tr>");
});
