import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ZoomMtg } from "@zoomus/websdk";

import testTool from "./tool";

import "./App.css";

const App = () => {
  const { handleSubmit, register } = useForm();

  useEffect(() => {
    console.log("checkSystemRequirements");
    console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));
    console.log(
      "Local" +
        ZoomMtg.getJSSDKVersion()[0] +
        testTool.detectOS() +
        "#" +
        testTool.getBrowserInfo()
    );
  }, []);
  const onSubmitForm = (data) => {
    console.log(JSON.stringify(data));

    const display_name = data.display_name;
    const meeting_number = data.meeting_number;
    const email = data.email;
    const meeting_pwd = data.meeting_pwd;
    const meeting_role = data.meeting_role;

    testTool.setCookie("display_name", display_name);
    testTool.setCookie("meeting_number", meeting_number);
    testTool.setCookie("email", email);
    testTool.setCookie("meeting_pwd", meeting_pwd);
    testTool.setCookie("meeting_role", meeting_role);

    const meetingConfig = testTool.getMeetingConfig();

    const signature = ZoomMtg.generateSignature({
      meetingNumber: meetingConfig.mn,
      apiKey: testTool.API_KEY,
      apiSecret: testTool.API_SECRET,
      role: meetingConfig.role,
      success: function (res) {
        console.log(res.result);
        meetingConfig.signature = res.result;
        meetingConfig.apiKey = testTool.API_KEY;
        const joinUrl = "/meeting.html?" + testTool.serialize(meetingConfig);
        console.log(joinUrl);
        window.open(joinUrl, "_blank");
      },
    });
  };

  return (
    <div>
      <header>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">
                Zoomer
              </a>
            </div>

            <ul className="nav navbar-nav"></ul>
            <ul className="nav navbar-nav navbar-right"></ul>
          </div>
        </nav>
      </header>
      <div className="container" style={{ width: "350px" }}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="form-group">
            <label htmlFor="display_name">Name:</label>
            <input
              className="form-control"
              id="display_name"
              name="display_name"
              placeholder="Display name"
              required
              ref={register}
            />
          </div>
          <div className="form-group">
            <label htmlFor="meeting_number">Meeting id:</label>
            <input
              type="number"
              className="form-control"
              id="meeting_number"
              name="meeting_number"
              placeholder="Meeting id"
              required
              ref={register}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Email option"
              ref={register}
            />
          </div>
          <div className="form-group">
            <label htmlFor="meeting_pwd">Password:</label>
            <input
              type="text"
              className="form-control"
              id="meeting_pwd"
              name="meeting_pwd"
              required
              ref={register}
            />
          </div>

          <div className="form-group">
            <label htmlFor="meeting_role">Role:</label>
            <select
              id="meeting_role"
              name="meeting_role"
              className="sdk-select"
              ref={register}
            >
              <option value="0">Attendee</option>
              <option value="1">Host</option>
              <option value="5">Assistant</option>
            </select>
          </div>
          <button type="submit" className="btn btn-default">
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
