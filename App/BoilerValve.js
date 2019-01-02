
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
        setInterval(this.checkIfValveHasBeenOnTooLong.bind(this),1000*60)
    }
    checkIfValveHasBeenOnTooLong(){
        
        var now=Math.floor(Date.now() / 1000);
        var keys=Object.keys(this.history)
        if (this.valveCode=="test"){

        }
        var starTimeMonitorInterval=now - 60 * MINUTESTOMONITOR
        var keysToDelete=keys.filter(k=>parseInt(k)<=starTimeMonitorInterval)
        keysToDelete.pop()
        for (let index = 0; index < keysToDelete.length; index++) {
            const key = keysToDelete[index];
            delete this.history[key]
        }
        var counterOnSecs=0;
        var lastTimeWasOn=null
        var firstKey=Object.keys(this.history)[0];
        if (this.history[firstKey]==true){
            lastTimeWasOn=starTimeMonitorInterval
        }
        for (var key in this.history) {
            if (this.history[key]==false && lastTimeWasOn){
                counterOnSecs=counterOnSecs+(parseInt(key)-lastTimeWasOn)
            }
            if (this.history[key]==true){
                lastTimeWasOn=parseInt(key);
            }
        }
        var lastKey=Object.keys(this.history).reverse()[0];
        if (this.history[lastKey]==true){
            counterOnSecs=counterOnSecs+(now-lastTimeWasOn)
        }
        if (counterOnSecs)
        console.log(this.valveCode + counterOnSecs)

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