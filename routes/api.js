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
    
      // get data for project
      // db.connection not mongoose - check other recent projects
    
          db.collection('issues').find({id: project.id}, (err, doc) => {
                  return cb(null, doc.value);
              }
          );

    
    
    

    })

    .post(function (req, res){
      var project = req.params.project;

      // get data from project post object
      // create and save db data

    
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
