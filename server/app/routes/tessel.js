var router = require('express').Router();
var fs = require('fs');
var path = require('path');
module.exports = router;
var _ = require('lodash');
var oxford = require("project-oxford");
var client = new oxford.Client('e564d5e1c4a542e089428f44d34817e1');
var moment = require('moment')

var students = {
  '04a03efa974084': 'Immad Mohamed',
  '044fa5fa974081': "Cody Schwarz",
  '3e223600': "Jeremy Bini",
  "046f764ad12c80": "Jai Kamat"
};

var currentList = [];


router.post('/checkin/:id', function (req, res, next) {
    var id = req.params.id;
    var photo = req.body.image;
    var date = moment();

    //name the photo idTIME and save in public

    var imageData = new Buffer(0);
    req.on('data', function (chunk) {
        imageData = Buffer.concat([imageData, chunk]);
    });

    // var photoBin = photo.setEncoding('binary');
    // fs.writeFileSync('./public/'+id+'.jpeg', photo)

    req.on('end', function () {
       // Full image ready.
       var emotionToSend;
       var picPath = './public/'+ id + '.jpg';
        fs.writeFileSync(picPath, imageData);
        JaiDanFunc(picPath)
        .then(emo => {
          var nameOfPerson = students[id];

          var objectToSave = {
            name: nameOfPerson,
            time: date,
            emotion: emo, //emotionCleaned
            photo: picPath.slice(9)    //'/'+id+'.jpeg'
          };
          currentList.push(objectToSave);
          res.status(201).send();
        });

        //send the photo to Jai


    });


    //lookup the ID to find the person


    //save the user with all the info in the currentRole

});

router.get('/home', function(req, res, next) {
  //send back a object that has a link to photo, happiness level, name, time
  console.log('requesting my people')
  res.json(currentList);
});


function JaiDanFunc (path) {
  var data = {
	   path: path
  };

  return client.emotion.analyzeEmotion(data)
  .then( response => {
    console.log(response);
    var max = 0;
    var maxEmotion = '';
    if(!response[0]) return 'neutral';
    var obj = response[0].scores;
  	for(var emotion in obj) {
      if (+obj[emotion] > max) {
        maxEmotion = emotion;
        max = +obj[emotion];
      }
    }
    console.log(maxEmotion);
    return maxEmotion;
  })
  .catch(console.error.bind(console));

  }
