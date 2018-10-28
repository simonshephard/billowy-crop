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
        .find({id: project.id})
        .toArray()
        .then((docs) => {
          res.json(docs)
        })
    })

    .post(function (req, res){
      var project = req.params.project;
      db.collection('issues')
      .insertOne(req.body)
      .then(() => {
        db.collection('issues')
        .find().toArray()
        .then((docs) => {
        res.json(docs)
      })
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err })
      });

    });

    
    })

    .put(function (req, res){
      var project = req.params.project;
      // amend project data and save
    })

    .delete(function (req, res){
      var project = req.params.project;
      // delete project data
    });

});
  
  
};
