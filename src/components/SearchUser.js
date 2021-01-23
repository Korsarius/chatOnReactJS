import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Input, Button } from "antd";
import {
  actionUserFindOneOnLogin,
  actionCreateChat,
  actionFindAllChats,
  actionChatWithSelectedUser,
} from "../actions/requests";
import { EmojiList, youtube, YOUTUBE_REGEXP } from "./emojiList";
import { checkTwo } from "../App";
import Modal from "../components/ModalWindowCreateChat";
import "./styles/user-page.css";

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
        {chatCreate && (
          <Modal
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
                      src={`/${foundUser.avatar.url}`}
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
                <li>
                  <span className="menu-item-name">Login: </span>
                  <button
                    className="write-to-user"
                    datatitle="Write Him"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      onChatWithSelectedUser(
                        foundUser.login,
                        state.AuthReducer.data.sub.id,
                        foundUser._id
                      )
                    }
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
