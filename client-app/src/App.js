import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ZoomMtg } from "@zoomus/websdk";

import testTool from "./tool";

import "./App.css";

const App = () => {
  const { handleSubmit, register } = useForm({
    mode: "onBlur",
  });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
  } = useForm({
    mode: "onBlur",
  });

  const [state, setState] = useState({
    meetings: null,
    form: {
      display_name: "",
      meeting_number: "",
      email: "",
      meeting_pwd: "",
      meeting_role: "0",
    },
  });

  const getMeetings = () => {
    const userId = testTool.USER_ID;
    const url = `${testTool.API_BASE_URL}users/${userId}/meetings`;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
        setState({ meetings: json.body.meetings });
      });
  };

  const getMeeting = (meetingId) => {
    const url = `${testTool.API_BASE_URL}meetings/${meetingId}`;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);

        setState({
          meetings: [...state.meetings],
          form: {
            display_name: json.body.host_email.split("@")[0],
            meeting_number: json.body.id,
            email: json.body.host_email,
            meeting_pwd: json.body.password,
            meeting_role: "1",
          },
        });
      });
  };

  const deleteMeeting = (meetingId) => {
    const url = `${testTool.API_BASE_URL}meetings/${meetingId}`;

    fetch(url, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);

        getMeetings();
      });
  };

  const endMeeting = (meetingId) => {
    const url = `${testTool.API_BASE_URL}meetings/${meetingId}/status`;

    fetch(url, {
      method: "PUT",
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);

        getMeetings();
      });
  };

  const createMeeting = (topic) => {
    const userId = testTool.USER_ID;
    const url = `${testTool.API_BASE_URL}users/${userId}/meetings`;

    const data = { topic };

    console.log(data);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((json) => {
        reset2();
        getMeetings();
      });
  };

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
    getMeetings();
  }, []);

  const onSelectMeeting = (meeting) => {
    getMeeting(meeting.id);
  };

  const onDeleteMeeting = (meeting) => {
    deleteMeeting(meeting.id);
  };

  const onEndMeeting = (meeting) => {
    endMeeting(meeting.id);
  };

  const onSubmitCreateTopicForm = (data) => {
    console.log(JSON.stringify(data));
    createMeeting(data.topic);
  };
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
      <div className="container">
        <div className="row">
          <form
            onSubmit={handleSubmit2(onSubmitCreateTopicForm)}
            className="form-inline topic-form"
          >
            <div className="form-group">
              <label htmlFor="topic">Topic :&nbsp;&nbsp;</label>
              <input
                type="text"
                className="form-control"
                id="topic"
                name="topic"
                ref={register2({ required: true })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Meeting
            </button>
          </form>
        </div>
        <div className="row">
          <div className="panel panel-default">
            {state.meetings && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Meting Id</th>
                    <th>Topic</th>
                    <th>Start Time</th>
                    <th>Time Zone</th>
                    {/* <th>Join Url</th> */}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {state.meetings?.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No meetings!
                      </td>
                    </tr>
                  )}
                  {state.meetings.map((meeting, index) => {
                    return (
                      <tr key={index}>
                        <td>{meeting.id}</td>
                        <td>{meeting.topic}</td>
                        <td>{meeting.start_time}</td>
                        <td>{meeting.timezone}</td>
                        {/* <td>
                      <a href={meeting.join_url} target="_blank">
                        {meeting.join_url}
                      </a>
                    </td> */}
                        <td className="text-right table-buttons">
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={() => {
                                onSelectMeeting(meeting);
                              }}
                            >
                              Select
                            </button>
                            <button
                              type="button"
                              className="btn btn-warning"
                              onClick={() => {
                                onEndMeeting(meeting);
                              }}
                            >
                              End Meeting
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => {
                                onDeleteMeeting(meeting);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

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
                value={state.form?.display_name}
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
                value={state.form?.meeting_number}
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
                value={state.form?.email}
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
                value={state.form?.meeting_pwd}
              />
            </div>

            <div className="form-group">
              <label htmlFor="meeting_role">Role:</label>
              <select
                id="meeting_role"
                name="meeting_role"
                className="sdk-select"
                ref={register}
                value={state.form?.meeting_role}
              >
                <option value="0">Attendee</option>
                <option value="1">Host</option>
                <option value="5">Assistant</option>
              </select>
            </div>
            <button type="submit" className="btn btn-info">
              Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
