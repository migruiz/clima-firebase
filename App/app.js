var mqtt = require('./mqttCluster.js');
var Zone = require('./Zone.js');
const BoilerValve=require('./BoilerValve')
global.zonesConfiguration= {
    masterroom: 'upstairs',   
    livingroom:  'downstairs',
    entrance:  'downstairs', 
    masterbathroom:  'upstairs',
    computerroom:  'upstairs',
    secondbedroom: 'upstairs'
}
global.boilerValves={
  upstairs:new BoilerValve('upstairs'),
  downstairs:new BoilerValve('downstairs'),
  test:new BoilerValve('test'),
  hotwater:new BoilerValve('hotwater')
}
global.mtqqLocalPath = "mqtt://piscos.tk";
//global.mtqqLocalPath = process.env.MQTTLOCAL;
(async function(){

    for (var key in global.zonesConfiguration) {
      var zoneConfig=global.zonesConfiguration[key]
      var zone=new Zone(key,zoneConfig)
      await zone.initAsync()
  }
  var admin = require("firebase-admin");

  var serviceAccount = require("./serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://clima-b87e7.firebaseio.com"
  });
  await global.boilerValves.upstairs.initAsync(admin);
  await global.boilerValves.downstairs.initAsync(admin);
  await global.boilerValves.test.initAsync(admin);
  await global.boilerValves.hotwater.initAsync(admin);




    var db = admin.database();
    var ref = db.ref("test");
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
    });

  })();

  


process.on('SIGINT', function () {
    process.exit();
});
