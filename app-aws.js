var awsIot = require('aws-iot-device-sdk');


var deviceParams = require('./device-sonar.js');

var timers = require('timers');

var device = awsIot.device(deviceParams);

var deltaTopic = '$aws/things/sonar/shadow/update/delta';
var updateTopic = '$aws/things/sonar/shadow/update';
var state = {};

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
  .on('connect', function() {
    console.log('connected');
    device.subscribe(deltaTopic);
    
    });
    
function publishState(){
    device.publish(updateTopic, JSON.stringify({ state: {reported: state} }));
    console.log("state reported");
}

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
    if(topic == deltaTopic){
        obj = JSON.parse(payload);
        state = obj.state;
        console.log("state updated");
    }
    timers.setTimeout(publishState, 5000);
  });