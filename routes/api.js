/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

MongoClient.connect(CONNECTION_STRING, function(err, db) {

  app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;
      db.collection('issues')
        .find({_id: project.id})
        .toArray()
        .then((docs) => {
          res.json(docs)
        })
    })

    .post(function (req, res){
      if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
        var project = req.params.project;
        db.collection('issues')
        .insertOne(req.body)
        .then(() => {
          db.collection('issues')
            .find({_id: project.id})
            .toArray()
            .then((docs) => {
              res.json(docs);
            });        
        }
      });
                } else {
          res.json({error: 'Missing required fields'});

    })

    .put(function (req, res){
      var project = req.params.project;
      db.collection('issues')
      .updateOne({_id: project.id}, {$set: req.body})
      .then(() => {
      db.collection('issues')
        .find({_id: project.id})
        .toArray()
        .then((docs) => {
          res.json(docs)
        });
      });
    })

    .delete(function (req, res){
      var project = req.params.project;
      // delete project data
    });

});
  
  
};
