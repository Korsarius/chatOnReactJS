import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Input, Button } from "antd";
import {
  actionUserFindOneOnLoginForCreatChat,
  actionCreateChat,
  actionFindAllChats,
  // actionChatWithSelectedUser,
} from "../actions/requests";
import {
  actionAddUsersLogin,
  actionAddUsersLoginBackToChat,
  actionDeleteUsersLogin,
  actionDeleteUsersLoginFromChat,
  actionFoundUsersLogin,
  actionSaveUsersLogin,
} from "../actions/chatCreate";
import { checkTwo } from "../App";
import MyPortal from "../components/MyPortal";
import "./styles/modal-window.css";

const MyModal = connect(
  (state) => ({
    state: state,
    foundUser: checkTwo`${state}promiseReducer.userFindOneOnLoginForCreatChat.payload.data.UserFindOne.login`,
    // userId: checkTwo`${state}AuthReducer.data.sub.id`,
    // chat: checkTwo`${state}promiseReducer.createChat.payload.data.ChatUpsert`,
    usersToChat:
      checkTwo`${state}chatCreateReducer.addOrDeleteUserToChat.users` || [],
    usersFromChat:
      checkTwo`${state}chatCreateReducer.saveFoundUsersLogin.users` || [],
  }),
  {
    // onChatWithSelectedUser: actionChatWithSelectedUser,
    findUserByLogin: actionUserFindOneOnLoginForCreatChat,
    // onChatCreate: actionCreateChat,
    // onFindChats: actionFindAllChats,
    onSaveUserLogin: actionSaveUsersLogin,
    onDeleteUserFromChat: actionDeleteUsersLoginFromChat,
    onSaveFoundUsernames: actionFoundUsersLogin,
    onDeleteUsersLogin: actionDeleteUsersLogin,
    onAddUsersBackToChat: actionAddUsersLoginBackToChat,
  }
)(
  ({
    state,
    foundUser,
    usersToChat,
    usersFromChat,
    login,
    // onChatCreate,
    // userId,
    // chat,
    updateModal,
    findUserByLogin,
    onSaveUserLogin,
    onDeleteUserFromChat,
    onSaveFoundUsernames,
    onDeleteUsersLogin,
    onAddUsersBackToChat,
  }) => {
    const [chatTitle, setChatTitle] = useState("");
    const [userLogin, setuserLogin] = useState("");

    console.log("state: ", state);

    useEffect(() => {
      if (
        foundUser &&
        foundUser.length > 0 &&
        !usersToChat.includes(foundUser)
      ) {
        onSaveUserLogin("addOrDeleteUserToChat", foundUser);
      }
    }, [foundUser]);

    return (
      <>
        <MyPortal>
          <div className="modal-overlay">
            <div className="modal-window">
              <div className="header-line">
                <h3>Create chat</h3>
                <span
                  className="icon-x-square"
                  onClick={(e) => updateModal(false)}
                ></span>
              </div>
              <div className="modal-header"></div>
              <div className="modal-body">
                <Input
                  id="create-chat-input"
                  placeholder="Enter Chat Title"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                ></Input>
                <Input
                  id="search-input"
                  placeholder="Enter User Login"
                  value={userLogin}
                  onChange={(e) => setuserLogin(e.target.value)}
                ></Input>
                <Button
                  id="search-button"
                  onClick={() => {
                    findUserByLogin(userLogin);
                  }}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Search
                </Button>
                <div className="select-users">
                  <div className="select-users--title">
                    <h3 className="first-title">Found Users</h3>
                    <h3 className="second-title">Add Users To Chat</h3>
                  </div>
                  <div className="select-users--delete">
                    {usersFromChat && usersFromChat.length > 0
                      ? usersFromChat.map((item, index) => (
                          <span
                          key={index.toString()}
                            onClick={(event) => {
                              if (
                                usersToChat.includes(event.target.innerText)
                              ) {
                                return;
                              }
                              onAddUsersBackToChat(
                                "saveFoundUsersLogin",
                                event.target.innerText
                              );
                            }}
                          >
                            {item}
                          </span>
                        ))
                      : ""}
                  </div>
                  <div className="select-users--add">
                    {usersToChat && usersToChat.length > 0
                      ? usersToChat.map((item, index) => (
                          <span
                          key={index.toString()}
                            onClick={(event) => {
                              if (
                                usersFromChat.includes(event.target.innerText)
                              ) {
                                return;
                              }
                              onDeleteUsersLogin(
                                "addOrDeleteUserToChat",
                                event.target.innerText
                              );
                            }}
                          >
                            {item}
                          </span>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="ant-btn ant-btn-primary" onClick>
                  Submit
                </button>
                <button
                  className="ant-btn ant-btn-primary"
                  onClick={(e) => updateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </MyPortal>
      </>
    );
  }
);

export default MyModal;
