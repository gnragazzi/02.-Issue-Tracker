const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { addNewIssue } = require('../lib/db');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .post('/api/issues/testIssue')
        .send({
            "issue_title": "There is not enought testing",
            "issue_text": "Bla bla bla bla",
            "created_on": new Date("2021-08-31T20:03:09.863+00:00"),
            "updated_on": new Date("2021-08-31T20:03:09.863+00:00"),
            "created_by": "Genchu",
            "assigned_to": "Genchu",
            "status_text": "OK"
        })
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            // assert.equal(res.text, `{"issue_title":"There is not enought testing","issue_text":"Bla bla bla bla","created_on":"2021-08-31T20:03:09.863Z","updated_on":"2021-08-31T20:03:09.863Z","created_by":"Genchu","open":true,"assigned_to":"Genchu","status_text":"OK","_id":"612e956f1d401386e70e0568"}`)
            done()
        })
        
    })
    
  test('Create an issue with only required fields: POST request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .post('/api/issues/testIssue')
        .send({
            "issue_title": "There is not enought testing",
            "issue_text": "Bla bla bla bla",
            "created_on": new Date("2021-08-31T20:03:09.863+00:00"),
            "updated_on": new Date("2021-08-31T20:03:09.863+00:00"),
            "created_by": "Genchu",
            "assigned_to": "",
            "status_text": ""
        })
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            // assert.equal(res.text, `{"issue_title":"There is not enought testing","issue_text":"Bla bla bla bla","created_on":"2021-08-31T20:03:09.863Z","updated_on":"2021-08-31T20:03:09.863Z","created_by":"Genchu","open":true,"assigned_to":"","status_text":""}`)
            done()
        })
        
    })
  test('Create an issue with missing required fields: POST request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .post('/api/issues/testIssue')
        .send({
            "issue_title": "",
            "issue_text": "",
            "created_on": new Date("2021-08-31T20:03:09.863+00:00"),
            "updated_on": new Date("2021-08-31T20:03:09.863+00:00"),
            "created_by": "",
            "assigned_to": "",
            "status_text": ""
        })
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            assert.equal(res.text, `{"error":"required field(s) missing"}`)
            done()
        })
        
    })
    test('View issues on a project: GET request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .get('/api/issues/testIssue')
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            assert.include(res.text,'"project":"testIssue"')
            done()
        })
    })
    test('View issues on a project with one filter: GET request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .get('/api/issues/testIssue?created_by=Genchu')
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            assert.include(res.text,'"created_by":"Genchu"')
            done()
        })
    })
    
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .get('/api/issues/testIssue?created_by=Genchu&open=true')
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            assert.include(res.text,'"created_by":"Genchu","open":true')
            done()
        })
    })
    
    test('Update one field on an issue: PUT request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .put('/api/issues/testIssue')
        .send({
            "_id": "6130c37ed90df47e4b5af894",
            "assigned_to": "pipuchu",            
        })
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            assert.equal(res.text, `{"result":"successfully updated","_id":"6130c37ed90df47e4b5af894"}`)
            done()
        })
        
    })
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .put('/api/issues/testIssue')
        .send({
            "_id": "6130c37ed90df47e4b5af894",
            "assigned_to": "pipuchu",
            "status_text": "In-Process"
        })
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            assert.equal(res.text, `{"result":"successfully updated","_id":"6130c37ed90df47e4b5af894"}`)
            done()
        })
    })
    test('Update an issue with missing _id: PUT request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .put('/api/issues/testIssue')
        .send({
            "assigned_to": "pipuchu",
            "status_text": "In-Process"
        })
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            assert.equal(res.text, `{"error":"missing _id"}`)
            done()
        })
    })
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .put('/api/issues/testIssue')
        .send({
            "_id": "6130c37ed90df47e4b5af894",
        })
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            assert.equal(res.text, `{"error":"no update field(s) sent","_id":"6130c37ed90df47e4b5af894"}`)
            done()
        })
    })
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}',(done)=>{
        chai
        .request(server)
        .put('/api/issues/testIssue')
        .send({
            "_id": "genchucito",
            "status_text": "In-Process"
        })
        .end((err,res)=>{
            assert.equal(res.status,200,"response status should be 200.")
            assert.equal(res.type,'application/json')
            assert.equal(res.text, `{"error":"could not update","_id":"genchucito"}`)
            done()
        })
    })
    test('Delete an issue: DELETE request to /api/issues/{project}', (done)=>{
        addNewIssue({
            "project": "testIssue",
            "issue_title": "There is not enought testing",
            "issue_text": "Bla bla bla bla",
            "created_on": new Date("2021-08-31T20:03:09.863+00:00"),
            "updated_on": new Date("2021-08-31T20:03:09.863+00:00"),
            "created_by": "Genchu",
            "assigned_to": "Genchu",
            "status_text": "OK"
        }).then(({_id})=>{
            chai.
            request(server)
            .delete('/api/issues/testIssue')
            .send({
                "_id": _id
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.equal(res.type,'application/json')
                assert.equal(res.text, `{"result":"successfully deleted","_id":"${_id}"}`)
                done()
            })
        })
    })
});
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done)=>{
        chai.
            request(server)
            .delete('/api/issues/testIssue')
            .send({
                "_id": "dummyData"
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.equal(res.type,'application/json')
                assert.equal(res.text, `{"error":"could not delete","_id":"dummyData"}`)
                done()
            })
    })
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done)=>{
        chai.
        request(server)
        .delete('/api/issues/testIssue')
        .end((err,res)=>{
            assert.equal(res.status,200)
            assert.equal(res.type,'application/json')
            assert.equal(res.text, `{"error":"missing _id"}`)
            done()
        })
})
;
