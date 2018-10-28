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

    // I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
    // I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
    .get(function (req, res){
      // FIRST CHECK ROUTE - THIS WORKS WITHOUT DB
      // res.json({route: "get-ok"});
    
      // THEN CHECK PARAMS - THIS ALSO WORKS WITHOUT DB
      // res.json({route: "get-ok", project: req.params.project});
      
      // THIS ALSO WORKS WITHOUT DB
      // *https://billowy-crop.glitch.me/api/issues/newproj?open=false&new_prop=new_prop
      // *{"route": "get-ok", "filter": {"open": "false", "new_prop": "new_prop", "issue_title": "newproj"}}
      // var project = req.params.project;
      // var filter = req.query || {};
      // filter.issue_title = project;
      // res.json({result: "get-ok", filter: filter});
    
      // THIS WORKS WITH DB WITHIN FUNCTION - GIVES EMPTY DOCS ARRAY SINCE NOTHING IN DB
      // *https://billowy-crop.glitch.me/api/issues/newproj?open=false&new_prop=new_prop
      // *{"result": "get-ok", "filter": {"open": "false", "new_prop": "new_prop", "issue_title": "newproj"}, "docs": []}
      var project = req.params.project;
      var filter = req.query || {};
      filter.issue_title = project;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
       db.collection('projects')
         .find(filter)
         .toArray()
         .then((docs) => {
           res.json({result: "get-ok", filter: filter, docs: docs});
         })
      });
        
    })

    .post(function (req, res){
    // I can POST /api/issues/{projectname} with form data containing
    // *required issue_title, issue_text, created_by
    // *optional assigned_to and status_text (blank for optional if no input)
    // *other created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
    // The object saved (and returned) will include all of those fields
    
    // JQUERY FUNCTION IN INDEX FILE CALLING POST REQUEST
    // $('#testForm').submit(function(e) {
      // $.ajax({
        // url: '/api/issues/apitest',
        // method: 'post',
        // // OR type: 'post', // alias for method
        // data: $('#testForm').serialize(),
        // success: function(data) {
          // $('#jsonResult').text(JSON.stringify(data));
        // }
      // });
      // e.preventDefault();
    // });

      // FIRST CHECK ROUTE - LOGGING HERE AND JSON ADDED TO #jsonResult IN INDEX
      // console.log({route: "post-ok"});
      // console.log({route: "post-ok", params: req.params, body: req.body});
      // console.log({route: "post-ok", req: req}); // NOTE seems req too big to res.json
      // res.json({route: "post-ok"});
      // res.json({route: "post-ok", req_body: req.body, req_params: req.params, req_query: req.query});
      // {"route":"post-ok","req_body":{"issue_title":"a","issue_text":"b","created_by":"c","assigned_to":"","status_text":""},"req_params":{"project":"apitest"},"req_query":{}}
      // NOTE HTML FORM PREVENTS POSTING WITHOUT REQUIRED FIELDS
    
      // NOW ADD ADDITIONAL FIELDS
      // created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id
      var new_entry = req.body || {}; // NOTE this creates pointer not separate copy
      new_entry.created_on = Date.now();
      new_entry.updated_on = Date.now();
      new_entry.open = true;
      // res.json({route: "post-ok", new_entry: new_entry, req_body: req.body, req_params: req.params, req_query: req.query});
      // {"route":"post-ok","new_entry":{"issue_title":"a","issue_text":"b","created_by":"c","assigned_to":"","status_text":"","created_on":1540756426831,"updated_on":1540756426831,"open":true},"req_body":{"issue_title":"a","issue_text":"b","created_by":"c","assigned_to":"","status_text":"","created_on":1540756426831,"updated_on":1540756426831,"open":true},"req_params":{"project":"apitest"},"req_query":{}}
      
      // AND FINALLY SAVE TO DATABASE AND RETRIEVE SAVED
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection('projects')
        .insertOne(new_entry, (err, doc) => {
          db.collection('projects')
            .find({"_id": doc.insertedId})
            .toArray()
            .then((docs) => {
              res.json(docs);
            });
        });
      });
      // [{"_id":"5bd62f578be3581c2436a54e","issue_title":"a","issue_text":"b","created_by":"c","assigned_to":"","status_text":"","created_on":1540763478977,"updated_on":1540763478977,"open":true}]
      
    })

    .put(function (req, res){
    // I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object.
    // Returned will be 'successfully updated' or 'could not update '+_id.
    // This should always update updated_on.
    // If no fields are sent return 'no updated field sent'.
      // var project = req.params.project;
      // FIRST CHECK ROUTE - LOGGING HERE AND JSON ADDED TO #jsonResult IN INDEX
      // console.log({route: "put-ok"});
      // console.log({route: "put-ok", req_body: req.body, req_params: req.params, req_query: req.query});
      // console.log({route: "put-ok", req: req}); // NOTE seems req too big to res.json
      // res.json({route: "put-ok"});
      // res.json({route: "put-ok", req_body: req.body, req_params: req.params, req_query: req.query});
      // {"route":"put-ok","req_body":{"_id":"a","issue_title":"b","issue_text":"","created_by":"","assigned_to":"","status_text":""},"req_params":{"project":"apitest"},"req_query":{}}
      // NOTE THAT PROPERTIES ARE EMPTY STRINGS SO NEED TO WATCH UPDATE
      
      // var updated_entry = {};
      // for (let prop in req.body) {
      //   if (prop !== "" && prop !== req.body._id) {updated_entry[prop] = req.body[prop];}
      // }
      
      // AND FINALLY SAVE TO DATABASE AND RETRIEVE SAVED
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection('projects')
        // .update({_id: req.body._id}, {$set: req.body}) // gives all blanks
        .update({"_id": req.body._id}, {$set: req.body})
        .then(() => {
        console.log({updated: "updated-ok"});
        db.collection('projects')
          .find({"_id": req.body._id})
          .toArray()
          .then((docs) => {
            res.json(docs)
          });
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
