$(document).ready(function() {
  // Initalizing Firebase
  var config = {
    apiKey: "AIzaSyCE6QBh8Kffl62p7bLiliQa4zFIWpf3PoU",
    authDomain: "choo-choo-schedule.firebaseapp.com",
    databaseURL: "https://choo-choo-schedule.firebaseio.com",
    projectId: "choo-choo-schedule",
    storageBucket: "choo-choo-schedule.appspot.com",
    messagingSenderId: "362052033293"
  };

  firebase.initializeApp(config);


  //variable referencing database
  var db = firebase.database();

  // button click function
  $('#add-train').on('click', function(event) {
    event.preventDefault();

    // variables to store inputs
    var name = $('#train-name-input').val().trim();
    var destination = $('#destination-input').val().trim();
    var firstTrainTime = $('#first-train-input').val().trim();
    var frequency = $('#frequency-input').val().trim();

      // Creates local "temporary" object for holding employee data
      var newTrain = {
      name: name,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    }

    // uploads train data to the database
    db.ref().push(newTrain);

    // Alert
    alert('New Train Successfully Added');

    // Clears all the text boxes after data is uploaded to database
    $('#train-name-input').val("");
    $('#destination-input').val("");
    $('#first-train-input').val("");
    $('#frequency-input').val("");
  })

  // Create Firevase event for addign train to the database and a row in the html when a user adds an entry
  db.ref().on('child_added', function (childSnapshot, prevChildKey) {

    //Stores data in to variables
  var newTrainName = childSnapshot.val().name;
  var newDestination = childSnapshot.val().destination;
  var newFirstTrainTime = childSnapshot.val().firstTrainTime;
  var newFrequency = childSnapshot.val().frequency;

  // Taking the time from the input and creating a format through Moment.js
  var newFirstTrainTimeConverted = moment(newFirstTrainTime, "HH:mm").subtract(1, 'years');

  // Current Time
  var currentTime = moment();

  // Difference of the times
  var diffTime = moment().diff(moment(newFirstTrainTimeConverted), 'minutes');
  
  // Time apart
  var tRemainder = diffTime % newFrequency;

  // Minutes until train
  var tMinutesTillTrain = newFrequency - tRemainder;

  // Next train departure
  var nextTrain = moment().add(tMinutesTillTrain, 'minutes');

  // appending new table row with data of the newly added train
  $('#train-table > tbody').append('<tr><td>' + newTrainName + '</td><td>' + newDestination + '</td><td>' + newFrequency + '</td><td>' + moment(nextTrain).format('hh:mm') + '</td><td>' + tMinutesTillTrain + '</td></tr>')
})

// Clock with current time
function update () {
  $('#clock').html(moment().format('hh:mm:ss'));
}
setInterval(update, 1000)

// page reload every 30 seconds
setTimeout(function() {
  location.reload();
}, 30000);
})