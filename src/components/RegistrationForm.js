import React, { useState, useEffect } from "react";
import { Input, Button, Form, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { actionRegistration } from "../actions/requests";
import { actionLogout } from "../actions/authorization";
import { connect } from "react-redux";
import { check, checkTwo } from "../App";
import "../App.css";
import "./styles/registration-form.css";

actionLogout();

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const RegisterFormTwo = connect(
  (state) => ({
    state: state,
    id: checkTwo`${state}AuthReducer.data.sub.id`,
    failure: checkTwo`${state}promiseReducer.regitration.error`,
  }),
  {
    onRegistration: actionRegistration,
  }
)(({ state, onRegistration, history, id, failure }) => {
  const [login, setLogin] = useState("");
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      setTimeout(
        () =>
          history.push(
            `/auth/userId=${checkTwo`${state}AuthReducer.data.sub.id`}`
          ),
        2000
      );
    } else if (failure) {
      setError(() => true);
    }
  }, [id, failure]);

  return (
    <section className="RegistrationForm">
      <Form>
        <h1> Registration </h1>
        <span
          className="error-value"
          style={{
            visibility: error ? "visible" : "hidden",
          }}
        >
          User {login} already exists
        </span>
        <Form.Item
          name="login"
          label="Login"
          rules={[
            {
              required: true,
              message: "Please input your Login",
            },
          ]}
        >
          <Input value={login} onChange={(e) => setLogin(e.target.value)} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  "The two passwords that you entered do not match!"
                );
              },
            }),
          ]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="nickname"
          label={
            <span>
              Nickname &nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            {
              required: true,
              message: "Please input your nickname!",
              whitespace: true,
            },
          ]}
        >
          <Input value={nick} onChange={(e) => setNick(e.target.value)} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button
            style={{ width: "100%" }}
            onClick={() => {
              onRegistration(login, password, nick);
            }}
            disabled={
              login.length <= 2 ||
              login.length > 35 ||
              password !== confirmPassword ||
              nick.length <= 2 ||
              nick.length > 15
                ? true
                : false
            }
            type="primary"
            htmlType="submit"
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
});

export default RegisterFormTwo;
