var mqtt = require('./mqttCluster.js');
global.zonesConfiguration= {
    masterroom: 'upstairs',   
    livingroom:  'downstairs',
    entrance:  'downstairs', 
    masterbathroom:  'upstairs',
    computerroom:  'upstairs',
    secondbedroom: 'upstairs'
}
global.mtqqLocalPath = "mqtt://piscos.tk";
//global.mtqqLocalPath = process.env.MQTTLOCAL;
(async function(){
    
  })();

  


process.on('SIGINT', function () {
    process.exit();
});
