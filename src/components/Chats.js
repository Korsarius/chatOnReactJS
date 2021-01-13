import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars";
import {
  actionUserFindOne,
  actionGetMessages,
  actionSetMessage,
} from "../actions/requests";
import { checkTwo } from "../App";
import {
  EmojiList,
  youtube,
  emojiSend,
  YOUTUBE_REGEXP,
  EMOJI_REGEXP,
} from "./emojiList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import "./styles/user-page.css";
import "./styles/smile-icon--btn.css";

// const smileIcon = <FontAwesomeIcon icon={faSmile} size="lg" />;
var counter = 0;

const mapStateToPropsChats = (state) => ({
  state: state,
  message: checkTwo`${state}promiseReducer.oneChatMessages.payload.data.ChatFindOne.messages`,
  allMessages: checkTwo`${state}chatMessagesReducer`,
});
const mapDispatchToPropsChats = {
  onSendMessage: actionSetMessage,
  onGetMessages: actionGetMessages,
  onUserFindOne: actionUserFindOne,
};

const Chats = connect(
  mapStateToPropsChats,
  mapDispatchToPropsChats
)(
  ({
    message,
    allMessages,
    onGetMessages,
    onUserFindOne,
    onSendMessage,
    login,
    match: {
      params: { chatId },
    },
  }) => {
    const [msg, setMsg] = useState("");

    const [scrollBottom, setScrollBottom] = useState(0);
    const [scrollToBottom, setScrollToBottom] = useState(0);

    const ref = useRef();

    useEffect(() => {
      onGetMessages(chatId);
      onUserFindOne(login);
    }, [chatId]);

    useEffect(() => {
      if (msg === "") {
        // Это чтобы после отправки сообщения, окно чата опускалось максимально вниз
        setTimeout(() => {
          ref.current.scrollToBottom();
        }, 500);
      }
    }, [msg]);

    return (
      // <div className="chats-wrapper">
      <div className="chats">
        <Scrollbars
          universal
          ref={ref}
          thumbSize={150}
          onScroll={() => {
            setScrollToBottom(() => ref.current.getScrollTop());
          }}
        >
          {allMessages &&
            allMessages[chatId] &&
            allMessages[chatId].map((element, index) => (
              // element.text === YOUTUBE_REGEXP ? youtube(element.text) : (
              <p className="message">
                <span className="message-nick">{element.owner.nick}: </span>
                {/* {element.text} */}
                {EMOJI_REGEXP.test(element.text)
                  ? (element.text = emojiSend(element.text))
                  : element.text}
                <span className="message-data">
                  {new RegExp(/(-+)|(:+)/gi).test(element.createdAt)
                    ? new Date(element.createdAt).toLocaleString()
                    : new Date(+element.createdAt).toLocaleString()}
                </span>
              </p>
              // )
            ))}
        </Scrollbars>
        <div className="scroll-down">
          <span
            className="icon-circle-down"
            style={{
              visibility: scrollBottom == scrollToBottom ? "hidden" : "visible",
            }}
            onClick={() => {
              ref.current.scrollToBottom();
              setScrollBottom(() => ref.current.getScrollTop());
            }}
          ></span>
        </div>
        <div className="send-message">
          <input
            id="input-message"
            placeholder="Enter Message"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                let msgText = document.querySelector("#input-message");
                setMsg(() => "");
                return onSendMessage(chatId, msgText.value);
              }
            }}
          />
          <span
            class="icon-happy"
            onClick={(event) => {
              let eList = document.querySelector("#emojiList");
              counter++;
              if (counter % 2 === 0) {
                eList.style = "display: none";
              } else {
                eList.style = "display: block";
              }
            }}
          ></span>
          <button
            className="send-msg--btn"
            style={{ cursor: "pointer" }}
            // onMouseEnter={() => {
            //   let eList = document.querySelector("#emojiList");
            //   eList.style = "display: block";
            // }}
            // onMouseLeave={() => {
            //   let eList = document.querySelector("#emojiList");
            //   eList.style = "display: none";
            // }}
            onClick={() => {
              let eList = document.querySelector("#emojiList");
              let msgText = document.querySelector("#input-message");
              eList.style = "display: none";
              setMsg(() => "");
              return onSendMessage(chatId, msgText.value);
            }}
          >
            Send
          </button>
        </div>
        {/* <div id="emojiList">{emojiArray.map((item, index) => {
          item
        })}</div> */}
        <EmojiList />
      </div>
      // </div>
    );
  }
);

export default Chats;
