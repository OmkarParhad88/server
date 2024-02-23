const mongoose = require('mongoose')
const express = require('express');
const bcrypt = require('bcrypt');
const internshipModel = require('./models/internship');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


app.use(express.json())
app.use(cors(
  {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
))
app.use(cookieParser());

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
            res.cookie("token", token);
            res.json("Success");
          } else {
            res.json("the password in incorrect")
          }
        })
      } else {
        res.json("user not found!")
      }
    })
})
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.json("token not found!")
  }
  else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json("token is wrong")
      next();
    })
  }
}
app.get("/home", verifyUser, (req, res) => {
  return res.json("Success")
})
app.listen(3001, () => {
  console.log("server is running.....")
})