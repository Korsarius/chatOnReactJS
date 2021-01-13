import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionLogin, actionUserFindOne } from "../actions/requests";
import { actionPromise } from "../actions/promiseActions";
import { check, checkTwo } from "../App";
import { Spin, Alert } from "antd";
import "antd/dist/antd.css";
import "../App.css";
import "./styles/login-form.css";

const mapStateToProps = (state) => ({
  token: checkTwo`${state}promiseReducer.payload.data.login`,
  state: state,
  id: checkTwo`${state}AuthReducer.data.sub.id`,
  failure: checkTwo`${state}promiseReducer.userLogin.error`,
});
const mapDispatchToProps = {
  onLogin: actionLogin,
  onPromise: actionPromise,
  onUserFind: actionUserFindOne,
};

const NormalLoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ onLogin, history, state, id, failure }) => {
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(false);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  // const [spin, setSpin] = useState(false);

  useEffect(() => {
    if (id) {
      setTimeout(
        () =>
          history.push(
            `/myproject/auth/userId=${checkTwo`${state}AuthReducer.data.sub.id`}`
          ),
        2000
      );
    } else if (failure) {
      setError(() => true);
    }
  }, [id, failure]);

  return (
    <section className="LoginForm">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <h1> Sign in to Chat </h1>
        <span
          className="error-value"
          style={{
            visibility: error ? "visible" : "hidden",
          }}
        >
          Incorrect username or password.
        </span>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={{
              color: error ? "red" : "black",
            }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              color: error ? "red" : "black",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox> Remember me </Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              onLogin(login, password);
              // setSpin(() => true);
            }}
            type="primary"
            htmlType="submit"
            id="log-in"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <Link to={`/myproject/registration`}> register now! </Link>
        </Form.Item>
      </Form>
      {/* {spin && <Spin tip="Loading..." size="large" /> && setTimeout(()=>{setSpin(() => true)},2000)} */}
    </section>
  );
});

export default NormalLoginForm;
