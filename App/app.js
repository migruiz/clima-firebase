var mqtt = require('./mqttCluster.js');
var Zone = require('./Zone.js');
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

    for (var key in global.zonesConfiguration) {
      var zoneConfig=global.zonesConfiguration[key]
      var zone=new Zone(key)
      await zone.initAsync()
  }

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

    var mqttCluster=await mqtt.getClusterAsync() 
    mqttCluster.subscribeData("testValve/turn", function(content) {
        

        var topic = 'zonesalerts';

        // See documentation on defining a message payload.
        var message = {
            data: {
              score: '850',
              time: '2:45'
            },
            notification: {
                title: '$GOOG up 1.43% on the day',
                body: content.toString()
              },
            topic: topic
          };
        





    });


  })();

  


process.on('SIGINT', function () {
    process.exit();
});
