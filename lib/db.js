require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI,{
    useUnifiedTopology: true,
    useNewUrlParser:true
},()=>console.log('DB CONNECTED: 😎'))

const IssueModel = require('../models/Issue')

module.exports = {
    addNewIssue : async (data) => await new IssueModel(data).save(),
    getProject: async (project) => await IssueModel.find({project}),
    updateIssue: async (_id,updateObj) => await IssueModel.findByIdAndUpdate(_id,{...updateObj, updated_on: new Date()},{new: true}),
    deleteIssue: async (_id) => await IssueModel.findByIdAndDelete(_id)
}