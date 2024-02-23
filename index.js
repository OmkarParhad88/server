const mongoose = require('mongoose')
const express = require('express');
const dcrypt = require('bcrypt');
const internshipModel = require('./models/internship');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookiePar = require('cookie-parser');

const app = express();
app.use(cors())
app.use(express.json())
app.use(cookiePar());

mongoose.connect("mongodb://localhost:27017/internship");

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
    internshipModel.create({name:name ,email : email ,password:hash})
    .then((internships) => res.json(internships))
    .catch(err => res.json(err))
    }).catch(err => res.json(err))
  
})

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  internshipModel.findOne({ email: email })
    .then(user => {
      if (user) {
        dcrypt.compare(password, user.password, (error, response) => {
          if (response) {
            const token = jwt.sign({ email: user.email }, "jwt-secret-key", { expiresIn: "1d" })
            res.cookie("token",token)
            res.json("Success")
          } else {
            res.json("the password in incorrect")
          }
        })
      } else {
        res.json("user not found!")
      }
    })
})
app.listen(3001, () => {
  console.log("server is running.....")
})