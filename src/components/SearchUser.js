import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Input, Button, Modal, Space } from "antd";
import {
  actionUserFindOneOnLogin,
  actionCreateChat,
  actionFindAllChats,
  actionChatWithSelectedUser,
} from "../actions/requests";
import { EmojiList, youtube, YOUTUBE_REGEXP } from "./emojiList";
import { checkTwo } from "../App";
import MyModal from "../components/ModalWindowCreateChat";
import "./styles/user-page.css";

// For Modals (antd library)

let resultCode = 0;

function info() {
  Modal.info({
    title: "This is a notification message",
    content: (
      <div>
        <p>some messages...some messages...</p>
        <p>some messages...some messages...</p>
      </div>
    ),
    onOk() {},
  });
  return resultCode = 0;
}

function success() {
  Modal.success({
    title: "Success",
    content: "Chat has been created successfully!",
  });
  return resultCode = 0;
}

function error() {
  Modal.error({
    title: "Error",
    content: "A personal conversation with such user already exists!",
  });
  return resultCode = 0;
}

function warning() {
  Modal.warning({
    title: "This is a warning message",
    content: "some messages...some messages...",
  });
  return resultCode = 0;
}

// If user doesn't have avatar image

function generateColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

let randomColor = generateColor();

const SearchUser = connect(
  (state) => ({
    state: state,
    foundUser: checkTwo`${state}promiseReducer.userFindOneOnLogin.payload.data.UserFindOne`,
    userId: checkTwo`${state}AuthReducer.data.sub.id`,
    chat: checkTwo`${state}promiseReducer.createChat.payload.data.ChatUpsert`,
  }),
  {
    onChatWithSelectedUser: actionChatWithSelectedUser,
    findUserByLogin: actionUserFindOneOnLogin,
    onChatCreate: actionCreateChat,
    onFindChats: actionFindAllChats,
  }
)(
  ({
    findUserByLogin,
    foundUser,
    state,
    onChatWithSelectedUser,
    onChatCreate,
    login,
    userId,
    chat,
    onUserFindOne,
    onFindChats,
  }) => {
    const [nick, setNick] = useState("");
    const [find, setFind] = useState(false);

    const [chatTitle, setChatTitle] = useState("");
    const [chatCreate, setCreate] = useState(false);

    let updateModal = function (bool) {
      setCreate(() => bool);
    };

    useEffect(() => {
      onFindChats(userId);
    }, [chatCreate]);

    return (
      <div className="search">
        {resultCode && resultCode === 1
          ? success()
          : resultCode === 2
          ? error()
          : ""}
        {chatCreate && (
          <MyModal
            userId={userId}
            login={login}
            updateModal={updateModal}
            findUserByLogin={findUserByLogin}
          />
        )}
        <div className="create-chat">
          <h3>Create Chat</h3>
          <Button
            id="search-button"
            onClick={() => {
              setCreate(() => true);
            }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Create Chat
          </Button>
        </div>
        <h3>Search User</h3>
        <Input
          id="search-input"
          placeholder="Enter User Login"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
        ></Input>
        <Button
          id="search-button"
          onClick={() => {
            findUserByLogin(nick);
            setFind(true);
          }}
          type="primary"
          htmlType="submit"
          className="login-form-button"
          disabled={nick.length < 2 ? true : false}
        >
          Search
        </Button>
        <div className="user-found">
          <ul>
            {find && foundUser ? (
              <>
                <li>
                  {foundUser && foundUser.avatar && foundUser.avatar.url ? (
                    <img
                      id="avatarka-user-search"
                      src={`http://chat.fs.a-level.com.ua/${foundUser.avatar.url}`}
                      alt="avatar"
                    ></img>
                  ) : (
                    <span
                      id="random-color"
                      style={{ backgroundColor: `${randomColor}` }}
                    >
                      <span>{foundUser.login.substr(0, 2)}</span>
                    </span>
                  )}
                </li>
                <li className="write-to-user--wrapper">
                  <span className="menu-item-name">Login: </span>
                  <button
                    className="write-to-user"
                    datatitle="Write Him"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      onChatWithSelectedUser(
                        foundUser.login,
                        state.AuthReducer.data.sub.id,
                        foundUser._id
                      ).then((code) => (resultCode = code));
                      setTimeout(() => onUserFindOne(login), 1000);
                    }}
                  >
                    {foundUser.login}
                  </button>
                </li>
                <li>
                  <span className="menu-item-name">Nick: </span>
                  {foundUser.nick !== null ? foundUser.nick : `\u2013`}
                </li>
                <li>
                  <span className="menu-item-name">Registration date: </span>
                  {new Date(+foundUser.createdAt).toLocaleString()}
                </li>
              </>
            ) : (
              find && <span className="user-not-found">Not Found</span>
            )}
          </ul>
        </div>
      </div>
    );
  }
);

export default SearchUser;
