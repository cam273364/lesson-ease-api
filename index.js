const mongoose = require('mongoose');
const User = require('./models/UserModel')
const Note = require('./models/NotesModel')
const express = require('express')
const app = express()
const cors = require('cors');
var bodyParser = require('body-parser')
require('dotenv').config();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
var jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3001


// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Something Different')
})

app.post('/signup', function (req, res) {
    console.log(req.body)
    const user = new User ({ email: req.body.email, password: req.body.password, instructor: req.body.instructor})
    user.save().then(() => res.send('success'))
    
})

app.post('/login', function (req, res) {
    console.log(req.body)
    User.findOne({ email: req.body.email, password: req.body.password }).then((user) => {
        console.log(user)
        if(!user){
            res.json({ userID: false, instructor: false })
        } else {
            var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'shhhhh');
            console.log(token)
            res.json({ userID: user._id, instructor: user.instructor, token })
        }
        
    })
    
})

app.post('/userinfoupdate', function (req, res) {
    console.log(req.body)
    const {userID, ...rest} = req.body
    console.log(rest)
    console.log(userID)
    User.findByIdAndUpdate(userID, rest).then((user) => {
        console.log(user)
        res.send('some message')
        
    })

    
})

app.post('/user', function (req, res) {
    console.log(req.body)
    User.findOne({ _id: req.body.userID }).then((user) => {
        console.log(user)
        res.json({ user: user })
    })
    
})

app.get('/students', function (req, res) {
    User.find({instructor: {$ne: true}}).then((users) => {
        res.json(users)
    })
})

app.post('/addnote', function (req, res) {
    const {content, studentID, teacherID} = req.body
    const note = new Note({content: content, studentID: studentID, teacherID: teacherID})
    note.save().then(() => res.send('added note'))
})

app.get('/notes', function (req, res) {
    
    const {studentID, teacherID} = req.query
    Note.find({studentID: studentID, teacherID: teacherID}).then((notes) => {
        res.json(notes)
    })
})

app.delete('/deletenote/:id', function (req, res) {
    Note.findByIdAndDelete(req.params.id).then(() => {
        console.log('deleted note')
        res.json({status: true})
    })
        
})

app.get('/student/:studentID', function (req, res) {
    User.findById(req.params.studentID).then((student) => {
        res.json(student)
    })
})

app.get('/myinstructors/:id', function (req, res) {
    User.find({instructor: true}).then((instructors) => {
        console.log(instructors)
        res.json(instructors)
     })
})

app.get('/test', function (req, res) {
    res.send("testing route")
})

//find all users who are instructors
//({content: req.body.content})
//destructure userid off of request body in line 40/41
//findbyidandupdate
//const userid ...rest = body
app.listen(PORT, () => {

    mongoose.connect(process.env.MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      mongoose.connection.once('open', () => {
        console.log('Connected to MongoDB!')
    })
})