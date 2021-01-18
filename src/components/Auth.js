import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { actionUserFindOne } from "../actions/requests";
import { checkTwo } from "../App";
import UserInfo from "../components/UserInfo";
import Chats from "../components/Chats";
import SearchUser from "../components/SearchUser";
import "./styles/user-page.css";

var user;

const mapStateToProps = (state) => ({
  token: state && state.AuthReducer && state.AuthReducer.token,
  login: checkTwo`${state}AuthReducer.data.sub.login`,
  authUserInfo: checkTwo`${state}promiseReducer.userFindOne.payload.data.UserFindOne`,
  media: state,
  state: state,
});
const mapDispatchToProps = {
  onUserFindOne: actionUserFindOne,
};

export const User = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ login, history, onUserFindOne, authUserInfo, match }) => {
  useEffect(() => {
    setTimeout(()=>{
      onUserFindOne(login)
    },1000);
    // let object = JSON.parse(localStorage.getItem("authUser"));
    // if (!localStorage.authUser) {
    //   localStorage.setItem("authUser", JSON.stringify(authUserInfo));
    //   user = JSON.parse(localStorage.getItem("authUser"));
    // }
  }, []);

  return (
    <section className="auth-user">
      <UserInfo
        history={history}
        login={login}
        onUserFindOne={onUserFindOne}
        // user={user}
      />
      <Chats login={login} match={match} />
      <SearchUser login={login} onUserFindOne={onUserFindOne} />
    </section>
  );
});

export default User;
