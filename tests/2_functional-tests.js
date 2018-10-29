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
          console.log(res.body);
          // fill me in too!
          assert.equal(res.body.docs[0].issue_title, 'Title');
          assert.equal(res.body[0].issue_text, 'text');
          assert.equal(res.body[0].created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          assert.equal(res.body[0].status_text, 'In QA');
          assert.isDefined(res.body[0].created_on);
          assert.isDefined(res.body[0].updated_on);
          assert.equal(res.body[0].open, true);
          assert.isDefined(res.body[0]._id);
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
          assert.equal(res.body[0].issue_title, 'Title');
          assert.equal(res.body[0].issue_text, 'text');
          assert.equal(res.body[0].created_by, 'Functional Test - Only required fields filled in');
          assert.equal(res.body[0].assigned_to, "");
          assert.equal(res.body[0].status_text, "");
          assert.isDefined(res.body[0].created_on);
          assert.isDefined(res.body[0].updated_on);
          assert.equal(res.body[0].open, true);
          assert.isDefined(res.body[0]._id);
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
          assert.isUndefined(res);
          done();
        });
        
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
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
         chai.request(server)
          .put('/api/issues/test')
          .send({
            "_id": ObjectId(res.insertedId)
          })
          .end(function(err2, res2){
            assert.equal(res2.status, 200);
            assert.equal(res2.result, 'no updated field sent');
            done();
           });
         done();
        });
      });
      
      test('One field to update', function(done) {
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
         chai.request(server)
          .put('/api/issues/test')
          .send({
            "_id": ObjectId(res.insertedId),
            issue_title: 'Title2',
          })
          .end(function(err2, res2){
            //console.log({res2status: res2.status});
            assert.equal(res2.status, 200);
            console.log({res2body: res2.body});
            assert.equal(res2.body.docs[0].issue_title, 'Title2');
            done();
           });
         done();
        });
      });
      
      test('Multiple fields to update', function(done) {
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
         chai.request(server)
          .put('/api/issues/test')
          .send({
            "_id": ObjectId(res.insertedId),
            issue_title: 'Title2',
            issue_text: 'Text2',
            created_by: 'Created2',
          })
          .end(function(err2, res2){
            //console.log(res2);
            assert.equal(res2.status, 200);
            assert.equal(res2.docs[0].issue_title, 'Title2');
            assert.equal(res2.docs[0].issue_text, 'Text2');
            assert.equal(res2.body[0].created_by, 'Created2');
            done();
           });
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
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
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
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test?open=true&issue_title=Title')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          console.log({getresbody: res.body});
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
          chai.request(server)
          .delete('/api/issues/test')
          .send({
            "_id": ObjectId("    ")
          })
          .end(function(err2, res2){
            assert.equal(res2.status, 200);
            assert.equal(res2.result, 'xxxx');
            done();
          });
      });
      
      test('Valid _id', function(done) {
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
          chai.request(server)
          .delete('/api/issues/test')
          .send({
            "_id": ObjectId(res.insertedId)
          })
          .end(function(err2, res2){
            assert.equal(res2.status, 200);
            assert.equal(res2.result, 'success: deleted ' + res.insertedId);
            done();
          });
         done();
        });
      });
      
    });

});
