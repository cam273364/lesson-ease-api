
const mongoose = require('mongoose')

const { Schema } = mongoose;


const noteSchema = new Schema({
    
  content: String,
  studentID: String,
  teacherID: String
  
}, { timestaps: true });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;