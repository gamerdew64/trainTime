// ====================================================================================================================================================================================================================
// BEGIN
// ====================================================================================================================================================================================================================

// This code will need to be executed when the DOM has fully loaded
$(document).ready(function()
{
  // This function controls the timing and fade of our loading gif. This will last for 3 seconds.
  $("#loader").delay(5000).fadeOut("fast");
});

// Initialize Firebase
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

// This is the button associated with the submit type that for adds trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Collecting input from user
  // The todayDate and firstTrain variables use moment.js for assistance in converting the date
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var todayDate = moment($("#today-date-input").val().trim(), "DD/MM/YYYY").format("X");
  var firstTrain = moment($("#first-train-input").val().trim(), "h:mm A").format("HH:mm");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creating a new local "temporary" object for that holds train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    date: todayDate,
    first: firstTrain,
    frequency: trainFrequency
  };

  // Uploading this train data to the Firebase database
  database.ref().push(newTrain);

  // Logging everything to the console
  // This could be uncommented, but it is good to keep so that it is easy to verify the behavior in both Firebase and the console.
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.date);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  // Alerting the user that the new train information has been successfully updated
  alert("New Train Information Successfully Updated");

  // Clearing out all of the text-boxes by setting the values to an empty string
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#today-date-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// Create Firebase event for adding train information to the Firebase database and a row in the html when a user adds a new train
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Console logging the information that was sent to the Firebase database, to verify that it is showing correctly
  console.log(childSnapshot.val());

  // Storing the above childSnapshot for each input in a new variable
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var todayDate = childSnapshot.val().date;
  var firstTrain = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;

  // Console logging the train info that was generated from the above snapshot values
  console.log(trainName);
  console.log(trainDestination);
  console.log(todayDate);
  console.log(firstTrain);
  console.log(trainFrequency);

  // Creating a moment from a Unix timestamp in moment.js
  var todayDateUpdated = moment.unix(todayDate).format("MM/DD/YYYY");

  // Creating a new variable called firstTimeConverted (this was pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  // Console logging firstTimeConverted to verify that the time shows correctly
  console.log(firstTimeConverted);

  // Creating a new variable called currentTime using moment()
  var currentTime = moment();
  // Console logging the current time to verify that it shows correctly
  console.log("Current Time: " + moment(currentTime).format("hh:mm"));

  // Creating a new variable called timeDifference that compares the difference in time between this and the firstTimeConverted, and displays the result in minutes
  var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
  // Console logging the difference in time to verify that it shows correctly
  console.log("Difference in Time: " + timeDifference);

  // Creating a new variable called timeRemainder that stores the remainder (modulus) of the timeDifference and trainFrequency
  var timeRemainder = timeDifference % trainFrequency;
  // Console logging the remainder in time to verify that it shows correctly
  console.log(timeRemainder);

  // Creating a new variable called timeMinutesTillTrain that subtracts the timeRemainder from the trainFrequency to let us know how many minutes until the next train
  var timeMinutesTillTrain = trainFrequency - timeRemainder;
  // Console logging the minutes until the next train to verify that it shows correctly
  console.log("Minutes Until the Next Train: " + timeMinutesTillTrain);

  // Creating nextTrain variable and assign it to a moment() object that adds timeMinutesTillTrain in minutes
  var nextTrain = moment().add(timeMinutesTillTrain, "minutes");
  // Console logging the estimate arrival time to verify that it shows correctly
  console.log("Estimated Arrival Time: " + moment(nextTrain).format("hh:mm"));

  // Adding the entered train data into the table
  $("#train-table > tbody").append("<tr><td>" +
  trainName + "</td><td>" +
  trainDestination + "</td><td>" +
  todayDateUpdated + "</td><td>" +
  currentTime.format("hh:mm") + "</td><td>" +
  firstTrain + "</td><td>" +
  trainFrequency + " Minute(s)" + "</td><td>" +
  timeMinutesTillTrain + " Minute(s)" + "</td><td>");
});

// ====================================================================================================================================================================================================================
// END
// ====================================================================================================================================================================================================================
