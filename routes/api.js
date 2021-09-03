'use strict';
const {addNewIssue, getProject, updateIssue, deleteIssue} = require('../lib/db')
const filterFunction = require('../lib/filterFunction')
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res)=>{
      let project = req.params.project;
      let queries = Object.keys(req.query)
      let projectIssues = await getProject(project);
      if(queries.length > 0) {
        
        queries.forEach(queryFilter =>{
          if(projectIssues[0][queryFilter]){
            projectIssues = filterFunction(projectIssues,queryFilter,req.query)
          }
        })
      }
      res.json(projectIssues)
    })
    
    .post(async(req, res)=>{
      let project = req.params.project;
      const {issue_title,issue_text,created_by,status_text,assigned_to, created_on, updated_on} = req.body
      if(!issue_title || !issue_text || !created_by) return res.json({ 'error': 'required field(s) missing' })
      const issueData = {
        project: project,
        issue_title,
        issue_text,
        created_on: created_on? created_on:new Date(),
        updated_on: updated_on? updated_on:new Date(),
        created_by,
        open: true,
        assigned_to,
        status_text,
        
      }
      const newIssue = await addNewIssue(issueData);
      const returnIssue = {...newIssue._doc}
      delete returnIssue.project
      delete returnIssue.__v
      res.json(returnIssue)
    })
    
    .put(async(req, res) =>{
      const {_id} = req.body
      // Tengo que estar atento a que tal vez la respuesta que espera el test-suite sea send y no json.
      if(!_id) return res.json({ error: 'missing _id' })
      
      const updateObj = {...req.body}
      delete updateObj._id
      let isUpdateObj = false
      for(const key in updateObj)if(key)  isUpdateObj = true
      if(!isUpdateObj) return res.json({ error: 'no update field(s) sent', _id })
      
      try {
        const updatedIssue = await updateIssue(_id,updateObj)
        res.json({  result: 'successfully updated', '_id': _id })
      } catch (error) {
        res.json({ error: 'could not update', _id })
      }
    })
    
    .delete(async function (req, res){
      const {_id} = req.body
      if(!_id) return res.json({ error: 'missing _id' })
      try {
        await deleteIssue(_id)
        res.json({ result: 'successfully deleted', _id })
      } catch (error) {
        res.json({ error: 'could not delete', _id })
      }
    });
    
};
