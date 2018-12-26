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
        
        // Send a message to devices subscribed to the provided topic.
        admin.messaging().send(message)
          .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });




    });


  })();

  


process.on('SIGINT', function () {
    process.exit();
});
