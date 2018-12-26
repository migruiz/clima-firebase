var mqtt = require('./mqttCluster.js');
class Zone {
    constructor(zoneCode) {
      this.zoneCode=zoneCode;
    }
    async initAsync(){
      var mqttCluster=await mqtt.getClusterAsync() 
        mqttCluster.subscribeData("zoneClimateChange/"+this.zoneCode, this.onCurrentTemperatureChanged.bind(this));
    }
    onCurrentTemperatureChanged(content){
      this.CurrentTemperature=Math.round( content.temperature * 1e1 ) / 1e1;
  }
}

  module.exports = Zone;