var mqtt = require('./mqttCluster.js');
class Zone {
    constructor(zoneCode,valveCode) {
      this.zoneCode=zoneCode;
      this.valveCode=valveCode;
      this.ValveState;
    }
    async initAsync(){
      var mqttCluster=await mqtt.getClusterAsync() 
        mqttCluster.subscribeData("zoneClimateChange/"+this.zoneCode, this.onCurrentTemperatureChanged.bind(this));
        mqttCluster.subscribeData('valves/'+this.valveCode+'/changes', this.onZoneValveChanged.bind(this));
    }
    onCurrentTemperatureChanged(content){
      this.CurrentTemperature=Math.round( content.temperature * 1e1 ) / 1e1;
    }
    onZoneValveChanged(state){
      console.log(this.zoneCode + this.valveCode + state.toString())
      if (this.ValveState!=state && state==true)
      this.ValveState=state
    }
}

  module.exports = Zone;