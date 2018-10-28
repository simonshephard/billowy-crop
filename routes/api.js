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

// MongoClient.connect(CONNECTION_STRING, function(err, db) {

  app.route('/api/issues/:project')

    .get(function (req, res){
      // THIS WORKS WITHOUT DB
      // res.json({result: "ok"});
      // THIS ALSO WORKS WITHOUT DB
      // res.json({result: "ok", project: req.params.project});
    
    // I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
    // I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
      var project = req.params.project;
      var filter = req.query || {};
      filter.issue_title = project;
      db.collection('projects')
        .find(filter)
        .toArray()
        .then((docs) => {
          res.json(docs)
        })
    })

    .post(function (req, res){
      console.log("in post");
    // I can POST /api/issues/{projectname} with form data containing
    // *required issue_title, issue_text, created_by
    // *optional assigned_to and status_text (blank for optional if no input)
    // *other created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
    // The object saved (and returned) will include all of those fields
      if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
        console.log("required ok");
        var project = req.params.project;
        db.collection('projects')
        .insertOne(req.body)
        .then(() => {
          db.collection('projects')
            .find({_id: project.id})
            .toArray()
            .then((docs) => {
              res.json(docs);
            });
        });
      } else {
        res.json({error: 'Missing required fields'});
      }
    })

    .put(function (req, res){
    // I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
      var project = req.params.project;
      db.collection('projects')
      .updateOne({_id: project.id}, {$set: req.body})
      .then(() => {
      db.collection('projects')
        .find({_id: project.id})
        .toArray()
        .then((docs) => {
          res.json(docs)
        });
      });
    })

    .delete(function (req, res){
    // I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
      var project = req.params.project;
      // delete project data
    });

// });
  
  
};
