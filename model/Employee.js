const mongoose = require('mongoose')
const Schema = mongoose.Schema

// ObjectId automatically created
const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Employee', employeeSchema)