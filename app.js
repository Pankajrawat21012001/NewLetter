const express = require('express');
const app = express();

const bodyParser = require("body-parser");
const request = require("request");

const https = require('https');

app.use(express.static("static"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const signUpEmail = req.body.mail;
  console.log(firstName);
  console.log(lastName);
  console.log(signUpEmail);

  const client = require("@mailchimp/mailchimp_marketing");
  client.setConfig({
    apiKey: "315278e0bc54c6f4407f682f3d2fcd73-us21",
    server: "us21",
  });
  const run = async () => {
    const response = await client.lists.batchListMembers("00075c45ae", {
      members: [{
        email_address: signUpEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }]
    });
    // console.log(response);
    // console.log(response.statusCode);

    console.log(response.errors);
    var errorCount = response.error_count;
    if (errorCount > 0) {
      // console.log(response.errors[0].error);
      // console.log(response.errors[0].error_code);
      res.sendFile(__dirname + "/failure.html");
    } else {
      // console.log("ALL CLEAR 😊");
      res.sendFile(__dirname + "/success.html");
    }

  };
  run();
})





app.listen(process.env.PORT || 3000, function() {
  console.log("Server has successfully started at port 3000");
});

// API KEY
// 315278e0bc54c6f4407f682f3d2fcd73-us21

// UNIQUE ID
// 00075c45ae
