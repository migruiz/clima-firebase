
var mqtt = require('./mqttCluster.js');
class BoilerValve{
    constructor(valveCode) {      
       this.valveCode=valveCode;
       this.ValveState;
    }
    async initAsync(){
        var mqttCluster=await mqtt.getClusterAsync() 
        mqttCluster.subscribeData('valves/'+this.valveCode+'/changes', this.onZoneValveChanged.bind(this));
    }
    onZoneValveChanged(state){
        if (this.ValveState!=state && state==true)
        this.ValveState=state
      }
}

module.exports = BoilerValve;