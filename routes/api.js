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

const CONNECTION_STRING = process.env.DB; // MongoClient.connect(CONNECTION_STRING, function(err, db) {

module.exports = function (app) {

  app.route('/api/issues/:project')
  
  .get(function (req, res){
  
    var project = req.params.project;
    var filter = req.query || {};
    if (filter.open) {filter.open = (filter.open === "true");}

    MongoClient.connect(CONNECTION_STRING, function(err, db) {
     db.collection(project)
       .find(filter)
       .toArray()
       .then((docs) => {
         res.json({result: "get-ok", filter: filter, docs: docs});
       })
    });

  })

  .post(function (req, res){

    var project = req.params.project;
    if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {res.json({result: 'required not completed'});}
    var new_entry = {}; // NOTE - do not copy req.body as creates a pointer not a copy
    new_entry.issue_title = req.body.issue_title;
    new_entry.issue_text = req.body.issue_text;
    new_entry.created_by = req.body.created_by;      
    new_entry.assigned_to = req.body.assigned_to || '';
    new_entry.status_text = req.body.status_text || '';
    new_entry.created_on = Date.now();
    new_entry.updated_on = Date.now();
    new_entry.open = true;

    MongoClient.connect(CONNECTION_STRING, function(err, db) {
      db.collection(project)
      .insertOne(new_entry, (err, doc) => {
        //console.log({_id: doc.insertedId});
        new_entry._id = doc.insertedId
        const results = [new_entry];
        //console.log({docs: results});
        res.json({docs: results});
      });
    });

  })

  .put(function (req, res){

    var project = req.params.project;
    var id = req.body._id;
    var updated_entry = {}; // NOTE - do not copy req.body as creates a pointer not a copy
    updated_entry.issue_title = req.body.issue_title || '';
    updated_entry.issue_text = req.body.issue_text || '';
    updated_entry.created_by = req.body.created_by || '';      
    updated_entry.assigned_to = req.body.assigned_to || '';
    updated_entry.status_text = req.body.status_text || '';
    for (var prop in updated_entry) { if (updated_entry[prop] === '') {delete updated_entry[prop];} }
    if (Object.keys(updated_entry).length === 0) {res.json({result: 'no updated field sent'});}
    updated_entry.updated_on = Date.now();

    MongoClient.connect(CONNECTION_STRING, function(err, db) {
      db.collection(project)
      .findAndModify({_id: ObjectId(id)},[['_id',1]], {$set: updated_entry}, {new: true}, (err,doc) => {
        if (err) {
          console.error(err);
          res.json({update_err: err, result: 'could not update ' + id});
        } else if (doc) {
          const results = [updated_entry];
          res.send({docs: results, result: 'successfully updated ' + id});
        } else {
          res.json({update_err: 'no update', result: 'could not update ' + id});
        }
      });
    });

  })

  .delete(function (req, res){

    var project = req.params.project;
    // console.log({reqBody: req.body});
    var id = req.body._id;
    if (id === '') {res.json({result: 'no _id sent - _id error'});}

    MongoClient.connect(CONNECTION_STRING, function(err, db) {
      db.collection(project)
      .deleteOne({_id: ObjectId(id)}, (err, doc) => {
        if (err) {
          console.error(err);
          res.json({delete_err: err, result: 'failed: could not delete ' + id});
        } else if (doc) {
          res.json({result: 'success: deleted ' + id});
        } else {
          res.json({other: 'no error, no delete', result: 'failed: could not delete ' + id});
        }
      });
    });

  });
  
  
};
