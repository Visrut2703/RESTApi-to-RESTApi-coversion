const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(express.json());

const restUser1 = mongoose.createConnection("mongodb://0.0.0.0:27017/restUser");
const restUser2 = mongoose.createConnection("mongodb://0.0.0.0:27017/restUser1");


function getCurrentTime() {
  var currentTime = new Date();
  var formattedTime = currentTime.toLocaleTimeString();
  return formattedTime;
}

const registerSchema = {
  numPlate : String,
  allocation : String,
  time: {
   type: Date,
   default: Date.now
 }
};
const paymentSchema = {
  numPlate : String ,
  allocation : String,

  time : {
    type : Date,
    default : Date.now
  }
};
var Register = restUser1.model("Register" , registerSchema);
var Payment = restUser2.model("Payment" , paymentSchema);
module.exports = Register;
module.exports = Payment;

app.get("/payments" , async function(req , res){

  let plate = req.body.numPlate;

  try {
    console.log(plate);
    // let val;
    let data = await Register.find({numPlate : plate});
      const newPayment = new Payment({
        numPlate : req.body.numPlate,
        allocation : req.body.allocation
      });
      const err = await newPayment.save();
      res.json(data);
  } catch (e) {
    console.log(e);
  }
});


app.post("/registers" , function(req , res){
  const newRegister = new Register({
    numPlate : req.body.numPlate,
    allocation : req.body.allocation
  });
  const err = newRegister.save().catch(err=>err);
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
