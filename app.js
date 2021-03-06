const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  mailchimp.setConfig({
    apiKey: "***********************",
    server: "us7",
  });

  const listId = "e15c313501";
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
    res.sendFile(__dirname + "/succes.html");
  }

  run().catch((err)=>{
    res.sendFile(__dirname +"/failure.html");
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server run on port 3000");
});
