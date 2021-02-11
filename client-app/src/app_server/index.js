const jwt = require("jsonwebtoken");
const config = require("./config");
const request = require("request");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;
const API_BASE_URL = "https://api.zoom.us/v2/";
const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, config.APISecret);

app
  .route("/meetings/:meetingId")
  .get((req, res) => {
    const { meetingId } = req.params;
    console.log("meetingId : " + meetingId);
    var options = {
      uri: API_BASE_URL + "meetings/" + meetingId,
      auth: {
        bearer: token,
      },
      headers: {
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json",
      },
      json: true,
    };

    request(options, function (error, response, body) {
      console.log(response.body);
      res.send(response);
    });
  })
  .delete((req, res) => {
    const { meetingId } = req.params;
    console.log("meetingId : " + meetingId);
    var options = {
      uri: API_BASE_URL + "meetings/" + meetingId,
      method: "DELETE",
      auth: {
        bearer: token,
      },
      json: true,
    };

    request(options, function (error, response, body) {
      console.log(response.body);
      res.send(response);
    });
  });

app
  .route("/users/:userId/meetings")
  .get((req, res) => {
    const { userId } = req.params;
    console.log("userId : " + userId);
    var options = {
      uri: API_BASE_URL + "users/" + userId + "/meetings",
      auth: {
        bearer: token,
      },
      headers: {
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json",
      },
      json: true,
    };

    request(options, function (error, response, body) {
      console.log(response.body);
      res.send(response);
    });
  })
  .post((req, res) => {
    const { userId } = req.params;
    const meeting = req.body;

    console.log("userId : " + userId);
    console.log("topic : " + JSON.stringify(meeting));

    const data = {
      topic: meeting.topic,
      type: 2,
      start_time: Date.now(),
      duration: 60,
      timezone: "Europe/London",
      password: null,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        enforce_login: true,
        approval_type: 0,
        auto_recording: "cloud",
      },
    };

    var options = {
      method: "POST",
      uri: API_BASE_URL + "users/" + userId + "/meetings",
      body: data,
      auth: {
        bearer: token,
      },
      headers: {
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json",
      },
      json: true,
    };

    request(options, function (error, response, body) {
      console.log(response.body);
      res.send(response);
    });
  });

app.put("/meetings/:meetingId/status", (req, res) => {
  const { meetingId } = req.params;
  console.log("meetingId : " + meetingId);
  var options = {
    method: "PUT",
    uri: API_BASE_URL + "meetings/" + meetingId + "/status",
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true,
  };

  request(options, function (error, response, body) {
    console.log(response.body);
    res.send(response);
  });
});
app.listen(port, () => console.log(`Server app listening on port ${port}!`));
