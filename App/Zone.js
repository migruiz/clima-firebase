var mqtt = require('./mqttCluster.js');
class Zone extends EventEmitter {
    constructor(zoneCode) {
      super()
      this.zoneCode=zoneCode;
    }
    async initAsync(){
      
    }
  }

  module.exports = Zone;