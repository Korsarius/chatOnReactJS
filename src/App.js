import React, { useState, useEffect } from "react";
import { Router, Route, Link, Switch } from "react-router-dom";
// import createHistory from "history/createBrowserHistory";
import { createBrowserHistory } from "history";
import Routes from "./components";
import { Provider, connect } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers/allReducers";
import { actionToken } from "./actions/authorization";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  youtube,
  emojiSend,
  YOUTUBE_REGEXP,
  EMOJI_REGEXP,
} from "./components/emojiList";
import "./App.css";

// SOCKET.IO

import io from "socket.io-client";
import { actionSaveMessages } from "./actions/chatMessages";
// import { store } from "../App";

const socket = io("http://chat.fs.a-level.com.ua/");
if (localStorage.authToken) socket.emit("jwt", localStorage.authToken);

socket.on("jwt_ok", (data) => console.log(data));
socket.on("jwt_fail", (error) => console.log(error));
socket.on("msg", (msg) => {
  console.log(msg);
  // if (YOUTUBE_REGEXP.test(msg.text)) {
  //   msg.text = youtube(msg.text);
  return store.dispatch(
    actionSaveMessages([msg], msg.chat._id, msg.chat.title)
  );
});

// export default socket;

// SOCKET.IO END

const GETGQL = (url, headers = {}) => (query = "", variables = {}) =>
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json());

// const originalFetch = fetch;
// fetch = (
//   url,
//   params = {
//     headers: {},
//   }
// ) => {
//   params.headers.Authorization = "Bearer " + localStorage.authToken;
//   return originalFetch(url, params);
// };

export const GQL = GETGQL("/graphql", {
  Authorization: "Bearer " + localStorage.authToken,
});

const history = createBrowserHistory();

export let check = function ({ 1: path }, obj) {
  path = path.split(".");
  for (let i of path) {
    if (!obj[i]) {
      return obj;
    } else {
      obj = obj[i];
    }
  }
  return obj;
};

export let checkTwo = ({ 1: path }, obj, key, restOfPath) =>
  !path
    ? obj
    : (([key, ...restOfPath] = path.split(".")),
      obj[key] && checkTwo([, restOfPath.join(".")], obj[key]));

export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

if (localStorage.authToken) {
  store.dispatch(actionToken(localStorage.authToken));
  // store.dispatch(actionUserFindOne(store.getState().state.AuthReducer.data.sub.login));
}

store.subscribe(() => console.log(store.getState()));

function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
        <Routes history={history} />
      </Provider>
    </Router>
  );
}

export default App;
