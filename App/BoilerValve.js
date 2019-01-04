
var mqtt = require('./mqttCluster.js');
const MINUTESTOMONITOR=60
class BoilerValve{
    constructor(valveCode) {      
       this.valveCode=valveCode;
       this.lastState;
       this.history={}
    }
    async initAsync(){
        var mqttCluster=await mqtt.getClusterAsync() 
        mqttCluster.subscribeData('valves/'+this.valveCode+'/changes', this.onZoneValveChanged.bind(this));
        if (this.valveCode=="test"){

            setInterval(this.checkIfValveHasBeenOnTooLong.bind(this),1000*10)
        }
    }
    checkIfValveHasBeenOnTooLong(){
        
        var now=Math.floor(Date.now() / 1000);
        var keys=Object.keys(this.history)
        
        var starTimeMonitorInterval=now - 60 * MINUTESTOMONITOR
        var keysToDelete=keys.filter(k=>parseInt(k)<=starTimeMonitorInterval)
        keysToDelete.pop()
        console.log("deleting keys " + JSON.stringify(keysToDelete))
        for (let index = 0; index < keysToDelete.length; index++) {
            const key = keysToDelete[index];
            delete this.history[key]
        }
        var counterOnSecs=0;
        var lastTimeWasOn=starTimeMonitorInterval;

        for (var key in this.history) {
            var inRange=parseInt(key)>starTimeMonitorInterval
            if (inRange && this.history[key]==false){
                counterOnSecs=counterOnSecs+(parseInt(key)-lastTimeWasOn)
            }
            if (inRange && this.history[key]==true){
                lastTimeWasOn=parseInt(key);
            }
        }
        var lastKey=Object.keys(this.history).reverse()[0];
        if (this.history[lastKey]==true){
            counterOnSecs=counterOnSecs+(now-lastTimeWasOn)
        }
        console.log(this.valveCode +' '+ counterOnSecs)

    }
    onZoneValveChanged(state){
        if (this.lastState!=state){
            var now=Math.floor(Date.now() / 1000);
            this.history[now]=state
            this.lastState=state;
            console.log(this.valveCode + " "+ now + " "+state)
        }
      }
}

module.exports = BoilerValve;