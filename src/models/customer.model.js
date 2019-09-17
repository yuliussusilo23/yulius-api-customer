let mongoose = require('mongoose')

const server = 'mongo:27017'
const database = 'yuliusdb'

mongoose.connect('mongodb://'+server+'/'+database)

let CustomerSchema = new mongoose.Schema({
    userName :String,
    accountNumber : Number,
    idNumber : {
        type : Number,
        required : true,
        unique : true
    },
    emailAddress :String
})

module.exports = mongoose.model('Customer', CustomerSchema)