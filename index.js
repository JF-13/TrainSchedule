var trainList = [];
var config = {
  apiKey: "AIzaSyDj7Dmyh9enYSTQsPx-1XUNFtT3tvQUuts",
  authDomain: "employeemanagement-f1a66.firebaseapp.com",
  databaseURL: "https://employeemanagement-f1a66.firebaseio.com",
  projectId: "employeemanagement-f1a66",
  storageBucket: "employeemanagement-f1a66.appspot.com",
  messagingSenderId: "128659827199"
};
firebase.initializeApp(config);
var database = firebase.database();

//submits input -> creates train object -> pushes to firebase
$('#submit-train').on('click', function(event) {
  event.preventDefault();
  var name = $('#trainName').val();
  var destination = $('#destination').val();
  var firstTrainTime = $('#firstTrainTime').val();
  var frequency = $('#frequency').val();
  var countdown;
  var timer;
  if (name !== '') {
    name = new train(name, destination, firstTrainTime, frequency);
    database.ref().push({
      train: name
    });
  }
});

//updates html when child is added
database.ref().on('child_added', function(snapshot) {
  var name = snapshot.val().train.name;
  if (trainList.includes(name) === false) {
    trainList.push(name);
    var destination = snapshot.val().train.destination;
    var startTime = snapshot.val().train.trainTime;
    var frequency = snapshot.val().train.frequency;
    var id = name + 'TimeId';
    $('tbody').append('<tr> <td>' + name + '</td><td>' +
      destination + '</td><td>Every ' + frequency + ' min</td><td id="' + id + '"></td><td id="' + name + '">' + frequency +
      '</td></tr>');
    nextArrival(startTime, frequency, name, destination);
    //countDown(countDown);
  }
});

//calculates next arrival time
function nextArrival(display, frequency, name, destination) {
  var display2 = moment(new Date(display));
  var display3;
  var currentMoment = moment();
  var wantedMoment = display3;
  do {

    display3 = display2.add(frequency, 'minutes');
  } while (moment(display3).isBefore(moment()));
  currentNextArrival = '#' + name + 'TimeId';
  $(currentNextArrival).html(display3.format('HH:mm'));
  countDown(name, display3);
}

//TRAIN CONSTRUCTOR
function train(name, destination, trainTime, frequency) {
  this.name = name;
  this.destination = destination;
  this.trainTime = trainTime;
  this.frequency = frequency;
}

//MINUTES LEFT UNTIL NEXT TRAIN
function countDown(name, display3) {
  if (display3.isBefore(moment())) display3.add(1, 'day');
  var d = moment.duration(display3.diff(moment()));
  var cdId = '#' + name;
  var secLeft = (d._data.seconds).toString();
  if (secLeft.length === 1) {
    $(cdId).html(d._data.minutes + ':0' + secLeft);
  } else {
    $(cdId).html(d._data.minutes + ':' + secLeft);
  }
}

//COUNTDOWN ATTEMPT NOT ACTIVE
// function startCountDown(timer, name, destination, currentInterval) {
//   timer = timer * 60000;
//   var currentId = '#' + name;
//   name = setInterval(function() {
//     timer = timer - 1000;
//     var minutes = timer/60000;
//     if (timer === 0) {
//       $(currentId).html(timer/1000 + ' seconds');
//     } else if (timer < 60000) {
//       $(currentId).html(timer/1000 + ' seconds');
//     } else {
//       $(currentId).html(Math.floor(timer/60000) + ' minutes');
//     }
//   }, 1000);
// }
