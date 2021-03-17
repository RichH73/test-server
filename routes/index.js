const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { flatten, set, forEach, get, toLower, snakeCase, split } = require('lodash')
const fs = require('fs')





app.post('/test', function(req, res) {
  const images = []
  const files = req.files
  const dirName = `${req.body.classifiedName}_${new Date()}`
  images.push(files)

  forEach(files.file, function(file){
    file.mv(`/Users/rhowell/Desktop/${dirName}/${toLower(file.name)}`, function(error){
      if(error) res.send(error)
    })
  })
  res.send('html')
//   res.send({
//     userInfo: {
//     username: req.body.username,
//     classified: req.body.classifiedName
//     },
//     ...req.files
//   })
});

app.post('/upload', function(req, res) {
  console.log(req)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`/Users/rhowell/Desktop/${sampleFile.name}`, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});













const template = ('<html><head><style>body { color: blue; }</style></head><body><div><div>Hello</div><div>World</div></div></body></html>')



app.post('/', (req, res) => {
  //if(error) console.log(error)

  //var spit = fs.createReadStream(req.body.string, 'utf8')
  console.log(req.body)
  res.send('spit')
})

//app.get('/', (req, res, next) => {







  const posts = 
    [
        {
          "_id": "5e68fe3ac15ce131b29dd867",
          "title": "A new post",
          "uid": "5e2cd47915ef5c7e07b11adc",
          "username": "rich",
          "first_name": "Richard",
          "last_name": "Howell",
          "body": "Some other post to test with.",
          "date": "2020-03-11T15:05:30.040Z",
          "comments": [
            {
              "_id": "5e68fe42c15ce131b29dd868",
              "id": "5e68fe3ac15ce131b29dd867",
              "uid": "5e2cd47915ef5c7e07b11adc",
              "username": "rich",
              "first_name": "Richard",
              "last_name": "Howell",
              "comment": "And a comment.",
              "date": "Wed Mar 11 2020 11:05:38 GMT-0400 (EDT)"
            }
          ],
          "__v": 0
        },
        {
          "_id": "5e659f470930295d897b5621",
          "title": "A new post",
          "uid": "5e2cd47915ef5c7e07b11adc",
          "username": "rich",
          "first_name": "Richard",
          "last_name": "Howell",
          "profile_pic": "b547387b19f5311c23ed87afa0bf8d86.jpg",
          "body": "Welcome to HerpBook.com. Please take a moment to look around and become familiar with the site. If you have any questions, comments or find issues, please feel free to reach out to me. :)",
          "date": "2020-03-09T01:43:35.413Z",
          "__v": 0,
          "comments": [
            {
              "_id": "5e65a0150930295d897b5623",
              "uid": "5e6594000930295d897b561f",
              "username": "foomantwo",
              "first_name": "Footwo",
              "last_name": "Man",
              "comment": "Just a test",
              "date": "Sun Mar 08 2020 21:47:01 GMT-0400 (EDT)"
            }
          ]
        }
      ]
    
    const new_commment = 
    {
        "_id": "5e65a0150930295d897b4432",
        "uid": "5e6594000930295d897b561f",
        "username": "foomanthree",
        "first_name": "Foothree",
        "last_name": "Managain",
        "comment": "Just another testy test",
        "date": "Sun Mar 08 2020 21:47:01 GMT-0400 (EDT)"
      }
    
    const new_post = 
    {
      "_id": "5e68fe3ac15ce131b29dd867",
      "title": "Now the first post",
      "uid": "5e2cd47915ef5c7e07b11adc",
      "username": "rich",
      "first_name": "Richard",
      "last_name": "f'ing Howell",
      "body": "Some other post to test with.",
      "date": "2020-03-11T15:05:30.040Z",
      "comments": [
        {
          "_id": "5e68fe42c15ce131b29dd868",
          "id": "5e68fe3ac15ce131b29dd867",
          "uid": "5e2cd47915ef5c7e07b11adc",
          "username": "rich",
          "first_name": "Richard",
          "last_name": "Howell",
          "comment": "And a comment.",
          "date": "Wed Mar 11 2020 11:05:38 GMT-0400 (EDT)"
        }
      ],
      "__v": 0
    }
    
    const test = posts.filter(function(post){
        return post.username === 'rich'
    })
    let post_id = '5e659f470930295d897b5621'
    
    
    const newCommentObject = { new_commment };
    const nposts = posts.map(post => {
      if (post._id === post_id) {
        post.comments.push(new_commment);
      }
      return post
    });
    const users = [
      {
        username: 'rich',
        profile_pic: 'rich.jpg',
        uid: 111
      },
      {
        username: 'fooman',
        profile_pic: 'fooman.jpg',
        uid: 222
      },
      {
        username: 'footwo',
        profile_pic: 'footwo.jpg',
        uid: 333
      }
    ]


    // const mapped = (users) => {
    //   return users.map(user => (
    //     `<img src=${user.profile_pic} />`
    //   ))
    // }




module.exports = app