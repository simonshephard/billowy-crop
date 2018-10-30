/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var ObjectId = require('mongodb').ObjectID;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          //assert.equal(res.body.docs[0].issue_title, 'Title');
          assert.equal(res.body.docs[0].issue_text, 'text');
          assert.equal(res.body.docs[0].created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.docs[0].assigned_to, 'Chai and Mocha');
          assert.equal(res.body.docs[0].status_text, 'In QA');
          assert.isDefined(res.body.docs[0].created_on);
          assert.isDefined(res.body.docs[0].updated_on);
          assert.equal(res.body.docs[0].open, true);
          assert.isDefined(res.body.docs[0]._id);
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Only required fields filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.docs[0].issue_title, 'Title');
          assert.equal(res.body.docs[0].issue_text, 'text');
          assert.equal(res.body.docs[0].created_by, 'Functional Test - Only required fields filled in');
          assert.equal(res.body.docs[0].assigned_to, '');
          assert.equal(res.body.docs[0].status_text, '');
          assert.isDefined(res.body.docs[0].created_on);
          assert.isDefined(res.body.docs[0].updated_on);
          assert.equal(res.body.docs[0].open, true);
          assert.isDefined(res.body.docs[0]._id);
          done();
        });
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
        })
        .end(function(err, res){
          assert.equal(res.body.result, 'required not completed');
          done();
        });
        
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        var postedId;
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          postedId = res.body.docs[0]._id;
        });

        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: postedId
        })
        .end(function(errPut, resPut){
          assert.equal(resPut.status, 200);
          assert.equal(resPut.body.result, 'no updated field sent');
          done();
        });
      });
      
      test('One field to update', function(done) {
        var postedId;
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          postedId = res.body.docs[0]._id;
        });

        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: postedId,
          issue_title: 'Title2'
        })
        .end(function(errPut, resPut){
          assert.equal(resPut.status, 200);
          assert.equal(resPut.body.docs[0].issue_title, 'Title2');
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        var postedId;
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          postedId = res.insertedId;
        });
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: postedId,
          issue_title: 'Title2',
          issue_text: 'Text2',
          created_by: 'Created2',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.docs[0].issue_title, 'Title2');
          assert.equal(res.body.docs[0].issue_text, 'Text2');
          assert.equal(res.body.docs[0].created_by, 'Created2');
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.docs);
          assert.property(res.body.docs[0], 'issue_title');
          assert.property(res.body.docs[0], 'issue_text');
          assert.property(res.body.docs[0], 'created_on');
          assert.property(res.body.docs[0], 'updated_on');
          assert.property(res.body.docs[0], 'created_by');
          assert.property(res.body.docs[0], 'assigned_to');
          assert.property(res.body.docs[0], 'open');
          assert.property(res.body.docs[0], 'status_text');
          assert.property(res.body.docs[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test?open=true')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.docs);
          assert.property(res.body.docs[0], 'issue_title');
          assert.property(res.body.docs[0], 'issue_text');
          assert.property(res.body.docs[0], 'created_on');
          assert.property(res.body.docs[0], 'updated_on');
          assert.property(res.body.docs[0], 'created_by');
          assert.property(res.body.docs[0], 'assigned_to');
          assert.property(res.body.docs[0], 'open');
          assert.property(res.body.docs[0], 'status_text');
          assert.property(res.body.docs[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test?open=true&issue_title=Title')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.docs);
          assert.property(res.body.docs[0], 'issue_title');
          assert.property(res.body.docs[0], 'issue_text');
          assert.property(res.body.docs[0], 'created_on');
          assert.property(res.body.docs[0], 'updated_on');
          assert.property(res.body.docs[0], 'created_by');
          assert.property(res.body.docs[0], 'assigned_to');
          assert.property(res.body.docs[0], 'open');
          assert.property(res.body.docs[0], 'status_text');
          assert.property(res.body.docs[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          "_id": ""
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'no _id sent - _id error');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        var postedId;
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          // console.log({insertedID: res.insertedId});
          postedId = res.body.docs[0]._id;
        });
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: postedId
        })
        .end(function(errDel, resDel){
          assert.equal(resDel.status, 200);
          assert.equal(resDel.body.result, 'success: deleted ' + postedId);
          done();
        });
      });
      
    });

});
