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
    var admin = require("firebase-admin");

    var serviceAccount = require("./serviceAccountKey.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://clima-b87e7.firebaseio.com"
    });


    var db = admin.database();
    var ref = db.ref("test");
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
    });
  })();

  


process.on('SIGINT', function () {
    process.exit();
});
