const mongoose = require('mongoose')

const issueSchema = mongoose.Schema({
    project: {type: String, required:true },
    issue_title: {type: String, required:true },
    issue_text: {type: String, required:true },
    created_on: {type: Date, required:true },
    updated_on: {type: Date, required:true },
    created_by: {type: String, required:true },
    open: {type: Boolean, default:true, },
    assigned_to: String,
    status_text: String
})

module.exports = mongoose.model('IssueTrackerProjectModel', issueSchema)