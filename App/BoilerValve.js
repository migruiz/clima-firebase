
var mqtt = require('./mqttCluster.js');
const MINUTESTOMONITOR=60
const ALARMWHENTOTALONTIMEMINUTES=20;
class BoilerValve{
    constructor(valveCode) {      
       this.valveCode=valveCode;
       this.lastState;
       this.firebaseAdmin;
       this.history={};
       this.checkInterval;
    }
    async initAsync(firebaseAdmin){
        this.firebaseAdmin=firebaseAdmin;
        var mqttCluster=await mqtt.getClusterAsync() 
        mqttCluster.subscribeData('valves/'+this.valveCode+'/changes', this.onZoneValveChanged.bind(this));
        this.createCheckInterval()
    }
    createCheckInterval(){
        this.checkInterval=setInterval(this.checkIfValveHasBeenOnTooLong.bind(this),1000*60)
    }
    sendONAlertNotification(){
        var topic = 'zonesalerts';
        var message = {
            data: {
              score: '1',
              time: '2'
            },
            notification: {
                title: 'Clima Alert',
                body: this.valveCode +  " Valve ON for more than " + ALARMWHENTOTALONTIMEMINUTES +" minutes in the last hour"
              },
            topic: topic
          };
        this.firebaseAdmin.messaging().send(message)
          .then((response) => {
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });

    }
    checkIfValveHasBeenOnTooLong(){
        
        var now=Math.floor(Date.now() / 1000);
        var starTimeMonitorInterval=now - 60 * MINUTESTOMONITOR
        this.deleteEntriesBefore(starTimeMonitorInterval);
        var counterOnSecs = this.getValveTotalOnElapsedSecs(starTimeMonitorInterval, now);        
        if (counterOnSecs>ALARMWHENTOTALONTIMEMINUTES * 60){
            console.log(this.valveCode+ " alert more than "+ counterOnSecs)
            this.sendONAlertNotification()
            clearInterval(this.checkInterval);
            var self=this;
            setTimeout(() => {
                self.createCheckInterval();
            }, 1000 * 60 * MINUTESTOMONITOR);
        }
    }
    getValveTotalOnElapsedSecs(starTimeMonitorInterval, now) {
        var counterOnSecs = 0;
        var lastTimeWasOn = starTimeMonitorInterval;
        var firstKey = Object.keys(this.history)[0];
        for (var key in this.history) {
            var inRange = parseInt(key) > starTimeMonitorInterval;
            if (inRange && this.history[key] == false && firstKey!=key) {
                counterOnSecs = counterOnSecs + (parseInt(key) - lastTimeWasOn);
            }
            if (inRange && this.history[key] == true) {
                lastTimeWasOn = parseInt(key);
            }
        }
        var lastKey = Object.keys(this.history).reverse()[0];
        if (this.history[lastKey] == true) {
            counterOnSecs = counterOnSecs + (now - lastTimeWasOn);
        }
        return counterOnSecs;
    }

    deleteEntriesBefore(starTime) {
        var keys=Object.keys(this.history)
        var keysToDelete = keys.filter(k => parseInt(k) <= starTime);
        keysToDelete.pop();
        if (keysToDelete.length>0){
            //console.log("deleting keys " + JSON.stringify(keysToDelete));
        }
        for (let index = 0; index < keysToDelete.length; index++) {
            const key = keysToDelete[index];
            delete this.history[key];
        }
    }

    onZoneValveChanged(state){
        if (this.lastState!=state){
            var now=Math.floor(Date.now() / 1000);
            this.history[now]=state
            this.lastState=state;
        }
      }
}

module.exports = BoilerValve;