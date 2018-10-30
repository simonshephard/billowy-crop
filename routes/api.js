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

      // res.json({route: "post-ok", new_entry: new_entry, req_body: req.body, req_params: req.params, req_query: req.query});
      // {"route":"post-ok","new_entry":{"issue_title":"a","issue_text":"b","created_by":"c","assigned_to":"","status_text":"","created_on":1540756426831,"updated_on":1540756426831,"open":true},"req_body":{"issue_title":"a","issue_text":"b","created_by":"c","assigned_to":"","status_text":"","created_on":1540756426831,"updated_on":1540756426831,"open":true},"req_params":{"project":"apitest"},"req_query":{}}
      
      // AND FINALLY SAVE TO DATABASE AND RETRIEVE SAVED
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection(project)
        .insertOne(new_entry, (err, doc) => {
          console.log({_id: doc.insertedId});
          new_entry._id = doc.insertedId
          // console.log({newEntry: new_entry});

          const results = [new_entry];
          console.log({docs: results});
          res.json({docs: results});
        });
      });
      // [{"_id":"5bd62f578be3581c2436a54e","issue_title":"a","issue_text":"b","created_by":"c","assigned_to":"","status_text":"","created_on":1540763478977,"updated_on":1540763478977,"open":true}]
      
    })

    .put(function (req, res){
    var project = req.params.project;
    var id = req.body._id;
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
      
      // SET UPDATE FIELDS
      var updated_entry = {}; // NOTE - do not copy req.body as creates a pointer not a copy
      updated_entry.issue_title = req.body.issue_title || '';
      updated_entry.issue_text = req.body.issue_text || '';
      updated_entry.created_by = req.body.created_by || '';      
      updated_entry.assigned_to = req.body.assigned_to || '';
      updated_entry.status_text = req.body.status_text || '';
      //updated_entry.open = true;
      for (var prop in updated_entry) { if (updated_entry[prop] === '') {delete updated_entry[prop];} }
      //console.log({updatedEntry: updated_entry});
      //console.log({numKeysOnPutUpdatedEntry: Object.keys(updated_entry).length});
      if (Object.keys(updated_entry).length === 0) {res.json({result: 'no updated field sent'});}
      updated_entry.updated_on = Date.now();

      // var numValidProperties = 0;
      // for (var property in req.body) {
      //   if (req.body[property]) {
      //     if (req.body[property] && property !== "_id") {
      //       updated_entry[property] = req.body[property];
      //       // This should always update updated_on
      //       updated_entry.created_on = Date.now();
      //       numValidProperties++;
      //     }
      //   }
      // }
      // If no fields are sent return 'no updated field sent'
      
      // AND FINALLY SAVE TO DATABASE AND RETRIEVE SAVED
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection(project)
        // .update({_id: req.body._id}, {$set: req.body}) // gives all blanks
        // .update({"_id": ObjectId(req.body._id)}, {$set: req.body})
        // .update({"_id": ObjectId(req.body._id)}, {$set: {"issue_title": "newTitle1"}}) // WORKS AND UPDATES
        // .update({"_id": ObjectId(req.body._id)}, {$set: updated_entry}, (err, doc) => {
        .findAndModify({_id: ObjectId(id)},[['_id',1]], {$set: updated_entry}, {new: true}, (err,doc) => {
        // .then(() => {
          // console.log({updated: "updated-ok"}); // WORKING
          // res.json({updated: "updated-ok"}); // WORKING
          // res.json({updated: req.body}); // WORKING BUT NOT UPDATING DB
          
          // NOTE WHAT YOU GET BACK in doc FROM CALL BACK IS NOT OBJECT - NEED TO DO A FIND
          // res.json({docs: doc});
          // {"docs":{"n":1,"nModified":1,"opTime":{"ts":"6617826235496005633","t":5},"electionId":"7fffffff0000000000000005","ok":1,"operationTime":"6617826235496005633","$clusterTime":{"clusterTime":"6617826235496005633","signature":{"hash":"o9o+C0AccJbr5gvQIEbr09+F1wo=","keyId":"6580393220394450946"}}}}
          // ALSO NOTE YOU STILL GET BACK A "doc" WHEN IT DOE SNOT FIND THE THING TO UPDATE
          // {"docs":{"n":0,"nModified":0,"opTime":{"ts":"6617827966367825921","t":5},"electionId":"7fffffff0000000000000005","ok":1,"operationTime":"6617827966367825921","$clusterTime":{"clusterTime":"6617827966367825921","signature":{"hash":"1cE4BoWniCs5pUvKsOvwaKi0M4k=","keyId":"6580393220394450946"}}}}
          
          if (err) {
            console.error(err);
            res.json({update_err: err, result: 'could not update ' + id});
          } else if (doc) {
            //updated_entry._id = req.body._id;
            const results = [updated_entry];
            res.send({docs: results, result: 'successfully updated ' + id});
          } else {
            // 'successfully updated' or 'could not update '+_id.
            res.json({update_err: 'no update', result: 'could not update ' + id});
          }
          
        });
      });

    })

    .delete(function (req, res){
    var project = req.params.project;
    console.log({reqBody: req.body});
    var id = req.body._id;
    // I can DELETE /api/issues/{projectname} with a _id to completely delete an issue.
    // If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
    
      // CHECK INITIAL ROUTE WORKS
      // console.log({delete_route: "ok"});
      // res.json({delete_route: "ok"});

      // CHECK REQ
      // console.log({delete_req: req});
      // res.json({delete_route: "ok", req_body: req.body, req_params: req.params, req_query: req.query});
      // {"delete_route":"ok","req_body":{"_id":"5bd5ea50e2e4bd01dd28bdef"},"req_params":{"project":"apitest"},"req_query":{}}
    
      // If no _id is sent return '_id error' - required by HTML!!!!
      //console.log({id: id});
      if (id === '') {res.json({result: 'no _id sent - _id error'});}

      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection(project)
        .deleteOne({_id: ObjectId(id)}, (err, doc) => {
          
          // CHECK DB CONNECTS AND ATTEMPTS TO DELETE
          // console.log({delete_db_connect: "ok"});
          // res.json({delete_db_connect: "ok"});

          // CHECK WHAT IS RETURNED IF SUCCESS
          //console.log({delete_doc_returned: doc});
          //console.log({doc_result: doc.result});
          // res.json({delete_doc_returned: doc});
          // CONSOLE OUTPUT DIFFERENT FROM RES OUTPUT - I BELIEVE IT IS TRUNCATED IN RES!!!
          // {"doc":{"n":1,"opTime":{"ts":"6617831720169242625","t":5},"electionId":"7fffffff0000000000000005","ok":1,"operationTime":"6617831720169242625","$clusterTime":{"clusterTime":"6617831720169242625","signature":{"hash":"1gS0fOexWzFBfrdjeummtkowrK0=","keyId":"6580393220394450946"}}}}
          // HENCE NEED TO USE doc.result.n AND NOT doc.n BELOW
          
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
