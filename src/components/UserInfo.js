import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { Button } from "antd";
import { actionUpload } from "../actions/requests";
import { actionLogout } from "../actions/authorization";
import { checkTwo } from "../App";
import "./styles/user-page.css";

function generateColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

let randomColor = generateColor();

const UserInfo = connect(
  (state) => ({
    state: state,
    // user: JSON.parse(localStorage.getItem("authUser")) || checkTwo`${state}promiseReducer.userFindOne.payload.data.UserFindOne`,
    user: checkTwo`${state}promiseReducer.userFindOne.payload.data.UserFindOne`,
    userId: checkTwo`${state}promiseReducer.userFindOne.payload.data.UserFindOne._id`,
  }),
  {
    onUpload: actionUpload,
    onLogout: actionLogout,
  }
)(
  ({
    state,
    login,
    onLogout,
    history,
    // user,
    userId,
    onUserFindOne,
    onUpload,
    user,
  }) => {
    const [upload, setMedia] = useState(false);

    const [scrollTop, setScrollTop] = useState(0);
    const [scrollToTop, setScrollToTop] = useState(0);

    const ref = useRef();
    const refForm = useRef();

    useEffect(() => {
      setTimeout(() => {
        onUserFindOne(login);
      }, 1000);
    }, [upload]);

    return (
      <div className="user-info">
        <Scrollbars
          universal
          ref={ref}
          thumbSize={150}
          onScroll={() => {
            setScrollToTop(() => ref.current.getScrollTop());
          }}
        >
          {(checkTwo`${state}promiseReducer.userFindOne.payload.data.UserFindOne.avatar` && (
            <img
              id="avatarka"
              src={`http://chat.fs.a-level.com.ua/${checkTwo`${state}promiseReducer.userFindOne.payload.data.UserFindOne.avatar.url`}`}
            ></img>
          )) || (
            <span
              id="random-color"
              style={{ backgroundColor: `${randomColor}` }}
            >
              <span>{login.substr(0, 2)}</span>
            </span>
          )}
          <h1>{login}</h1>
          <Button
            id="log-out"
            onClick={() => {
              onLogout();
              history.push("/login");
            }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log Out
          </Button>
          <span className="menu-item-name">Сменить аватар</span>
          <form
            action="/upload"
            method="post"
            encType="multipart/form-data"
            ref={refForm}
          >
            <input
              type="file"
              name="media"
              onChange={() => {
                console.log("ref.current: ", refForm.current);
                onUpload(refForm.current, userId);
                setMedia(!upload);
              }}
            />
          </form>
          <ul>
            {user ? (
              <>
                <li id="user-nick">
                  <span className="menu-item-name">Nick: </span>
                  {user.nick}
                </li>
                <li id="user-reg-date">
                  <span className="menu-item-name">Registration date: </span>
                  {new Date(+user.createdAt).toLocaleString()}
                </li>
                {user.chats
                  ? user.chats.map((el, index) => (
                      <Link
                        to={`/auth/userId=${state.AuthReducer.data.sub.id}&chatId=${el._id}`}
                        key={el._id}
                      >
                        <li id={el["title"]}>
                          <button className="ant-btn ant-btn-primary login-form-button">
                            {el["title"] !== "" ? el["title"] : "unnamed"}
                          </button>
                        </li>
                      </Link>
                    ))
                  : ""}
              </>
            ) : (
              <span>Error</span>
            )}
          </ul>
        </Scrollbars>
        <div className="scroll-up">
          <span
            className="icon-circle-up"
            style={{
              visibility: scrollTop == scrollToTop ? "hidden" : "visible",
            }}
            onClick={() => {
              ref.current.scrollToTop();
              setScrollTop(() => ref.current.getScrollTop());
            }}
          ></span>
        </div>
      </div>
    );
  }
);

export default UserInfo;
